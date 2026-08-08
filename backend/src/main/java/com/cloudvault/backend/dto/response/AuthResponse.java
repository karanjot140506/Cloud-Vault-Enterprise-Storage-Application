package com.cloudvault.backend.dto.response;

import com.cloudvault.backend.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {

    private String id;
    private String fullName;
    private String email;
    private Role role;
    private String token;
    private String refreshToken;
}