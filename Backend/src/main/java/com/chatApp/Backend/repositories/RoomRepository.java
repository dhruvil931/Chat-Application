package com.chatApp.Backend.repositories;

import com.chatApp.Backend.entities.Room;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface RoomRepository extends MongoRepository<Room, String> {

    // Get Room using Room ID
    Room findByRoomId(String roomId);

}
