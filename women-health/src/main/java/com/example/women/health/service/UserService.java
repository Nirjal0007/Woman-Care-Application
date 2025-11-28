package com.example.women.health.service;

import com.example.women.health.model.User;
import com.example.women.health.repository.UserRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class UserService {
    private final UserRepository repo;

    public UserService(UserRepository repo) {
        this.repo = repo;
    }

    public List<User> getAll() {
        return repo.findAll();
    }

    public User add(User user) {
        return repo.save(user);  // works for insert & update
    }

    public User getByUsername(String username) {
        return repo.findByUsername(username);
    }

    public User getById(Long id) {
        return repo.findById(id).orElse(null);
    }
}
