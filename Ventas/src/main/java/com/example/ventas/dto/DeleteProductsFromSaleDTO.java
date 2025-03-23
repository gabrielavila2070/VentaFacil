package com.example.ventas.dto;

import lombok.Getter;
import lombok.Setter;


import java.util.Map;

@Getter
@Setter
public class DeleteProductsFromSaleDTO {
    private Map<Long, Integer> products;
}