package com.example.ping.service;

import com.example.ping.model.ChatMessage;
import com.example.ping.model.MessageStatus;
import com.example.ping.util.ChatUtil;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class ChatMessageService {

    public String getSessionId(ChatMessage chatMessage) {
        String key = getChatKey(chatMessage);
        return ChatUtil.getSessionId(key, chatMessage);
    }

//    public ChatMessage save(ChatMessage chatMessage) {
//        System.out.println("sessionId create: " + chatMessage.getChatId());
//        chatMessage.setStatus(MessageStatus.RECEIVED);
//        ChatUtil.save(chatMessage);
//        return chatMessage;
//    }
//
//
//    public Optional<ChatMessage> findChatMessages(String senderId, String recipientId) {
//
//        var messages = ChatUtil.getMessagesBySenderIdReceipientId(senderId, recipientId);
//        if(!messages.isEmpty()) {
//            messages.get().setStatus(MessageStatus.DELIVERED);
//        }
//
//        return messages;
//    }

    private String getChatKey(ChatMessage chatMessage) {
        int maxId = Math.max(Integer.parseInt(chatMessage.getSenderId()), Integer.parseInt(chatMessage.getRecipientId()));
        int minId = Math.max(Integer.parseInt(chatMessage.getSenderId()), Integer.parseInt(chatMessage.getRecipientId()));
        return String.format("%s$$%s", minId, maxId);
    }
}