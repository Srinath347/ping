package com.example.ping.model;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class VerifyUser {

    private String nonce;
    private String signature;
    private String firstName;
}
