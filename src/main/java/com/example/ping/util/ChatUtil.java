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

    public static String generateChatId(ChatMessage chatMessage) {
        // client1 -> client2. single chatId till session ends.
//        SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS");
//        Date now = new Date();
//        String chatId = formatter.format(now).replaceAll("-", "_")
//                .replaceAll(":", "_").replace(".", "_");
//        return chatId;
        // 1_2 and 2_1

        UUID.randomUUID().toString();
        return String.format("%s_%s", chatMessage.getSenderId(), chatMessage.getRecipientId());
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

    public static ChatMessage findChatById(String id) {
        for(Map.Entry<String, ChatMessage> entry: chatData.entrySet()) {
            if(entry.getKey() == id) {
                return entry.getValue();
            }
        }
        return new ChatMessage();
    }


}
