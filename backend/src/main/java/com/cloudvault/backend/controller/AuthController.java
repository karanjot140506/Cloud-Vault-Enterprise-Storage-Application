package com.cloudvault.backend.controller;

import com.cloudvault.backend.dto.request.LoginRequest;
import com.cloudvault.backend.dto.request.RefreshTokenRequest;
import com.cloudvault.backend.dto.request.RegisterRequest;
import com.cloudvault.backend.dto.response.ApiResponse;
import com.cloudvault.backend.dto.response.AuthResponse;
import com.cloudvault.backend.service.AuthService;
import com.cloudvault.backend.util.SecurityUtil;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@Tag(name = "Auth", description = "Authentication endpoints")
public class AuthController {

    private final AuthService authService;
    private final SecurityUtil securityUtil;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(
            @Valid @RequestBody RegisterRequest request) {

        AuthResponse response = authService.register(request);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("User registered successfully", response));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(
            @Valid @RequestBody LoginRequest request) {

        AuthResponse response = authService.login(request);

        return ResponseEntity.ok(
                ApiResponse.success("Login successful", response)
        );
    }

    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<AuthResponse>> refreshToken(
            @Valid @RequestBody RefreshTokenRequest request) {

        AuthResponse response =
                authService.refreshAccessToken(request.getRefreshToken());

        return ResponseEntity.ok(
                ApiResponse.success("Token refreshed successfully", response)
        );
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Object>> logout() {

        String currentUserEmail = securityUtil.getCurrentUserEmail();
        authService.logout(currentUserEmail);

        return ResponseEntity.ok(
                ApiResponse.success("Logged out successfully", null)
        );
    }
}