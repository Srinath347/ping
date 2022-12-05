package com.example.ping.service;

import com.example.ping.model.ChatMessage;
import com.example.ping.model.MessageStatus;
import com.example.ping.util.ChatUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class ChatMessageService {

    @Autowired
    private ChatRoomService chatRoomService;


    public String getChatId(ChatMessage chatMessage) {
        return ChatUtil.generateChatId(chatMessage);
    }

    public ChatMessage save(ChatMessage chatMessage) {
        System.out.println("ChatId create: " + chatMessage.getChatId());
        chatMessage.setStatus(MessageStatus.RECEIVED);
        ChatUtil.save(chatMessage);
        return chatMessage;
    }

    public long countNewMessages(String senderId, String recipientId) {
//        return repository.countBySenderIdAndRecipientIdAndStatus(
//                senderId, recipientId, MessageStatus.RECEIVED);
        Long count = Long.valueOf(7);
        return count;
    }

//    public List<ChatMessage> findChatMessages(String senderId, String recipientId) {
//        var chatId = chatRoomService.getChatId(senderId, recipientId, false);
//        var messages =
//                chatId.map(cId -> repository.findByChatId(cId)).orElse(new ArrayList<>());
//
//        if(messages.size() > 0) {
//            updateStatuses(senderId, recipientId, MessageStatus.DELIVERED);
//        }
//
//        return messages;
//    }

    public Optional<ChatMessage> findChatMessages(String senderId, String recipientId) {

        var messages = ChatUtil.getMessagesBySenderIdReceipientId(senderId, recipientId);
        if(!messages.isEmpty()) {
            messages.get().setStatus(MessageStatus.DELIVERED);
        }

        return messages;
    }

//    public ChatMessage findById(String id) {
//        return repository
//                .findById(id)
//                .map(chatMessage -> {
//                    chatMessage.setStatus(MessageStatus.DELIVERED);
//                    return repository.save(chatMessage);
//                })
//                .orElseThrow(() ->
//                        new ResourceNotFoundException("can't find message (" + id + ")"));
//        return chatMessage;
//    }

    public ChatMessage findById(String id) {
        return ChatUtil.findChatById(id);
    }

    public void updateStatuses(String senderId, String recipientId, MessageStatus status) {
//        Query query = new Query(
//                Criteria
//                        .where("senderId").is(senderId)
//                        .and("recipientId").is(recipientId));
//        Update update = Update.update("status", status);
//        mongoOperations.updateMulti(query, update, ChatMessage.class);
    }
}