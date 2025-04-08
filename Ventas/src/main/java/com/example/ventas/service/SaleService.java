package com.example.ventas.service;

import com.example.ventas.dto.AddProductsToSaleDTO;
import com.example.ventas.dto.DeleteProductsFromSaleDTO;
import com.example.ventas.dto.SaleRequestDTO;
import com.example.ventas.dto.SaleUpdateRequestDTO;
import com.example.ventas.model.*;
import com.example.ventas.repository.*;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class SaleService {
    @Autowired
    private SaleRepository saleRepository;
    @Autowired
    private ClientRepository clientRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private SaleProductRepository saleProductRepository;
    @Autowired
    private ClosedSaleRepository closedSaleRepository;

    public List<Sale> getAllSale() {
        return saleRepository.findAll();
    }

    public Optional<Sale> getSaleById(Long id) {
        return saleRepository.findById(id);
    }

    public Sale saveSale(SaleRequestDTO saleRequest) {
        if (saleRequest.getProducts() == null || saleRequest.getProducts().isEmpty()) {
            throw new RuntimeException("La lista de productos no puede estar vacía");
        }

        Client client = clientRepository.findById(saleRequest.getClientId())
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));

        User preventista = userRepository.findById(saleRequest.getPreventistaId())
                .orElseThrow(() -> new RuntimeException("Preventista no encontrado"));

        // Primero guardamos la venta para generar el ID
        Sale sale = new Sale();
        sale.setClient(client);
        sale.setPreventista(preventista);
        sale.setTotal(saleRequest.getTotal());
        sale.setSaleStatus(saleRequest.getSaleStatus() != null ?
                saleRequest.getSaleStatus() :
                SaleStatus.PENDIENTE);
        Sale savedSale = saleRepository.save(sale); // ✅ Aquí se genera el ID de la venta

        // creamos los productos asociados con la venta
        List<SaleProduct> saleProducts = saleRequest.getProducts().stream()
                .map(productDTO -> {
                    Product product = productRepository.findById(productDTO.getId())
                            .orElseThrow(() -> new RuntimeException("Producto no encontrado: " + productDTO.getId()));

                    return new SaleProduct(savedSale, product, productDTO.getQuantity());
                })
                .collect(Collectors.toList());

        saleProductRepository.saveAll(saleProducts);

        return savedSale;
    }

    public List<ClosedSale> getClosedSales() {
        return closedSaleRepository.findAll();}
    public ClosedSale getClosedSaleById(Long id) {
        return closedSaleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Venta cerrada no encontrada con ID: " + id));
    }
    @Transactional
    public void deleteClosedSale(Long id) {
        ClosedSale closedSale = closedSaleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Venta cerrada no encontrada"));
        closedSaleRepository.delete(closedSale);
    }
    public Optional<Sale> updateSale(Long id, SaleUpdateRequestDTO saleUpdateRequest) {
        return saleRepository.findById(id).map(sale -> {
            // Actualizar productos sólo si se envía una lista no vacía en el DTO
            if (saleUpdateRequest.getProductIds() != null && !saleUpdateRequest.getProductIds().isEmpty()) {
                List<SaleProduct> existingSaleProducts = sale.getSaleProducts();
                List<SaleProduct> newSaleProducts = saleUpdateRequest.getProductIds().stream()
                        .map(productId -> {
                            Product product = productRepository.findById(productId)
                                    .orElseThrow(() -> new RuntimeException("Producto no encontrado: " + productId));
                            SaleProduct saleProduct = new SaleProduct();
                            saleProduct.setSale(sale);
                            saleProduct.setProduct(product);
                            saleProduct.setQuantity(1); // Ajusta la cantidad según sea necesario
                            return saleProduct;
                        })
                        .collect(Collectors.toList());
                existingSaleProducts.addAll(newSaleProducts);
                sale.setSaleProducts(existingSaleProducts);

                double total = existingSaleProducts.stream()
                        .mapToDouble(sp -> sp.getProduct().getPrice() * sp.getQuantity())
                        .sum();
                sale.setTotal(total);
            }

            // Actualizar estado si se envía en el DTO
            if (saleUpdateRequest.getSaleStatus() != null) {
                sale.setSaleStatus(saleUpdateRequest.getSaleStatus());
            }

            return saleRepository.save(sale);
        });
    }

    @Transactional
    public ClosedSale closeSale(Long saleId) {
        // Buscar la venta original
        Sale sale = saleRepository.findById(saleId)
                .orElseThrow(() -> new RuntimeException("Venta no encontrada"));

        // Verificar que el estado sea ENTREGADO
        if (!sale.getSaleStatus().equals(SaleStatus.ENTREGADO)) {
            throw new RuntimeException("Solo se pueden cerrar ventas entregadas.");
        }

        // Crear la entidad ClosedSale
        ClosedSale closedSale = new ClosedSale();
        closedSale.setOriginalSaleId(sale.getId());
        closedSale.setClient(sale.getClient());
        closedSale.setTotal(sale.getTotal());
        closedSale.setDateClosed(LocalDateTime.now());

        // Mapear los productos de la venta a ClosedSaleProduct
        List<ClosedSaleProduct> closedSaleProducts = sale.getSaleProducts().stream()
                .map(sp -> {
                    double total = sp.getProduct().getPrice();
                    ClosedSaleProduct csp = new ClosedSaleProduct();
                    csp.setClosedSale(closedSale);
                    csp.setProduct(sp.getProduct());
                    csp.setQuantity(sp.getQuantity());
                    csp.setTotal(total);
                    // Inicialmente, dejamos la clave compuesta con null en closedSaleId
                    csp.setId(new ClosedSaleProductId(null, sp.getProduct().getId()));
                    return csp;
                })
                .collect(Collectors.toList());
        closedSale.setClosedSaleProducts(closedSaleProducts);

        // Guardar la venta cerrada
        ClosedSale savedClosedSale = closedSaleRepository.save(closedSale);

        // Completar las claves compuestas de ClosedSaleProduct si es necesario
        savedClosedSale.getClosedSaleProducts().forEach(csp ->
                csp.setId(new ClosedSaleProductId(savedClosedSale.getId(), csp.getProduct().getId()))
        );
        closedSaleRepository.save(savedClosedSale);

        // Eliminar la venta original de la base de datos (junto con sus asociaciones, si las cascadas están bien configuradas)
        saleRepository.delete(sale);

        return savedClosedSale;
    }
    public void deleteSale(Long id) {
        saleRepository.deleteById(id);
    }

    @Transactional
    public Optional<Sale> addProductsToSale(Long id, AddProductsToSaleDTO addProductsToSaleDTO) {
        return saleRepository.findById(id).map(sale -> {
            List<Long> productIdsToAdd = addProductsToSaleDTO.getProductIds();
            List<Integer> quantitiesToAdd = addProductsToSaleDTO.getQuantities();

            if (productIdsToAdd.size() != quantitiesToAdd.size()) {
                throw new IllegalArgumentException("Las listas de productIds y quantities deben tener el mismo tamaño.");
            }

            for (int i = 0; i < productIdsToAdd.size(); i++) {
                Long productIdToAdd = productIdsToAdd.get(i);
                Integer quantityToAdd = quantitiesToAdd.get(i);

                Product product = productRepository.findById(productIdToAdd)
                        .orElseThrow(() -> new RuntimeException("Producto no encontrado: " + productIdToAdd));

                if (product.getStock() < quantityToAdd) {
                    throw new IllegalArgumentException("La cantidad solicitada para '" + product.getName() +
                            "' supera el stock disponible (" + product.getStock() + ").");
                }

                SaleProductId saleProductId = new SaleProductId(sale.getId(), product.getId());
                Optional<SaleProduct> existingSaleProduct = saleProductRepository.findById(saleProductId);

                if (existingSaleProduct.isPresent()) {
                    SaleProduct sp = existingSaleProduct.get();
                    sp.setQuantity(sp.getQuantity() + quantityToAdd); // Sumar la cantidad enviada a la existente
                    saleProductRepository.save(sp);
                } else {
                    SaleProduct newSaleProduct = new SaleProduct();
                    newSaleProduct.setId(saleProductId);
                    newSaleProduct.setSale(sale);
                    newSaleProduct.setProduct(product);
                    newSaleProduct.setQuantity(quantityToAdd); // Establecer la cantidad enviada
                    saleProductRepository.save(newSaleProduct);
                    sale.getSaleProducts().add(newSaleProduct);
                }
            }

            sale.setTotal(sale.getSaleProducts().stream()
                    .mapToDouble(sp -> sp.getProduct().getPrice() * sp.getQuantity())
                    .sum());

            return saleRepository.save(sale);
        });
    }
    @Transactional
    public Optional<Sale> deleteProductsFromSale(Long saleId, DeleteProductsFromSaleDTO deleteProductsFromSaleDTO) {
        return saleRepository.findById(saleId).map(sale -> {
            // Convertir las claves String a Long
            Map<Long, Integer> productQuantities = deleteProductsFromSaleDTO.getProducts()
                    .entrySet()
                    .stream()
                    .collect(Collectors.toMap(entry -> Long.parseLong(String.valueOf(entry.getKey())), Map.Entry::getValue));

            // Iterar sobre los productos a eliminar
            productQuantities.forEach((productId, quantityToRemove) -> {
                SaleProductId saleProductId = new SaleProductId(saleId, productId);
                Optional<SaleProduct> existingSaleProduct = saleProductRepository.findById(saleProductId);

                if (existingSaleProduct.isPresent()) {
                    SaleProduct sp = existingSaleProduct.get();
                    if (sp.getQuantity() > quantityToRemove) {
                        sp.setQuantity(sp.getQuantity() - quantityToRemove); // Resta solo la cantidad indicada
                        saleProductRepository.save(sp);
                    } else {
                        saleProductRepository.delete(sp); // Si la cantidad es igual o menor, eliminar el producto
                        sale.getSaleProducts().remove(sp);
                    }
                }
            });

            // Recalcular el total de la venta
            sale.setTotal(sale.getSaleProducts().stream()
                    .mapToDouble(sp -> sp.getProduct().getPrice() * sp.getQuantity())
                    .sum());

            return saleRepository.save(sale);
        });
    }
}