package com.example.women.health.model;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
public class Post {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long authorId;
    private String authorName;
    private String title;
    private String image;

    @Column(columnDefinition = "TEXT")
    private String body;

    private Long createdAt;

    @ElementCollection
    private List<Long> likes = new ArrayList<>();

    @ElementCollection
    private List<Long> favs = new ArrayList<>();

    // 🚀 No longer storing comments as text directly
    @Transient
    private List<Comment> comments;

    // Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getAuthorId() { return authorId; }
    public void setAuthorId(Long authorId) { this.authorId = authorId; }

    public String getAuthorName() { return authorName; }
    public void setAuthorName(String authorName) { this.authorName = authorName; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getBody() { return body; }
    public void setBody(String body) { this.body = body; }

    public Long getCreatedAt() { return createdAt; }
    public void setCreatedAt(Long createdAt) { this.createdAt = createdAt; }

    public List<Long> getLikes() { return likes; }
    public void setLikes(List<Long> likes) { this.likes = likes; }

    public List<Long> getFavs() { return favs; }
    public void setFavs(List<Long> favs) { this.favs = favs; }

    public List<Comment> getComments() { return comments; }
    public void setComments(List<Comment> comments) { this.comments = comments; }

    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }

}
