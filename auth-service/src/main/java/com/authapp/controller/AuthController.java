package com.authapp.controller;

import com.authapp.util.AuthUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.server.ResponseStatusException;

@Controller
public class AuthController {

    @Autowired
    private AuthUtil authUtil;

    @CrossOrigin("http://localhost:3000")
    @GetMapping("/auth/{username}")
    public ResponseEntity<?> authorizeUser(@PathVariable String username) throws Exception {
        try {
            return ResponseEntity.ok(authUtil.userSignIn(username));
        } catch (Exception exception) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED, "Unauthorized user");
        }
    }
}