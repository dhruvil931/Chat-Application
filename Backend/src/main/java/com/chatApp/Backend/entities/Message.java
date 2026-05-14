package com.chatApp.Backend.entities;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Message {
    private String id = UUID.randomUUID().toString();

    private String sender;
    private String content;
    private LocalDateTime time;

    public Message(String sender, String content) {
        this.sender = sender;
        this.content = content;
        this.time = LocalDateTime.now();
    }
}
