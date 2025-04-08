package com.example.ventas.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ClosedSaleProductDTO {
    private Long productId;
    private String productName;
    private Integer quantity;
    private double total;

    public ClosedSaleProductDTO(Long productId, String productName, Integer quantity, double total) {
        this.productId = productId;
        this.productName = productName;
        this.quantity = quantity;
        this.total = total ;
    }
}