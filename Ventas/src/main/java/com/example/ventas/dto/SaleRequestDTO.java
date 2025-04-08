package com.example.ventas.dto;

import com.example.ventas.model.SaleStatus;
import lombok.*;

import java.util.List;


@Getter
@Setter
public class SaleRequestDTO {
    private Long clientId;
    private Long preventistaId;
    private List<ProductDTO> products;
    private double total;
    private SaleStatus saleStatus;

}
