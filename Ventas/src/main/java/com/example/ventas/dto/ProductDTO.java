package com.example.ventas.dto;

import com.example.ventas.model.Product;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@Getter
@Setter
public class ProductDTO {
    private Long id;
    private String name;
    private double price;
    private int stock;
    private int quantity;

    public ProductDTO(Product product, int quantity) {
        this.id = product.getId();
        this.name = product.getName();
        this.price = product.getPrice();
        this.stock = product.getStock();
        this.quantity = quantity;
    }
}