package com.example.women.health.model;

import jakarta.persistence.*;

@Entity
public class Mood {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;

    private String moodType; // e.g. happy, sad, stressed
    private String note;
    private Long timestamp; // store as epoch millis
    private Integer score;  // 1-5

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getMoodType() { return moodType; }
    public void setMoodType(String moodType) { this.moodType = moodType; }

    public String getNote() { return note; }
    public void setNote(String note) { this.note = note; }

    public Long getTimestamp() { return timestamp; }
    public void setTimestamp(Long timestamp) { this.timestamp = timestamp; }

    public Integer getScore() { return score; }
    public void setScore(Integer score) { this.score = score; }
}
