package com.example.women.health.controller;

import com.example.women.health.model.Cycle;
import com.example.women.health.service.CycleService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/cycles")
@CrossOrigin(origins = "http://localhost:3000")
public class CycleController {

    private final CycleService service;

    public CycleController(CycleService service) {
        this.service = service;
    }

    // GET /api/cycles
    @GetMapping
    public List<Cycle> getAll() {
        return service.getAll();
    }

    // POST /api/cycles
    @PostMapping
    public Cycle add(@RequestBody Cycle cycle) {
        if (cycle.getCreatedAt() == null) {
            cycle.setCreatedAt(System.currentTimeMillis());
        }
        return service.add(cycle);
    }

    // DELETE /api/cycles/{id}
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }

}
