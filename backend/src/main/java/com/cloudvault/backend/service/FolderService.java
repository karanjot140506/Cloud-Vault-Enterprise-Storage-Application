package com.cloudvault.backend.service;

import com.cloudvault.backend.dto.request.CreateFolderRequest;
import com.cloudvault.backend.dto.response.FolderResponse;
import com.cloudvault.backend.exception.ResourceNotFoundException;
import com.cloudvault.backend.model.Folder;
import com.cloudvault.backend.model.FileMetadata;
import com.cloudvault.backend.model.User;
import com.cloudvault.backend.repository.FileMetadataRepository;
import com.cloudvault.backend.repository.FolderRepository;
import com.cloudvault.backend.repository.UserRepository;
import com.cloudvault.backend.util.SecurityUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FolderService {

    private final FolderRepository folderRepository;
    private final UserRepository userRepository;
    private final SecurityUtil securityUtil;
    private final FileMetadataRepository fileMetadataRepository;

    public FolderResponse createFolder(CreateFolderRequest request) {
        User owner = getCurrentUser();

        if (request.getParentFolderId() != null) {
            folderRepository.findByIdAndOwnerId(request.getParentFolderId(), owner.getId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Parent folder not found: " + request.getParentFolderId()));
        }

        Folder folder = Folder.builder()
                .name(request.getName())
                .ownerId(owner.getId())
                .parentFolderId(request.getParentFolderId())
                .createdAt(LocalDateTime.now())
                .build();

        Folder saved = folderRepository.save(folder);
        return mapToResponse(saved);
    }

    public List<FolderResponse> getFolders(String parentFolderId) {
        User owner = getCurrentUser();

        return folderRepository.findByOwnerIdAndParentFolderId(owner.getId(), parentFolderId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public FolderResponse renameFolder(String folderId, String newName) {
        User owner = getCurrentUser();

        Folder folder = folderRepository.findByIdAndOwnerId(folderId, owner.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Folder not found: " + folderId));

        folder.setName(newName);
        Folder saved = folderRepository.save(folder);
        return mapToResponse(saved);
    }

    public void deleteFolder(String folderId) {
        User owner = getCurrentUser();

        Folder folder = folderRepository.findByIdAndOwnerId(folderId, owner.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Folder not found: " + folderId));

        boolean hasSubFolders = !folderRepository
                .findByOwnerIdAndParentFolderId(owner.getId(), folderId).isEmpty();

        if (hasSubFolders) {
            throw new IllegalStateException(
                    "Cannot delete folder that contains sub-folders. Delete sub-folders first.");
        }

        List<FileMetadata> filesInFolder = fileMetadataRepository
                .findByOwnerIdAndFolderId(owner.getId(), folderId);

        filesInFolder.forEach(file -> {
            file.setFolderId(null);
            fileMetadataRepository.save(file);
        });

        folderRepository.delete(folder);
    }

    private User getCurrentUser() {
        String currentUserEmail = securityUtil.getCurrentUserEmail();
        return userRepository.findByEmail(currentUserEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + currentUserEmail));
    }

    private FolderResponse mapToResponse(Folder folder) {
        return FolderResponse.builder()
                .id(folder.getId())
                .name(folder.getName())
                .parentFolderId(folder.getParentFolderId())
                .createdAt(folder.getCreatedAt())
                .build();
    }
}