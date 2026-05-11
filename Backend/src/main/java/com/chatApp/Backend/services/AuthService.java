package com.chatApp.Backend.services;

import com.chatApp.Backend.dto.LoginRequestDto;
import com.chatApp.Backend.dto.LoginResponseDto;
import com.chatApp.Backend.entity.User;
import com.chatApp.Backend.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;

    public LoginResponseDto login(LoginRequestDto loginRequestDto) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequestDto.getUsername(), loginRequestDto.getPassword())
        );

        String username = authentication.getName();

        User user = userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));

        String token = jwtService.generateToken(user.getUsername());

        return new LoginResponseDto(token, username);
    }

    public void register(LoginRequestDto loginRequestDto) {
        boolean exists = userRepository.findByUsername(loginRequestDto.getUsername()).isPresent();

        if(exists) {
            throw new RuntimeException("Username already exists");
        }

        User user = User.builder()
                .username(loginRequestDto.getUsername())
                .password(passwordEncoder.encode(loginRequestDto.getPassword()))
                .build();

        userRepository.save(user);
    }
}
