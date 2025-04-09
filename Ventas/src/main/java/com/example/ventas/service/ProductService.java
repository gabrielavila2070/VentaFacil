package com.example.ventas.service;

import com.example.ventas.model.Product;
import com.example.ventas.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductService {
    @Autowired
    private ProductRepository productRepository;

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Optional<Product> getProductById(Long id) {
        return productRepository.findById(id);
    }

    public Product saveProduct(Product product) {
        return productRepository.save(product);
    }

    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }
    public Integer getTotalStock() {
        return productRepository.getTotalStock();
    }


    public Optional<Product> updateProduct(Long id, Product productDetails) {
        Optional<Product> existingProductOptional = productRepository.findById(id);

        if (existingProductOptional.isPresent()) {
            Product existingProduct = existingProductOptional.get();

            if (productDetails.getName() != null) {
                existingProduct.setName(productDetails.getName());
            }
            if (productDetails.getPrice() != null) {
                existingProduct.setPrice(productDetails.getPrice());
            }
            if (productDetails.getStock() != null) {
                existingProduct.setStock(productDetails.getStock());
            }

            Product updatedProduct = productRepository.save(existingProduct);
            return Optional.of(updatedProduct);
        } else {
            return Optional.empty();
        }
    }
}
