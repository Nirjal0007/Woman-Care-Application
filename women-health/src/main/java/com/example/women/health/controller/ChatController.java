package com.example.women.health.controller;

import com.example.women.health.model.Chat;
import com.example.women.health.service.BotService;
import com.example.women.health.service.ChatService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chats")
@CrossOrigin(origins = "http://localhost:3000")
public class ChatController {

    private final ChatService chatService;
    private final BotService botService;

    public ChatController(ChatService chatService, BotService botService) {
        this.chatService = chatService;
        this.botService = botService;
    }

    @GetMapping("/user/{userId}")
    public List<Chat> getUserChats(@PathVariable Long userId) {
        return chatService.getByUserId(userId);
    }

    @PostMapping("/send")
    public List<Chat> sendMessage(@RequestBody Chat incoming) {

        // Save user message
        incoming.setFromUser(true);
        incoming.setTimestamp(System.currentTimeMillis());
        chatService.save(incoming);

        // Generate bot response

        Chat bot = new Chat();
        bot.setUserId(incoming.getUserId());
        bot.setFromUser(false);
        bot.setTimestamp(System.currentTimeMillis());
        bot.setMessage(botService.getReply(incoming.getMessage()));
        chatService.save(bot);

        return List.of(incoming, bot);
    }
}
