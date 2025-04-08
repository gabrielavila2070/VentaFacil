package com.example.ventas.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ClosedSale {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long originalSaleId;

    @ManyToOne
    private Client client;

    @OneToMany(mappedBy = "closedSale", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ClosedSaleProduct> closedSaleProducts = new ArrayList<>();

    private Double total;

    private LocalDateTime dateClosed;
}
