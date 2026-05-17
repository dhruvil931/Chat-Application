package com.chatApp.Backend.config;

public class AppConstants {
    public static final String FRONTEND_BASED_URL =
            System.getenv("FRONTEND_URL") != null
                    ? System.getenv("FRONTEND_URL")
                    : "https://chat-application-bay-mu.vercel.app";
}
