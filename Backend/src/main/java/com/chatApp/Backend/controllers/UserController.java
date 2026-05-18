package com.chatApp.Backend.controllers;

import com.chatApp.Backend.dto.UserProfileDto;
import com.chatApp.Backend.entities.User;
import com.chatApp.Backend.repositories.UserRepository;
import com.chatApp.Backend.services.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {
    private final UserRepository userRepository;
    private final JwtService jwtService;

    /**
     * GET /api/v1/users/me
     * Returns the profile of the currently authenticated user.
     * The JWT filter already validates the token and the userId
     * is extracted from the token's subject claim.
     */
    @GetMapping("/me")
    public ResponseEntity<UserProfileDto> getCurrentUser(
            @RequestHeader("Authorization") String authHeader) {

        String token = authHeader.substring(7);
        String userId = jwtService.extractUserId(token);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return ResponseEntity.ok(toDto(user));
    }

    /**
     * GET /api/v1/users/by-email?email=xxx
     * Returns public profile info for any user by email.
     * Used by the chat frontend to show profile photos next to messages.
     */
    @GetMapping("/by-email")
    public ResponseEntity<UserProfileDto> getUserByEmail(@RequestParam String email) {
        User user = userRepository.findFirstByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(toDto(user));
    }

    private UserProfileDto toDto(User user) {
        return new UserProfileDto(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getProfilePhoto()
        );
    }
}
