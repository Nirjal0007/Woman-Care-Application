package com.example.women.health.service;

import com.example.women.health.model.Cycle;
import com.example.women.health.repository.CycleRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class CycleService {
    private final CycleRepository repo;

    public CycleService(CycleRepository repo) {
        this.repo = repo;
    }

    public List<Cycle> getAll() {
        return repo.findAll();
    }

    public Cycle add(Cycle cycle) {
        return repo.save(cycle);
    }

    public void delete(Long id) {
        repo.deleteById(id);
    }

}
