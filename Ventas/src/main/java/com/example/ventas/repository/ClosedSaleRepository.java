package com.example.ventas.repository;


import com.example.ventas.model.ClosedSale;
import com.example.ventas.model.Sale;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ClosedSaleRepository extends JpaRepository<ClosedSale, Long> {
}