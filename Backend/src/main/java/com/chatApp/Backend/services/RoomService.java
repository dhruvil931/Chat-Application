package com.chatApp.Backend.services;

import com.chatApp.Backend.entities.Message;
import com.chatApp.Backend.entities.Room;
import com.chatApp.Backend.repositories.RoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RoomService {

    private final RoomRepository repository;

    public Room createRoom(String roomId) {
        if(repository.findByRoomId(roomId) != null) {
            throw new RuntimeException("Room already exists");
        }

        // Create new room
        Room room = new Room();
        room.setRoomId(roomId);

        return repository.save(room);
    }

    public Room joinRoom(String roomId) {
        Room room = repository.findByRoomId(roomId);

        if(room == null) {
            throw new RuntimeException("Room not found");
        }

        return room;
    }

    public List<Message> getMessages(String roomId, int page, int size) {
        Room room = repository.findByRoomId(roomId);

        if(room == null) {
            throw new RuntimeException("Room not found");
        }

        List<Message> messages = room.getMessages();


    }
}
