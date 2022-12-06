package com.example.ping.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ChatMessage {

    private String chatId;
    private String senderId;
    private String content;
    private Date timestamp;
    private String recipientId;
    private String senderName;
    private String recipientName;
    private String hash;
}