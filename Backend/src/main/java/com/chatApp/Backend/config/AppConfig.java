package com.chatApp.Backend.config;

import jakarta.annotation.PostConstruct;
import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AppConfig {
    @PostConstruct
    public void checkMongoUri() {
        System.out.println("MONGO URI = " + System.getenv("MONGO_URI"));
    }

    @Bean
    public ModelMapper modelMapper() {
        return new ModelMapper();
    }
}