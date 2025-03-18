package com.example.ventas.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class AddProductsToSaleDTO {
    private List<Long> productIds;
}