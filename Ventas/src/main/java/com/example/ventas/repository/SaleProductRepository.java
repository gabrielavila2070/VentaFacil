package com.example.ventas.repository;

import com.example.ventas.model.SaleProduct;
import com.example.ventas.model.SaleProductId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SaleProductRepository extends JpaRepository<SaleProduct, SaleProductId> {
    List<SaleProduct> findBySaleId(Long saleId);

}