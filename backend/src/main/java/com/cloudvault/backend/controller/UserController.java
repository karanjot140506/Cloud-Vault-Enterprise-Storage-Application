package com.cloudvault.backend.controller;

import com.cloudvault.backend.dto.request.UpdateProfileRequest;
import com.cloudvault.backend.dto.response.ApiResponse;
import com.cloudvault.backend.dto.response.StorageUsageResponse;
import com.cloudvault.backend.dto.response.UserProfileResponse;
import com.cloudvault.backend.service.FileService;
import com.cloudvault.backend.service.UserService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
@Tag(name = "Users", description = "User profile and storage endpoints")
public class UserController {

    private final UserService userService;
    private final FileService fileService;

    @GetMapping("/me")
    public ApiResponse<UserProfileResponse> getMyProfile() {
        return ApiResponse.success("Profile fetched successfully", userService.getCurrentUserProfile());
    }

    @PutMapping("/me")
    public ApiResponse<UserProfileResponse> updateMyProfile(@Valid @RequestBody UpdateProfileRequest request) {
        return ApiResponse.success("Profile updated successfully", userService.updateProfile(request));
    }

    @GetMapping("/me/storage")
    public ApiResponse<StorageUsageResponse> getMyStorageUsage() {
        return ApiResponse.success("Storage usage fetched successfully", fileService.getStorageUsage());
    }
}