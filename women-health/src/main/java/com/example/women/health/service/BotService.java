package com.example.women.health.service;

import org.springframework.stereotype.Service;

@Service
public class BotService {

    public String getReply(String text) {
        String t = text.toLowerCase();

        if (t.contains("hi") || t.contains("hello") || t.contains("hey") || t.contains("hola"))
            return "Hello! 💜 How can I support you today?";

        if (t.contains("how are you"))
            return "I'm doing great and ready to help! How are you feeling today? 😊";

        if (t.contains("who are you"))
            return "I'm your personal wellness assistant 🤖💜";

        if (t.contains("help"))
            return "You can ask me about periods, mood, sleep, or diet 💜";

        if (t.contains("period") || t.contains("cycle"))
            return "Tip: Log your period dates. A typical cycle is 26–32 days.";

        if (t.contains("mood") || t.contains("stress") || t.contains("anx"))
            return "Try a calming breathing exercise: inhale 4s, hold 4s, exhale 6s 😊";

        if (t.contains("doctor"))
            return "Before visiting, list your top concerns + medications.";

        if (t.contains("diet") || t.contains("food"))
            return "Try balanced meals with protein, veggies and water 💧";

        if (t.contains("sleep"))
            return "Try consistent bedtimes + reduce screen time before sleeping.";

        if (t.contains("cramp") || t.contains("pain"))
            return "Warm compress + hydration helps with cramps 💜";

        if (t.contains("normal"))
            return "Bodies vary a LOT — track symptoms and ask a doctor if unsure.";

        if (t.contains("sad") || t.contains("down") || t.contains("upset") || t.contains("cry"))
            return "I'm really sorry you're feeling this way 💜. You deserve compassion and rest. Try deep breathing, soft music, or journaling. You're not alone.";

        if (t.contains("exercise") || t.contains("workout") || t.contains("fitness") || t.contains("yoga") || t.contains("walk"))
            return "Regular exercise is great for mood and health 💪. Try 30 mins of walking, yoga, or light workouts daily!";

        if (t.contains("routine") || t.contains("habit") || t.contains("schedule") || t.contains("daily"))
            return "A healthy routine helps balance mind & body. Consistent sleep, meals, exercise, and self-care make a big difference! 🌸";

        return "I'm here to help with cycle, mood, sleep, diet & self-care 💜";
    }
}
