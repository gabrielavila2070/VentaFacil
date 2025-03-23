package com.example.ventas.security;

import com.example.ventas.model.User;
import com.example.ventas.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class PasswordEncryptionRunner implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        List<User> users = userRepository.findAll();
        for (User user : users) {
            // Verificar si la contraseña no esta encriptada
            if (!user.getPassword().startsWith("$2a$")) {  // Comienza con el prefijo de un hash BCrypt
                String rawPassword = user.getPassword();  // Obtiene la contraseña en texto plano
                String encodedPassword = passwordEncoder.encode(rawPassword);  // Encripta la contraseña
                user.setPassword(encodedPassword);  // Actualiza la contraseña en el objeto
                userRepository.save(user);  // Guarda el usuario actualizado en la base de datos
                System.out.println("Contraseña de usuario " + user.getUsername() + " encriptada correctamente");
            }
        }
    }
}
