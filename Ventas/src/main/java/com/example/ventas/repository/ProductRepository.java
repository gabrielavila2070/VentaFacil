package com.example.ventas.repository;

import com.example.ventas.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    @Query("SELECT COALESCE(SUM(p.stock), 0) FROM Product p")
    Integer getTotalStock();

}
