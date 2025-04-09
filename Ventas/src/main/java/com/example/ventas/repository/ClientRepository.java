package com.example.ventas.repository;

import com.example.ventas.model.Client;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface ClientRepository extends JpaRepository<Client, Long> {
    @Query("SELECT COUNT(c) FROM Client c")
    Long getTotalClients();

}
