package com.example.ventas.controller;

import com.example.ventas.model.User;
import com.example.ventas.security.JwtUtil;
import com.example.ventas.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {
    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;


    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestParam String username, @RequestParam String password) {
        Optional<User> user = userService.getUserByUsername(username);

        if (user.isPresent() && passwordEncoder.matches(password, user.get().getPassword())) {
            String role = user.get().getRole().name();
            String token = jwtUtil.generateToken(username, role);

            // Crear un objeto de respuesta con el token y los atributos necesarios del usuario
            Map<String, Object> response = new HashMap<>();
            response.put("token", token);

            Map<String, Object> userData = new HashMap<>();
            userData.put("id", user.get().getId());
            userData.put("username", user.get().getUsername());
            userData.put("role", user.get().getRole().name());
            response.put("user", userData);

            return ResponseEntity.ok(response);
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Credenciales incorrectas");
    }
}
