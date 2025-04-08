package com.example.ventas.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
@Entity
@Table(name = "closed_sale_product")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ClosedSaleProduct {

    @EmbeddedId
    private ClosedSaleProductId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("closedSaleId")
    @JoinColumn(name = "closed_sale_id", nullable = false)
    private ClosedSale closedSale;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("productId")
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(nullable = false)
    private Integer quantity;

    @Column(nullable = false)
    private double total;

    public ClosedSaleProduct(ClosedSale closedSale, Product product, Integer quantity,Double total) {
        this.closedSale = closedSale;
        this.product = product;
        this.quantity = quantity;
        this.total = total;
        this.id = new ClosedSaleProductId(closedSale.getId(), product.getId());
    }
}
