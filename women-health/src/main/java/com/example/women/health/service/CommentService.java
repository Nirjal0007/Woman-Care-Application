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

    // Get all comments for a post
    public List<Comment> getCommentsByPostId(Long postId) {
        return repo.findByPostId(postId);
    }

    // Get only replies to a parent comment
    public List<Comment> getReplies(Long parentId) {
        return repo.findByParentId(parentId);
    }

    // Add new comment or reply
    public Comment add(Comment comment) {
        return repo.save(comment);
    }

    // Delete comment (and optionally children)
    public void delete(Long id) {
        repo.deleteById(id);
    }
}
