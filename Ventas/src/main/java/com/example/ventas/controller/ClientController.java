package com.example.ventas.controller;

import com.example.ventas.model.Client;
import com.example.ventas.service.ClientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/clients")
@CrossOrigin(origins = "http://localhost:5173")
public class ClientController {
    @Autowired
    private ClientService clientService;

    @GetMapping
    public List<Client> getAllClient() {
        return clientService.getAllClients();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Client> getClientById(@PathVariable Long id) {
        Optional<Client> client = clientService.getClientById(id);
        return client.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public Client createClient(@RequestBody Client client) {
        return clientService.saveClient(client);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Client> editClient(@PathVariable Long id, @RequestBody Client clientDetails) {
        Optional<Client> existingClientOptional = clientService.getClientById(id);

        if (existingClientOptional.isPresent()) {

            Client existingClient = existingClientOptional.get();
            existingClient.setFirstName(clientDetails.getFirstName());
            existingClient.setLastName(clientDetails.getLastName());
            existingClient.setEmail(clientDetails.getEmail());

            Client updatedClient = clientService.saveClient(existingClient);
            return ResponseEntity.ok(updatedClient);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteClient(@PathVariable Long id) {
        clientService.deleteClient(id);
        return ResponseEntity.noContent().build();
    }
}
