package com.chatApp.Backend.controllers;

import com.chatApp.Backend.dto.MessageRequestDto;
import com.chatApp.Backend.entities.Message;
import com.chatApp.Backend.services.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestBody;

@Controller
@RequiredArgsConstructor
@CrossOrigin("http://localhost:5173")
public class ChatController {
    private final ChatService chatService;

    // For sending and receiving message
    @MessageMapping("/sendMessage/{roomId}") // Coming msg - /app/sendMessage/roomId
    @SendTo("/topic/room/{roomId}") // Client Subscribe
    public Message sendMessage(@DestinationVariable String roomId, @RequestBody MessageRequestDto request) {
        return chatService.sendMessage(roomId, request);
    }
}
