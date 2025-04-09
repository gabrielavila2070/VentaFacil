package com.example.ventas.repository;


import com.example.ventas.dto.TopProductDTO;
import com.example.ventas.model.ClosedSale;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ClosedSaleRepository extends JpaRepository<ClosedSale, Long> {
    @Query("SELECT COALESCE(SUM(cs.total), 0) FROM ClosedSale cs")
    BigDecimal sumTotalRevenue();
    @Query("SELECT COALESCE(SUM(cs.total), 0) FROM ClosedSale cs")
    Double getTotalClosedSales();
    @Query("SELECT cs FROM ClosedSale cs " +
            "WHERE (:startDate IS NULL OR cs.dateClosed >= :startDate) " +
            "AND (:endDate IS NULL OR cs.dateClosed <= :endDate) " +
            "ORDER BY cs.dateClosed DESC")
    List<ClosedSale> findByDateRange(
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate
    );
    List<ClosedSale> findAllByOrderByDateClosedDesc();




    @Query("""
    SELECT p.name AS productName, SUM(cp.quantity) AS totalQuantity
    FROM ClosedSaleProduct cp
    JOIN cp.product p
    GROUP BY p.name
    ORDER BY totalQuantity DESC
    """)
    List<TopProductDTO> findTopSellingProducts();


}