package com.chatApp.repository;

import com.chatApp.model.ChatRoom;

import java.util.Optional;

public interface ChatRoomRepository {
//       extends MongoRepository<ChatRoom, String>

    Optional<ChatRoom> findBySenderIdAndRecipientId(String senderId, String recipientId);
}