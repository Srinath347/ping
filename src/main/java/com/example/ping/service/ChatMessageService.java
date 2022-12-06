package com.example.ping.service;

import com.example.ping.model.ChatMessage;
import com.example.ping.util.ChatUtil;
import org.springframework.stereotype.Service;

@Service
public class ChatMessageService {

    public String getSessionId(ChatMessage chatMessage) {
        String key = getChatKey(chatMessage);
        return ChatUtil.getSessionId(key, chatMessage);
    }

    private String getChatKey(ChatMessage chatMessage) {
        int maxId = Math.max(Integer.parseInt(chatMessage.getSenderId()), Integer.parseInt(chatMessage.getRecipientId()));
        int minId = Math.max(Integer.parseInt(chatMessage.getSenderId()), Integer.parseInt(chatMessage.getRecipientId()));
        return String.format("%s$$%s", minId, maxId);
    }
}