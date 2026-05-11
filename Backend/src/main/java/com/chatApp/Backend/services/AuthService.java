package com.chatApp.Backend.services;

import com.chatApp.Backend.dto.LoginRequestDto;
import com.chatApp.Backend.dto.LoginResponseDto;
import com.chatApp.Backend.entities.type.AuthProviderType;
import com.chatApp.Backend.entity.User;
import com.chatApp.Backend.repositories.UserRepository;
import com.chatApp.Backend.security.AuthUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;
    private final AuthUtil authUtil;

    public LoginResponseDto login(LoginRequestDto loginRequestDto) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequestDto.getUsername(), loginRequestDto.getPassword())
        );

        User user = (User) authentication.getPrincipal();

        String token = jwtService.generateToken(user.getId(), user.getUsername());

        return new LoginResponseDto(token);
    }
    public User signupInternal(LoginRequestDto loginRequestDto, AuthProviderType providerType, String providerId) {
        User existingUser = userRepository.findByUsername(loginRequestDto.getUsername()).orElse(null);

        if(existingUser != null) {
            throw new RuntimeException("Username already exists");
        }

        User user = User.builder()
                .username(loginRequestDto.getUsername())
                .providerId(providerId)
                .providerType(providerType)
                .build();

        if(providerType == null) {
            user.setPassword(passwordEncoder.encode(loginRequestDto.getPassword()));
        }

        return userRepository.save(user);
    }

    public void register(LoginRequestDto loginRequestDto) {
        signupInternal(loginRequestDto, null, null);
    }

    @Transactional
    public ResponseEntity<LoginResponseDto> handleOAuth2LoginRequest(OAuth2User oAuth2User, String registrationId) {
        // Fetch providerType and providerId
        AuthProviderType providerType = authUtil.getProviderTypeFromRegistrationId(registrationId);
        String providerId = authUtil.determineProviderIdFromOAuth2User(oAuth2User, registrationId);

        User user = userRepository.findByProviderIdAndProviderType(providerId, providerType).orElse(null);
        String email = oAuth2User.getAttribute("email");

        User emailUser = userRepository.findByUsername(email).orElse(null);

        if(user == null && emailUser == null) {
            // Signup flow
            String username = authUtil.determineUsernameFromOAuth2User(oAuth2User, registrationId, providerId);
            user = signupInternal(new LoginRequestDto(username, null), providerType, providerId);
        } else if (user != null) {
            if(email != null && !email.isBlank() && !email.equals(user.getUsername())) {
                user.setUsername(email);
                userRepository.save(user);
            }
        } else {
            throw new BadCredentialsException("This email is already registered with provider " + emailUser.getProviderType());
        }

        LoginResponseDto loginResponseDto = new LoginResponseDto(jwtService.generateToken(user.getId(), user.getUsername()));

        return ResponseEntity.ok(loginResponseDto);
    }
}
