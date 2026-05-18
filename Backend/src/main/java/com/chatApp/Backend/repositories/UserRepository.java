package com.chatApp.Backend.repositories;

import com.chatApp.Backend.entities.type.AuthProviderType;
import com.chatApp.Backend.entities.User;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByEmail(String email);
    Optional<User> findFirstByProviderIdAndProviderType(String providerId, AuthProviderType providerType);
}
