package com.example.women.health.service;

import com.example.women.health.model.Mood;
import com.example.women.health.repository.MoodRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MoodService {

    private final MoodRepository repo;

    public MoodService(MoodRepository repo) {
        this.repo = repo;
    }

    public List<Mood> getAll() {
        return repo.findAll();
    }

    public Mood add(Mood mood) {
        return repo.save(mood);
    }

    public void delete(Long id) {
        if (!repo.existsById(id)) {
            throw new RuntimeException("Mood not found with id " + id);
        }
        repo.deleteById(id);
    }
}
