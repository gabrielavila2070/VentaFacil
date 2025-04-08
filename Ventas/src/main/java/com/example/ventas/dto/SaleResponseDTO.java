package com.example.ventas.dto;

import com.example.ventas.model.Sale;
import com.example.ventas.model.SaleProduct;

import com.example.ventas.model.SaleStatus;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
public class SaleResponseDTO {
    private Long id;
    private String clientName;
    private String preventistaName;
    private List<ProductDTO> products;
    private double total;
    private SaleStatus saleStatus;

    public SaleResponseDTO(Sale sale) {
        this.id = sale.getId();
        this.clientName = sale.getClient().getName();
        this.preventistaName = sale.getPreventista().getName();
        this.products = sale.getSaleProducts().stream()
                .map(saleProduct -> new ProductDTO(saleProduct.getProduct(), saleProduct.getQuantity()))
                .collect(Collectors.toList());
        this.saleStatus = sale.getSaleStatus();
        this.total = sale.getTotal();
    }
}