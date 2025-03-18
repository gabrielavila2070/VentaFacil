package com.example.ventas.model;

import com.sun.istack.NotNull;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "sale")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Sale {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY) //
    @JoinColumn(name = "client_id", nullable = false)
    private Client client;


    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "preventista_id", nullable = false)
    private User preventista;

    @NotNull
    @OneToMany(mappedBy = "sale", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private List<SaleProduct> saleProducts;

    @NotNull
    private Double total;
}