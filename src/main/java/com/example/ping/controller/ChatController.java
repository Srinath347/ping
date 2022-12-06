package com.example.ping.controller;

import com.example.ping.model.ChatMessage;
import com.example.ping.service.ChatMessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class ChatController {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;
    @Autowired
    private ChatMessageService chatMessageService;

    @MessageMapping("/chat")
    public void processMessage(@Payload ChatMessage chatMessage) {
        String sessionId = chatMessageService.getSessionId(chatMessage);
        chatMessage.setChatId(sessionId);
        messagingTemplate.convertAndSendToUser(
                chatMessage.getRecipientId(), "/queue/messages", chatMessage);
    }
}