package com.example.ventas.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())  // Deshabilita protección CSRF
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                "/swagger-ui/**",
                                "/v3/api-docs/**",
                                "/swagger-ui.html"
                        ).permitAll()  // Permite acceso libre a Swagger
                        .anyRequest().permitAll() // Permitir TODO (por ahora)
                )
                .formLogin(login -> login.disable()) // Deshabilita formulario de login
                .httpBasic(basic -> basic.disable()); // Deshabilita autenticación básica

        return http.build();
    }
}

