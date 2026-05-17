package com.chatApp.Backend.config;

import jakarta.annotation.PostConstruct;
import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AppConfig {
    @PostConstruct
    public void testDeploy() {
        System.out.println("DEPLOY TEST 123456");
        System.exit(1);
    }

    @Bean
    public ModelMapper modelMapper() {
        return new ModelMapper();
    }
}