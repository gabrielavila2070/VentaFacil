package com.example.ventas.dto;

import com.example.ventas.model.SaleStatus;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SaleUpdateRequestDTO {
    private List<Long> productIds = new ArrayList<>();
    private List<Integer> quantities = new ArrayList<>();
    private Double total;
    private SaleStatus saleStatus;
}