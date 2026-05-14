package com.chatApp.Backend.config;

import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.ClientHttpRequestFactory;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.security.oauth2.client.endpoint.OAuth2AccessTokenResponseClient;
import org.springframework.security.oauth2.client.endpoint.OAuth2AuthorizationCodeGrantRequest;
import org.springframework.security.oauth2.client.endpoint.RestClientAuthorizationCodeTokenResponseClient;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserService;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.core.endpoint.OAuth2AccessTokenResponse;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestTemplate;

import java.util.Collections;

@Configuration
public class AppConfig {

    @Bean
    public ClientHttpRequestFactory clientHttpRequestFactory() {
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(30000);
        factory.setReadTimeout(30000);
        return factory;
    }

    @Bean
    public RestClient.Builder oauth2RestClientBuilder(ClientHttpRequestFactory clientHttpRequestFactory) {
        return RestClient.builder().requestFactory(clientHttpRequestFactory);
    }

    /**
     * Wraps RestClientAuthorizationCodeTokenResponseClient with a null-safe decorator.
     * Fixes confirmed Spring Security 7.0.0-7.0.5 bug: additionalParameters is null,
     * causing NullPointerException in OidcAuthorizationCodeAuthenticationProvider line 149.
     */
    @Bean
    public OAuth2AccessTokenResponseClient<OAuth2AuthorizationCodeGrantRequest> tokenResponseClient(
            RestClient.Builder oauth2RestClientBuilder) {

        RestClientAuthorizationCodeTokenResponseClient delegate =
                new RestClientAuthorizationCodeTokenResponseClient();
        delegate.setRestClient(oauth2RestClientBuilder.build());

        return grantRequest -> {
            OAuth2AccessTokenResponse response = delegate.getTokenResponse(grantRequest);
            if (response == null) return null;

            if (response.getAdditionalParameters() == null) {
                response = OAuth2AccessTokenResponse
                        .withResponse(response)
                        .additionalParameters(Collections.emptyMap())
                        .build();
            }
            return response;
        };
    }

    @Bean
    public OidcUserService oidcUserService() {

        DefaultOAuth2UserService userService = new DefaultOAuth2UserService();

        RestTemplate restTemplate = new RestTemplate(clientHttpRequestFactory());

        restTemplate.setErrorHandler(new org.springframework.security.oauth2.client.http.OAuth2ErrorResponseErrorHandler());

        userService.setRestOperations(restTemplate);
        OidcUserService oidcUserService = new OidcUserService();
        oidcUserService.setOauth2UserService(userService);

        return oidcUserService;
    }

    @Bean
    public ModelMapper modelMapper() {
        return new ModelMapper();
    }
}