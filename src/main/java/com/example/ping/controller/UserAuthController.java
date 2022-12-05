package com.example.ping.controller;

import com.example.ping.model.User;
import com.example.ping.model.VerifyUser;
import com.example.ping.service.UserSignInService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;


@RestController
public class UserAuthController {

    @Autowired
    UserSignInService userSignInService;

    @GetMapping("/signin/{firstName}")
    @ResponseBody
    public ResponseEntity<String> userSignIn(@PathVariable String firstName) {
        System.out.println("User trying to login: "+firstName);
        String signInDetails = userSignInService.signIn(firstName);
        if (signInDetails == null || signInDetails.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED, "Unauthorized user");
        }
        return ResponseEntity.ok(signInDetails);
    }

    @GetMapping("/verify")
    @ResponseBody
    public ResponseEntity<List<User>> verifyUserSignature(@RequestBody VerifyUser verifyUser) {
        List<User> users = userSignInService.verify(verifyUser);
        if (users == null) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED, "Unauthorized user");
        }
        return ResponseEntity.ok(users);
    }
}
