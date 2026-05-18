package com.chatApp.Backend.services;

import com.chatApp.Backend.dto.LoginResponseDto;
import com.chatApp.Backend.entities.type.AuthProviderType;
import com.chatApp.Backend.entities.User;
import com.chatApp.Backend.repositories.UserRepository;
import com.chatApp.Backend.security.AuthUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final AuthUtil authUtil;

    @Transactional
    public ResponseEntity<LoginResponseDto> handleOAuth2LoginRequest(OAuth2User oAuth2User, String registrationId) {
        AuthProviderType providerType = authUtil.getProviderTypeFromRegistrationId(registrationId);
        String providerId = authUtil.determineProviderIdFromOAuth2User(oAuth2User, registrationId);

        // Debug log of attributes to help diagnose missing info from provider
        // (use your logger or add @Slf4j to this class)
        // log.debug("OAuth2 attributes for {}: {}", registrationId, oAuth2User.getAttributes());

        String email = oAuth2User.getAttribute("email");
        String name = authUtil.determineNameFromOAuth2User(oAuth2User, registrationId);
        String profilePhoto = authUtil.determineProfilePhotoFromOAuth2User(oAuth2User, registrationId);

        // If email missing: for Google we require it; for Facebook attempt a fallback
        if (email == null || email.isBlank()) {
            if (providerType == AuthProviderType.FACEBOOK) {
                // Log warning and create a fallback non-verified email so user can still sign up
                // Consider asking user to provide a real email later in your UI
                // Fallback uses providerId to guarantee uniqueness
                email = providerId + "@facebook.local";
                // Optionally log: log.warn("Facebook did not provide email for providerId {}, using fallback {}", providerId, email);
            } else {
                throw new IllegalStateException("Email not provided by OAuth2 provider: " + registrationId);
            }
        }

        User user = userRepository.findFirstByProviderIdAndProviderType(providerId, providerType).orElse(null);

        if (user == null && email != null) {
            user = userRepository.findFirstByEmail(email).orElse(null);
            if (user != null && user.getProviderType() != providerType) {
                throw new BadCredentialsException("This email is already registered with provider " + user.getProviderType());
            }
        }

        if (user == null) {
            // First-time signup
            user = User.builder()
                    .email(email)
                    .name(name)
                    .profilePhoto(profilePhoto)
                    .providerId(providerId)
                    .providerType(providerType)
                    .build();
        } else {
            // Existing user — sync latest profile info
            user.setName(name);
            user.setProfilePhoto(profilePhoto);
            if (email != null) user.setEmail(email);
        }

        userRepository.save(user);

        String token = jwtService.generateToken(user.getId(), user.getEmail());
        return ResponseEntity.ok(new LoginResponseDto(token));
    }
}
