package com.chatApp.repository;

import com.chatApp.model.ChatMessage;
import com.chatApp.model.MessageStatus;
import java.util.List;

public interface ChatMessageRepository {
//        extends MongoRepository<ChatMessage, String>

    long countBySenderIdAndRecipientIdAndStatus(
            String senderId, String recipientId, MessageStatus status);

    List<ChatMessage> findByChatId(String chatId);
}