package com.example.ventas.model;

import jakarta.persistence.Embeddable;
import lombok.*;

import java.io.Serializable;
import java.util.Objects;
@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class ClosedSaleProductId implements Serializable {

    private Long closedSaleId;
    private Long productId;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        SaleProductId that = (SaleProductId) o;
        return Objects.equals(closedSaleId, that.getSaleId()) &&
                Objects.equals(productId, that.getProductId());
    }

    @Override
    public int hashCode() {
        return Objects.hash(closedSaleId, productId);
    }
}
