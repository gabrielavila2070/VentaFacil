package com.example.ventas.dto;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SaleUpdateRequestDTO {
    private List<Long> productIds;
    private Double total;
}