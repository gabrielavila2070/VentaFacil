package com.example.ventas.service;

import com.example.ventas.dto.AddProductsToSaleDTO;
import com.example.ventas.dto.SaleRequestDTO;
import com.example.ventas.dto.SaleUpdateRequestDTO;
import com.example.ventas.model.Client;
import com.example.ventas.model.Product;
import com.example.ventas.model.Sale;
import com.example.ventas.model.SaleProduct;
import com.example.ventas.model.User;
import com.example.ventas.repository.ClientRepository;
import com.example.ventas.repository.ProductRepository;
import com.example.ventas.repository.SaleProductRepository;
import com.example.ventas.repository.SaleRepository;
import com.example.ventas.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
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

    public List<Sale> getAllSale() {
        return saleRepository.findAll();
    }

    public Optional<Sale> getSaleById(Long id) {
        return saleRepository.findById(id);
    }

    public Sale saveSale(SaleRequestDTO saleRequest) {
        Client client = clientRepository.findById(saleRequest.getClientId())
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));

        User preventista = userRepository.findById(saleRequest.getPreventistaId())
                .orElseThrow(() -> new RuntimeException("Preventista no encontrado"));

        Sale sale = new Sale();
        sale.setClient(client);
        sale.setPreventista(preventista);
        sale.setTotal(saleRequest.getTotal());

        Sale savedSale = saleRepository.save(sale);

        List<SaleProduct> saleProducts = saleRequest.getProductIds().stream()
                .map(productId -> {
                    Product product = productRepository.findById(productId)
                            .orElseThrow(() -> new RuntimeException("Producto no encontrado: " + productId));
                    SaleProduct saleProduct = new SaleProduct();
                    saleProduct.setSale(savedSale);
                    saleProduct.setProduct(product);
                    saleProduct.setQuantity(1); // Ajusta la cantidad según sea necesario
                    return saleProduct;
                })
                .collect(Collectors.toList());

        saleProductRepository.saveAll(saleProducts);

        return savedSale;
    }

    public Optional<Sale> updateSale(Long id, SaleUpdateRequestDTO saleUpdateRequest) {
        return saleRepository.findById(id).map(sale -> {
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

            return saleRepository.save(sale);
        });
    }

    public void deleteSale(Long id) {
        saleRepository.deleteById(id);
    }

    public Optional<Sale> addProductsToSale(Long id, AddProductsToSaleDTO addProductsToSaleDTO) {
        return saleRepository.findById(id).map(sale -> {
            List<SaleProduct> newSaleProducts = addProductsToSaleDTO.getProductIds().stream()
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

            List<SaleProduct> existingSaleProducts = sale.getSaleProducts();
            existingSaleProducts.addAll(newSaleProducts);

            sale.setSaleProducts(existingSaleProducts);
            sale.setTotal(existingSaleProducts.stream()
                    .mapToDouble(sp -> sp.getProduct().getPrice() * sp.getQuantity())
                    .sum());

            return saleRepository.save(sale);
        });
    }
}