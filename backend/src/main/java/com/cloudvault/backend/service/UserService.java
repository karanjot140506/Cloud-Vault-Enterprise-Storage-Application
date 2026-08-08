package com.cloudvault.backend.service;

import com.cloudvault.backend.dto.request.UpdateProfileRequest;
import com.cloudvault.backend.dto.response.UserProfileResponse;
import com.cloudvault.backend.exception.ResourceNotFoundException;
import com.cloudvault.backend.model.User;
import com.cloudvault.backend.repository.UserRepository;
import com.cloudvault.backend.util.SecurityUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final SecurityUtil securityUtil;

    public UserProfileResponse getCurrentUserProfile() {
        User user = getCurrentUser();
        return mapToResponse(user);
    }

    public UserProfileResponse updateProfile(UpdateProfileRequest request) {
        User user = getCurrentUser();
        user.setFullName(request.getFullName());
        User updatedUser = userRepository.save(user);
        return mapToResponse(updatedUser);
    }

    private User getCurrentUser() {
        String currentUserEmail = securityUtil.getCurrentUserEmail();
        return userRepository.findByEmail(currentUserEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + currentUserEmail));
    }

    private UserProfileResponse mapToResponse(User user) {
        return UserProfileResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .role(user.getRole())
                .createdAt(user.getCreatedAt())
                .build();
    }
}