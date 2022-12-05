package com.example.ping.controller;

import com.example.ping.exception.PingErrorResponse;
import com.example.ping.model.ChatMessage;
import com.example.ping.model.User;
import com.example.ping.model.User;
import com.example.ping.util.Client;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Controller
public class UserController {

    @GetMapping("/idle_users")
    public ResponseEntity<?> getAllIdleUsers() {
        return ResponseEntity
                .ok(Client.getAllIdleUsers());
    }

    @GetMapping("/user/{id}")
    public ResponseEntity<?> getUserById(@PathVariable int id) {
        return ResponseEntity
                .ok(Client.getUserById(id));
    }

    @GetMapping("/verify/{recipientId}")
    public ResponseEntity<?> verifyValidUser( @PathVariable int recipientId) {
        User user = Client.verifyValidUser(recipientId);

        if(user == null) {
            PingErrorResponse errorResponse = new PingErrorResponse();
            errorResponse.setMessage("User is not idle");
            return new ResponseEntity(errorResponse, HttpStatus.NOT_FOUND);
        }

        return ResponseEntity
                .ok(user);
    }

    @PutMapping("/status/{id}/{status}")
    public ResponseEntity<?> updateUserStatus( @PathVariable int id, @PathVariable String status) {
        User user = Client.updateUserStatus(id, status);

        if(user == null) {
            PingErrorResponse errorResponse = new PingErrorResponse();
            errorResponse.setMessage("User not found");
            return new ResponseEntity(errorResponse, HttpStatus.NOT_FOUND);
        }

        return ResponseEntity
                .ok(user);
    }

    @GetMapping("/user/username/{name}")
    public ResponseEntity<?> getUserByName(@PathVariable String name) {
        return ResponseEntity
                .ok(Client.getUserByName(name));
    }
}
