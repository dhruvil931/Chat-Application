package com.chatApp.Backend.security;

import com.chatApp.Backend.entities.type.AuthProviderType;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
@Slf4j
public class AuthUtil {
    public AuthProviderType getProviderTypeFromRegistrationId(String registrationId) {
        return switch (registrationId.toLowerCase()) {
            case "google"    -> AuthProviderType.GOOGLE;
            case "facebook"  -> AuthProviderType.FACEBOOK;
            default -> throw new IllegalArgumentException("Unsupported OAuth2 provider: " + registrationId);
        };
    }

    public String determineProviderIdFromOAuth2User(OAuth2User oAuth2User, String registrationId) {
        String providerId = switch (registrationId.toLowerCase()) {
            case "google" -> oAuth2User.getAttribute("sub");
            case "facebook"  -> oAuth2User.getAttribute("id");
            default -> throw new IllegalArgumentException("Unsupported OAuth2 provider: " + registrationId);
        };

        if (providerId == null || providerId.toString().isBlank()) {
            throw new IllegalArgumentException("Unable to determine providerId for OAuth2 login");
        }
        return providerId.toString();
    }

    public String determineNameFromOAuth2User(OAuth2User oAuth2User, String registrationId) {
        return switch (registrationId.toLowerCase()) {
            case "google", "facebook" -> oAuth2User.getAttribute("name");
            default -> "Unknown";
        };
    }

    public String determineProfilePhotoFromOAuth2User(OAuth2User oAuth2User, String registrationId) {
        if (registrationId == null) {
            return null;
        }

        return switch (registrationId.toLowerCase()) {
            case "google" -> oAuth2User.getAttribute("picture");
            case "facebook" -> {
                Object pictureObj = oAuth2User.getAttribute("picture");
                if (pictureObj instanceof Map<?, ?> pictureMap) {
                    Object dataObj = pictureMap.get("data");
                    if (dataObj instanceof Map<?, ?> dataMap) {
                        Object url = dataMap.get("url");
                        yield url != null ? url.toString() : null;
                    }
                }
                yield null;
            }
            default -> null;
        };
    }
}
