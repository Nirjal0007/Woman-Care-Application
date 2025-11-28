package com.example.women.health.service;

import com.example.women.health.model.Comment;
import com.example.women.health.repository.CommentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CommentService {
    private final CommentRepository repo;

    public CommentService(CommentRepository repo) {
        this.repo = repo;
    }

    public List<Comment> getByPostId(Long postId) {
        return repo.findByPostId(postId);
    }

    public List<Comment> getReplies(Long parentId) {
        return repo.findByParentId(parentId);
    }

    public Comment add(Comment comment) {
        return repo.save(comment);
    }

    public void delete(Long id) {
        repo.deleteById(id);
    }
}
