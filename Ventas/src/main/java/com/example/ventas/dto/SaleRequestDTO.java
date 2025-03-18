package com.example.ventas.dto;

import lombok.*;

import java.util.List;


@Getter
@Setter
public class SaleRequestDTO {
    private Long clientId;
    private Long preventistaId;
    private List<Long> productIds;
    private double total;

}
