package com.example.ventas.dto;

import com.example.ventas.model.ClosedSale;
import com.example.ventas.model.ClosedSaleProduct;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class ClosedSaleResponseDTO {
    private Long id;
    private Long originalSaleId;
    private String clientName;
    private double total;
    private LocalDateTime dateClosed;
    private List<ClosedSaleProductDTO> products;

    public ClosedSaleResponseDTO(ClosedSale closedSale) {
        this.id = closedSale.getId();
        this.originalSaleId = closedSale.getOriginalSaleId();
        this.clientName = closedSale.getClient().getName();
        this.total = closedSale.getTotal();
        this.dateClosed = closedSale.getDateClosed();
        this.products = closedSale.getClosedSaleProducts().stream()
                .map(csp -> new ClosedSaleProductDTO(
                        csp.getProduct().getId(),
                        csp.getProduct().getName(),
                        csp.getQuantity(),
                        csp.getTotal()))
                .collect(Collectors.toList());
    }
}