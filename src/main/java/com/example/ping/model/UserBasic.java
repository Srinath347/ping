package com.example.ping.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserBasic {
    private int id;
    private String firstName;
    private String lastName;
    private boolean isIdle;
}
