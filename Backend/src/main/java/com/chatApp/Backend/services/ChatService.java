package com.chatApp.Backend.services;

import com.chatApp.Backend.dto.MessageRequestDto;
import com.chatApp.Backend.entities.Message;
import com.chatApp.Backend.entities.Room;
import com.chatApp.Backend.repositories.RoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class ChatService {
    private final RoomRepository roomRepository;

    public Message sendMessage(String roomId, MessageRequestDto request) {
        Room room = roomRepository.findByRoomId(request.getRoomId());

        Message message = new Message();
        message.setContent(request.getContent());
        message.setSender(request.getSender());
        message.setTime(LocalDateTime.now());

        if(room != null) {
            room.getMessages().add(message);
            roomRepository.save(room);
        } else {
            throw new RuntimeException("Room not found");
        }

        return message;
    }
}
