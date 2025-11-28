package com.example.women.health.service;

import com.example.women.health.model.Chat;
import com.example.women.health.repository.ChatRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ChatService {

    private final ChatRepository repo;

    public ChatService(ChatRepository repo) {
        this.repo = repo;
    }

    public List<Chat> getByUserId(Long userId) {
        return repo.findByUserIdOrderByTimestampAsc(userId);
    }

    public Chat save(Chat chat) {
        return repo.save(chat);
    }
}
