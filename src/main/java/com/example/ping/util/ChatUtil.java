package com.example.ping.util;

import com.example.ping.model.ChatMessage;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

public class ChatUtil {

    static HashMap<String, String> sessionIdMap;

    public static String getSessionId(String key, ChatMessage chatMessage) {
        if (sessionIdMap == null || sessionIdMap.isEmpty()) {
            sessionIdMap = new HashMap<>();
        }
        String sessionId = sessionIdMap.getOrDefault(key, UUID.randomUUID().toString());
        sessionIdMap.put(key, sessionId);
        return sessionIdMap.get(key);
    }

}
