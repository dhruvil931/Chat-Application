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

    public Room createRoom(Room room) {

        if(repository.findByRoomId(room.getRoomId()) != null) {
            throw new RuntimeException("Room already exists");
        }

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

        // Pagination
        List<Message> messages = room.getMessages();

        int start = Math.max(0, messages.size() - (page+1) * size);
        int end = Math.min(messages.size(), start + size);

        List<Message> paginatedMessages = messages.subList(start, end);

        return paginatedMessages;
    }
}
