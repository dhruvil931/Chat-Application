package com.chatApp.Backend.dto;

public record UserProfileDto(
        String id,
        String name,
        String email,
        String profilePhoto
) {}