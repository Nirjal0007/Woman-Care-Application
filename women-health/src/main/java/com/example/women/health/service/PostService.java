package com.example.women.health.service;

import com.example.women.health.model.Post;
import com.example.women.health.repository.PostRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PostService {

    private final PostRepository repo;

    public PostService(PostRepository repo) {
        this.repo = repo;
    }

    public List<Post> getAll() {
        return repo.findAll();
    }

    public Post add(Post post) {
        return repo.save(post);
    }

    public Post getById(Long id) {
        return repo.findById(id).orElse(null);
    }

    public void delete(Long id) {
        if (!repo.existsById(id)) {
            throw new RuntimeException("Post not found with id " + id);
        }
        repo.deleteById(id);
    }

    public boolean existsById(Long id) {
        return repo.existsById(id);
    }
}
