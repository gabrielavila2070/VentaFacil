package com.example.ventas.service;

import com.example.ventas.model.Client;
import com.example.ventas.repository.ClientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ClientService {
    @Autowired
    private ClientRepository clientRepository;

    public List<Client> getAllClients() {
        return clientRepository.findAll();
    }

    public Optional<Client> getClientById(Long id) {
        return clientRepository.findById(id);
    }

    public Client saveClient(Client client) {
        return clientRepository.save(client);
    }
    public Long getTotalClients() {
        return clientRepository.getTotalClients();
    }

    public void deleteClient(Long id) {
        clientRepository.deleteById(id);
    }
}
