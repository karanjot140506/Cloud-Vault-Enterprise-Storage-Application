package com.cloudvault.backend.service;

import com.cloudvault.backend.dto.request.ShareFileRequest;
import com.cloudvault.backend.dto.response.FileShareResponse;
import com.cloudvault.backend.dto.response.SharedFileResponse;
import com.cloudvault.backend.exception.DuplicateResourceException;
import com.cloudvault.backend.exception.ResourceNotFoundException;
import com.cloudvault.backend.model.FileMetadata;
import com.cloudvault.backend.model.FileShare;
import com.cloudvault.backend.model.User;
import com.cloudvault.backend.repository.FileMetadataRepository;
import com.cloudvault.backend.repository.FileShareRepository;
import com.cloudvault.backend.repository.UserRepository;
import com.cloudvault.backend.util.SecurityUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FileShareService {

    private final FileMetadataRepository fileMetadataRepository;
    private final UserRepository userRepository;
    private final FileShareRepository fileShareRepository;
    private final SecurityUtil securityUtil;

    @Transactional
    public void shareFile(String fileId, ShareFileRequest request) {

        User owner = getCurrentUser();

        FileMetadata file = fileMetadataRepository.findByIdAndOwnerId(fileId, owner.getId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "File not found or you do not have access to it: " + fileId));

        if (request.getEmail().equalsIgnoreCase(owner.getEmail())) {
            throw new IllegalArgumentException("You cannot share a file with yourself");
        }

        User targetUser = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "No user found with email: " + request.getEmail()));

        if (fileShareRepository.existsByFileIdAndSharedWithUserId(fileId, targetUser.getId())) {
            throw new DuplicateResourceException(
                    "File is already shared with: " + request.getEmail());
        }

        FileShare share = FileShare.builder()
                .fileId(file.getId())
                .ownerId(owner.getId())
                .sharedWithUserId(targetUser.getId())
                .sharedWithEmail(targetUser.getEmail())
                .sharedAt(LocalDateTime.now())
                .build();

        fileShareRepository.save(share);
    }

    @Transactional
    public void unshareFile(String fileId, String targetEmail) {

        User owner = getCurrentUser();

        FileMetadata file = fileMetadataRepository.findByIdAndOwnerId(fileId, owner.getId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "File not found or you do not have access to it: " + fileId));

        User targetUser = userRepository.findByEmail(targetEmail)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "No user found with email: " + targetEmail));

        boolean shareExists = fileShareRepository
                .existsByFileIdAndSharedWithUserId(file.getId(), targetUser.getId());

        if (!shareExists) {
            throw new ResourceNotFoundException(
                    "File is not shared with: " + targetEmail);
        }

        fileShareRepository.deleteByFileIdAndSharedWithUserId(file.getId(), targetUser.getId());
    }

    public List<SharedFileResponse> getFilesSharedWithMe() {

        User currentUser = getCurrentUser();

        List<FileShare> shares = fileShareRepository.findBySharedWithUserId(currentUser.getId());

        Set<String> fileIds = shares.stream()
                .map(FileShare::getFileId)
                .collect(Collectors.toSet());

        Set<String> ownerIds = shares.stream()
                .map(FileShare::getOwnerId)
                .collect(Collectors.toSet());

        Map<String, FileMetadata> filesById = fileMetadataRepository.findAllById(fileIds).stream()
                .collect(Collectors.toMap(FileMetadata::getId, f -> f));

        Map<String, User> ownersById = userRepository.findAllById(ownerIds).stream()
                .collect(Collectors.toMap(User::getId, u -> u));

        return shares.stream()
                .map(share -> {
                    FileMetadata file = filesById.get(share.getFileId());
                    if (file == null) {
                        return null;
                    }
                    User owner = ownersById.get(share.getOwnerId());
                    return SharedFileResponse.builder()
                            .fileId(file.getId())
                            .originalFileName(file.getOriginalFileName())
                            .contentType(file.getContentType())
                            .size(file.getSize())
                            .sharedByEmail(owner != null ? owner.getEmail() : "unknown")
                            .sharedAt(share.getSharedAt())
                            .build();
                })
                .filter(Objects::nonNull)
                .toList();
    }

    public List<FileShareResponse> getSharesForFile(String fileId) {

        User owner = getCurrentUser();

        fileMetadataRepository.findByIdAndOwnerId(fileId, owner.getId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "File not found or you do not have access to it: " + fileId));

        return fileShareRepository.findByFileId(fileId).stream()
                .map(share -> FileShareResponse.builder()
                        .id(share.getId())
                        .email(share.getSharedWithEmail())
                        .sharedAt(share.getSharedAt())
                        .build())
                .toList();
    }

    @Transactional
    public void revokeShareById(String fileId, String shareId) {

        User owner = getCurrentUser();

        fileMetadataRepository.findByIdAndOwnerId(fileId, owner.getId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "File not found or you do not have access to it: " + fileId));

        FileShare share = fileShareRepository.findByIdAndFileId(shareId, fileId)
                .orElseThrow(() -> new ResourceNotFoundException("Share not found: " + shareId));

        fileShareRepository.delete(share);
    }

    private User getCurrentUser() {
        String currentUserEmail = securityUtil.getCurrentUserEmail();
        return userRepository.findByEmail(currentUserEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + currentUserEmail));
    }
}