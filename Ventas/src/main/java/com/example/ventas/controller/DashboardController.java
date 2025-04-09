package com.example.ventas.controller;

import com.example.ventas.dto.TopProductDTO;
import com.example.ventas.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/metrics")
    public Map<String, Object> getDashboardMetrics() {
        BigDecimal totalRevenue = dashboardService.getTotalRevenue();
        Long totalClosedSales = dashboardService.getTotalClosedSales();
        List<TopProductDTO> topProducts = dashboardService.getTopProducts();

        return Map.of(
                "totalRevenue", totalRevenue,
                "totalClosedSales", totalClosedSales,
                "topProducts", topProducts
        );
    }
}
