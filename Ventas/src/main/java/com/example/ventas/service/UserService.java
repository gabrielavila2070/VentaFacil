package com.example.ventas.service;

import com.example.ventas.model.User;
import com.example.ventas.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
    public Optional<User> getUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }
    public void updatePasswordForExistingUsers() {
        List<User> users = userRepository.findAll();

        for (User user : users) {
            if (!user.getPassword().startsWith("$2a$")) {  // Verifica si la contraseña ya está codificada con BCrypt
                String encodedPassword = passwordEncoder.encode(user.getPassword());  // Codifica la contraseña
                user.setPassword(encodedPassword);
                userRepository.save(user);  // Guarda el usuario actualizado
            }
        }
    }


    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    public User saveUser(User user) {
        String rawPassword = user.getPassword();
        String encodedPassword = passwordEncoder.encode(rawPassword);
        user.setPassword(encodedPassword);
        return userRepository.save(user);
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
}
