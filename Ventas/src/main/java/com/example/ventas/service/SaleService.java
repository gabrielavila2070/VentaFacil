package com.example.ventas.service;

import com.example.ventas.model.Client;
import com.example.ventas.model.Product;
import com.example.ventas.model.Sale;
import com.example.ventas.model.User;
import com.example.ventas.repository.ClientRepository;
import com.example.ventas.repository.ProductRepository;
import com.example.ventas.repository.SaleRepository;
import com.example.ventas.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
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

    public List<Sale> getAllSale() {
        return saleRepository.findAll();
    }

    public Optional<Sale> getSaleById(Long id) {
        return saleRepository.findById(id);
    }

    public Sale saveSale(Sale sale) {
        if (sale.getClient() == null || sale.getClient().getId() == null) {
            throw new RuntimeException("El cliente no puede ser nulo.");
        }

        Client client = clientRepository.findById(sale.getClient().getId())
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));

        if (sale.getPreventista() == null || sale.getPreventista().getId() == null) {
            throw new RuntimeException("El preventista no puede ser nulo.");
        }

        User preventista = userRepository.findById(sale.getPreventista().getId())
                .orElseThrow(() -> new RuntimeException("Preventista no encontrado"));

        List<Product> products = sale.getProducts() == null ? new ArrayList<>() : sale.getProducts();
        List<Product> validProducts = new ArrayList<>();

        for (Product product : products) {
            Product foundProduct = productRepository.findById(product.getId())
                    .orElseThrow(() -> new RuntimeException("Producto no encontrado: " + product.getId()));
            validProducts.add(foundProduct);
        }

        sale.setClient(client);
        sale.setPreventista(preventista);
        sale.setProducts(validProducts);

        return saleRepository.save(sale);
    }

    public void deleteSale(Long id) {
        saleRepository.deleteById(id);
    }
}
