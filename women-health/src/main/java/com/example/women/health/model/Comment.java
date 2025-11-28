package com.example.women.health.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class Comment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long postId;

    private Long userId;

    private String authorName; // ✅ new field to store the commenter’s name

    @Column(columnDefinition = "TEXT")
    private String text;

    private Long parentId; // null = top-level comment

    private LocalDateTime createdAt = LocalDateTime.now();

    public Comment() {}

    public Comment(Long postId, Long userId, String authorName, String text, Long parentId) {
        this.postId = postId;
        this.userId = userId;
        this.authorName = authorName;
        this.text = text;
        this.parentId = parentId;
    }

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getPostId() { return postId; }
    public void setPostId(Long postId) { this.postId = postId; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getAuthorName() { return authorName; }
    public void setAuthorName(String authorName) { this.authorName = authorName; }

    public String getText() { return text; }
    public void setText(String text) { this.text = text; }

    public Long getParentId() { return parentId; }
    public void setParentId(Long parentId) { this.parentId = parentId; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
