package com.example.ventas.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.Map;

@Getter
@Setter
public class DeleteProductsFromSaleDTO {
    private List<Long> productIds;
    private Map<String, Integer> products;
}