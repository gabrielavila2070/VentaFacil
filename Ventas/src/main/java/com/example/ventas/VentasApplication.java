package com.example.ventas;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = "com.example.ventas")
public class VentasApplication {

    public static void main(String[] args) {
        SpringApplication.run(VentasApplication.class, args);
    }
}
