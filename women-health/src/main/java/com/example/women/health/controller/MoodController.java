package com.example.women.health.controller;

import com.example.women.health.model.Mood;
import com.example.women.health.service.MoodService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/moods")
@CrossOrigin(origins = "http://localhost:3000")
public class MoodController {

    private final MoodService service;

    public MoodController(MoodService service) {
        this.service = service;
    }

    @GetMapping
    public List<Mood> getAll() {
        return service.getAll();
    }

    @PostMapping
    public Mood add(@RequestBody Mood mood) {
        return service.add(mood);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
