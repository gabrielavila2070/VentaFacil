package com.example.ventas.repository;

import com.example.ventas.dto.TopProductDTO;
import com.example.ventas.model.Sale;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.awt.print.Pageable;
import java.util.List;

@Repository
public interface SaleRepository extends JpaRepository<Sale, Long> {



}
