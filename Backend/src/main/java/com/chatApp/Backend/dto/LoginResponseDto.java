package com.chatApp.Backend.dto;

import lombok.Data;

@Data
public class LoginResponseDto {
    String jwt;
    String userId;
}
