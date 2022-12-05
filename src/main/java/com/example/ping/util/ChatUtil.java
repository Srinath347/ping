package com.example.ping.util;

import com.example.ping.model.ChatMessage;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

public class ChatUtil {

    static HashMap<String, ChatMessage> chatData;
    static HashMap<String, String> sessionIdMap;

    public static void initialize() {
        if (chatData == null || chatData.isEmpty()) {
            chatData = new HashMap<>();
        }
    }

    public static String getSessionId(String key, ChatMessage chatMessage) {
        if (sessionIdMap == null || sessionIdMap.isEmpty()) {
            sessionIdMap = new HashMap<>();
        }
        String sessionId = sessionIdMap.getOrDefault(key, UUID.randomUUID().toString());
        sessionIdMap.put(key, sessionId);
        return sessionIdMap.get(key);
    }

    public static void save(ChatMessage chatMessage) {
        initialize();
        chatData.put(chatMessage.getChatId(), chatMessage);
    }

    public static Optional<ChatMessage> getMessagesBySenderIdReceipientId(String senderId, String recipientId) {
        for(Map.Entry<String, ChatMessage> entry: chatData.entrySet()) {
            ChatMessage chatMessage = entry.getValue();
            if(chatMessage.getSenderId() == senderId && chatMessage.getRecipientId() == recipientId) {
                return Optional.of(chatMessage);
            }
        }
        return Optional.empty();
    }


}
