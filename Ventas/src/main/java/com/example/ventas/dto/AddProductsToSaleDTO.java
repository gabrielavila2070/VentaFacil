package com.example.ventas.dto;

import com.sun.istack.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
public class AddProductsToSaleDTO {
    @NotNull
    private List<Long> productIds = new ArrayList<>();
    private List<Integer> quantities = new ArrayList<>();
    public List<Long> getProductIds() {
        return productIds != null ? productIds : List.of();
    }
    public List<Integer> getQuantities(){
        return quantities != null ? quantities : List.of();
    }


}