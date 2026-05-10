package com.chatApp.Backend.services;

import com.chatApp.Backend.dto.LoginRequestDto;
import com.chatApp.Backend.dto.LoginResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {
    public LoginResponseDto login(LoginRequestDto loginRequestDto) {
        return null;
    }
}
