package com.cloudvault.backend.service;

import com.cloudvault.backend.dto.request.LoginRequest;
import com.cloudvault.backend.dto.request.RegisterRequest;
import com.cloudvault.backend.dto.response.AuthResponse;
import com.cloudvault.backend.enums.Role;
import com.cloudvault.backend.exception.DuplicateResourceException;
import com.cloudvault.backend.exception.ResourceNotFoundException;
import com.cloudvault.backend.model.RefreshToken;
import com.cloudvault.backend.model.User;
import com.cloudvault.backend.repository.UserRepository;
import com.cloudvault.backend.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final RefreshTokenService refreshTokenService;

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException(
                    "Email is already registered: " + request.getEmail());
        }

        User user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.USER)
                .enabled(true)
                .build();

        User savedUser = userRepository.save(user);

        String token = jwtUtil.generateToken(savedUser.getEmail());
        RefreshToken refreshToken =
                refreshTokenService.createRefreshToken(savedUser.getId());

        return AuthResponse.builder()
                .id(savedUser.getId())
                .fullName(savedUser.getFullName())
                .email(savedUser.getEmail())
                .role(savedUser.getRole())
                .token(token)
                .refreshToken(refreshToken.getToken())
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword()
                    )
            );
        } catch (Exception ex) {
            throw new BadCredentialsException("Invalid email or password");
        }

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "User not found with email: " + request.getEmail()));

        String token = jwtUtil.generateToken(user.getEmail());
        RefreshToken refreshToken =
                refreshTokenService.createRefreshToken(user.getId());

        return AuthResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .role(user.getRole())
                .token(token)
                .refreshToken(refreshToken.getToken())
                .build();
    }

    public AuthResponse refreshAccessToken(String requestRefreshToken) {
        RefreshToken refreshToken =
                refreshTokenService.verifyAndGet(requestRefreshToken);

        User user = userRepository.findById(refreshToken.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        String newAccessToken = jwtUtil.generateToken(user.getEmail());

        return AuthResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .role(user.getRole())
                .token(newAccessToken)
                .refreshToken(refreshToken.getToken())
                .build();
    }

    public void logout(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found: " + email));

        refreshTokenService.deleteByUserId(user.getId());
    }
}