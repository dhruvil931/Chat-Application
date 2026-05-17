package com.chatApp.Backend.security;

import com.chatApp.Backend.config.AppConstants;
import com.chatApp.Backend.dto.LoginResponseDto;
import com.chatApp.Backend.services.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.IOException;

@Slf4j
@Component
@RequiredArgsConstructor
public class OAuth2SuccessHandler implements AuthenticationSuccessHandler {
    private final AuthService authService;
    private final ObjectMapper objectMapper;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException {
        OAuth2AuthenticationToken token = (OAuth2AuthenticationToken) authentication;
        OAuth2User oAuth2User = ((OAuth2AuthenticationToken) authentication).getPrincipal();
        String registrationId = token.getAuthorizedClientRegistrationId();

        try {
            ResponseEntity<LoginResponseDto> loginResponse = authService.handleOAuth2LoginRequest(oAuth2User, registrationId);

            String jwt = loginResponse.getBody().getJwt();
            String redirectUrl = AppConstants.FRONTEND_BASED_URL + "/oauth2/callback?token=" + jwt;
            response.sendRedirect(redirectUrl);
        } catch (Exception e) {
            log.error("OAuth2 login failed: {}", e.getMessage());
            response.sendRedirect(AppConstants.FRONTEND_BASED_URL + "/oauth2/callback?error=true");
        }
    }
}
