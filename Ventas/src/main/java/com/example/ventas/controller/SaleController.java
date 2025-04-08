package com.example.ventas.controller;

import com.example.ventas.dto.*;
import com.example.ventas.model.ClosedSale;
import com.example.ventas.model.Sale;
import com.example.ventas.service.SaleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/sales")
public class SaleController {
    @Autowired
    private SaleService saleService;

    @GetMapping
    public List<SaleResponseDTO> getAllSales() {
        return saleService.getAllSale().stream()
                .map(SaleResponseDTO::new)
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<SaleResponseDTO> getSaleById(@PathVariable Long id) {
        Optional<Sale> sale = saleService.getSaleById(id);
        return sale.map(s -> ResponseEntity.ok(new SaleResponseDTO(s)))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<SaleResponseDTO> createSale(@RequestBody SaleRequestDTO saleRequest) {
        try {
            Sale newSale = saleService.saveSale(saleRequest);
            return ResponseEntity.ok(new SaleResponseDTO(newSale));
        } catch (RuntimeException e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(null);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<SaleResponseDTO> updateSale(@PathVariable Long id, @RequestBody SaleUpdateRequestDTO saleUpdateRequest) {
        try {
            Optional<Sale> updatedSale = saleService.updateSale(id, saleUpdateRequest);
            return updatedSale.map(s -> ResponseEntity.ok(new SaleResponseDTO(s)))
                    .orElseGet(() -> ResponseEntity.notFound().build());
        } catch (RuntimeException e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(null);
        }
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSale(@PathVariable Long id) {
        saleService.deleteSale(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/close")
    public ResponseEntity<ClosedSaleResponseDTO> closeSale(@PathVariable Long id) {
        try {
            ClosedSale closed = saleService.closeSale(id);
            // Convertir ClosedSale a DTO
            ClosedSaleResponseDTO dto = new ClosedSaleResponseDTO(closed);
            return ResponseEntity.ok(dto);
        } catch (RuntimeException e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/closed-sales")
    public ResponseEntity<List<ClosedSaleResponseDTO>> getClosedSales() {
        try {
            List<ClosedSale> closedSales = saleService.getClosedSales();
            List<ClosedSaleResponseDTO> dtos = closedSales.stream()
                    .map(ClosedSaleResponseDTO::new)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(dtos);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    @GetMapping("/closed-sales/{id}")
    public ResponseEntity<ClosedSaleResponseDTO> getClosedSaleDetail(@PathVariable Long id) {
        try {
            ClosedSale closedSale = saleService.getClosedSaleById(id);
            ClosedSaleResponseDTO dto = new ClosedSaleResponseDTO(closedSale);
            return ResponseEntity.ok(dto);
        } catch (RuntimeException e) {
            e.printStackTrace();
            return ResponseEntity.notFound().build();
        }
    }
    @DeleteMapping("/closed-sales/{id}")
    public ResponseEntity<Void> deleteClosedSale(@PathVariable Long id) {
        try {
            saleService.deleteClosedSale(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }
    @PutMapping("/{id}/products")
    public ResponseEntity<SaleResponseDTO> addProductsToSale(@PathVariable Long id, @RequestBody AddProductsToSaleDTO addProductsToSaleDTO) {
        try {
            Optional<Sale> updatedSale = saleService.addProductsToSale(id, addProductsToSaleDTO);
            return updatedSale.map(s -> ResponseEntity.ok(new SaleResponseDTO(s)))
                    .orElseGet(() -> ResponseEntity.notFound().build());
        } catch (RuntimeException e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(null);
        }
    }
    @DeleteMapping("/{id}/products")
    public ResponseEntity<SaleResponseDTO> deleteProductsFromSale(@PathVariable Long id, @RequestBody DeleteProductsFromSaleDTO deleteProductsFromSaleDTO){
        try{
            Optional<Sale> updatedSale = saleService.deleteProductsFromSale(id, deleteProductsFromSaleDTO);
            return updatedSale.map(s -> ResponseEntity.ok(new SaleResponseDTO(s)))
                    .orElseGet(() -> ResponseEntity.notFound().build());
        } catch (RuntimeException e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(null);
        }
    }
}