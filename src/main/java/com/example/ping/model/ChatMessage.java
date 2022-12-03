package com.example.ping.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ChatMessage {
    @Id
    private String id;
    private String chatId;
    private String senderId;
    private String content;
    private Date timestamp;
    private MessageStatus status;
    private String recipientId;
    private String senderName;
    private String recipientName;
}