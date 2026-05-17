package com.chatApp.Backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class BackendApplication {

	public static void main(String[] args) {
		System.out.println(">>> MONGO_URI = " + System.getenv("MONGO_URI"));
		System.out.println(">>> PORT = " + System.getenv("PORT"));
		SpringApplication.run(BackendApplication.class, args);
	}

}
