package com.chatApp.Backend.entities;

import com.chatApp.Backend.entities.type.AuthProviderType;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "users")
@CompoundIndex(name = "provider_unique", def = "{'providerId': 1, 'providerType': 1}", unique = true)
public class User implements UserDetails {
    @Id
    private String id;

    @Indexed(unique = true)
    private String email;

    private String name;
    private String profilePhoto;

    private String providerId;
    private AuthProviderType providerType;

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public String getPassword() {
        return null;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of();
    }
}
