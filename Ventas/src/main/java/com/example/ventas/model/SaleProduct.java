package com.example.ventas.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "sale_product")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SaleProduct {

    @EmbeddedId
    private SaleProductId id; // Clave primaria compuesta

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("saleId") // Enlaza con la clave compuesta
    @JoinColumn(name = "sale_id", nullable = false)
    private Sale sale;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("productId") // Enlaza con la clave compuesta
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(nullable = false)
    private Integer quantity;

    public SaleProduct(Sale sale, Product product, Integer quantity) {
        this.sale = sale;
        this.product = product;
        this.quantity = quantity;
        this.id = new SaleProductId(sale.getId(), product.getId());
    }
}
