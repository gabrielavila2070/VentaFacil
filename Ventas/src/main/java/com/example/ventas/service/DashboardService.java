package com.example.ventas.service;

import com.example.ventas.dto.TopProductDTO;
import com.example.ventas.repository.ClosedSaleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final ClosedSaleRepository closedSaleRepository;

    public BigDecimal getTotalRevenue() {
        return closedSaleRepository.sumTotalRevenue();
    }

    public Long getTotalClosedSales() {
        return closedSaleRepository.count();
    }

    public List<TopProductDTO> getTopProducts() {
        return closedSaleRepository.findTopSellingProducts();
    }
}
