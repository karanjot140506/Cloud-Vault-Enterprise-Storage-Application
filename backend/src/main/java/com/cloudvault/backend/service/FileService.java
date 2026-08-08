package com.cloudvault.backend.service;

import com.cloudvault.backend.dto.response.FileResponse;
import com.cloudvault.backend.dto.response.PagedResponse;
import com.cloudvault.backend.dto.response.StorageUsageResponse;
import com.cloudvault.backend.exception.ResourceNotFoundException;
import com.cloudvault.backend.model.FileMetadata;
import com.cloudvault.backend.model.User;
import com.cloudvault.backend.repository.FileMetadataRepository;
import com.cloudvault.backend.repository.FileShareRepository;
import com.cloudvault.backend.repository.UserRepository;
import com.cloudvault.backend.util.SecurityUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class FileService {

    private final FileStorageService fileStorageService;
    private final FileMetadataRepository fileMetadataRepository;
    private final UserRepository userRepository;
    private final SecurityUtil securityUtil;
    private final FileShareRepository fileShareRepository;

    // =========================
    // Upload File
    // =========================
    public FileResponse uploadFile(MultipartFile file, String folderId) {

        User owner = getCurrentUser();

        String objectKey = fileStorageService.storeFile(file);

        FileMetadata metadata = FileMetadata.builder()
                .originalFileName(file.getOriginalFilename())
                .objectKey(objectKey)
                .bucketName(fileStorageService.getBucketName())
                .contentType(file.getContentType())
                .size(file.getSize())
                .ownerId(owner.getId())
                .ownerEmail(owner.getEmail())
                .folderId(folderId)
                .uploadedAt(LocalDateTime.now())
                .build();

        FileMetadata savedMetadata = fileMetadataRepository.save(metadata);

        return mapToResponse(savedMetadata);
    }

    // =========================
    // Get User Files
    // =========================
    public PagedResponse<FileResponse> getMyFiles(int page, int size, String search, String folderId) {

        User owner = getCurrentUser();

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "uploadedAt"));

        Page<FileMetadata> filePage;

        if (search != null && !search.isBlank()) {

            filePage = fileMetadataRepository
                    .findByOwnerIdAndOriginalFileNameContainingIgnoreCaseAndTrashedFalse(
                            owner.getId(), search, pageable
                    );

        } else if ("root".equalsIgnoreCase(folderId)) {

            filePage = fileMetadataRepository
                    .findByOwnerIdAndFolderIdIsNullAndTrashedFalse(owner.getId(), pageable);

        } else if (folderId != null && !folderId.isBlank()) {

            filePage = fileMetadataRepository
                    .findByOwnerIdAndFolderIdAndTrashedFalse(owner.getId(), folderId, pageable);

        } else {

            filePage = fileMetadataRepository
                    .findByOwnerIdAndTrashedFalse(owner.getId(), pageable);
        }

        List<FileResponse> content = filePage.getContent()
                .stream()
                .map(this::mapToResponse)
                .toList();

        return PagedResponse.<FileResponse>builder()
                .content(content)
                .pageNumber(filePage.getNumber())
                .pageSize(filePage.getSize())
                .totalElements(filePage.getTotalElements())
                .totalPages(filePage.getTotalPages())
                .last(filePage.isLast())
                .build();
    }

    // =========================
    // Download Permission Check
    // =========================
    public FileMetadata getFileForDownload(String fileId) {

        User currentUser = getCurrentUser();

        FileMetadata metadata = fileMetadataRepository.findById(fileId)
                .orElseThrow(() -> new ResourceNotFoundException("File not found: " + fileId));

        if (metadata.isTrashed()) {
            throw new ResourceNotFoundException("File is in trash");
        }

        boolean owner = metadata.getOwnerId().equals(currentUser.getId());

        boolean shared = fileShareRepository
                .existsByFileIdAndSharedWithUserId(fileId, currentUser.getId());

        if (!owner && !shared) {
            throw new ResourceNotFoundException("You don't have access to this file");
        }

        return metadata;
    }

    // =========================
    // Load File From MinIO
    // =========================
    public Resource loadFileAsResource(FileMetadata metadata) {
        return new InputStreamResource(
                fileStorageService.loadFileAsStream(metadata.getObjectKey())
        );
    }

    // =========================
    // Soft Delete
    // =========================
    public void deleteFile(String fileId) {

        User owner = getCurrentUser();

        FileMetadata metadata = fileMetadataRepository
                .findByIdAndOwnerIdAndTrashedFalse(fileId, owner.getId())
                .orElseThrow(() -> new ResourceNotFoundException("File not found"));

        metadata.setTrashed(true);
        metadata.setTrashedAt(LocalDateTime.now());

        fileMetadataRepository.save(metadata);
    }

    // =========================
    // Trash Files
    // =========================
    public PagedResponse<FileResponse> getTrashedFiles(int page, int size) {

        User owner = getCurrentUser();

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "trashedAt"));

        Page<FileMetadata> filePage = fileMetadataRepository
                .findByOwnerIdAndTrashedTrue(owner.getId(), pageable);

        List<FileResponse> content = filePage.getContent()
                .stream()
                .map(this::mapToResponse)
                .toList();

        return PagedResponse.<FileResponse>builder()
                .content(content)
                .pageNumber(filePage.getNumber())
                .pageSize(filePage.getSize())
                .totalElements(filePage.getTotalElements())
                .totalPages(filePage.getTotalPages())
                .last(filePage.isLast())
                .build();
    }

    // =========================
    // Restore File
    // =========================
    public void restoreFile(String fileId) {

        User owner = getCurrentUser();

        FileMetadata metadata = fileMetadataRepository
                .findByIdAndOwnerIdAndTrashedTrue(fileId, owner.getId())
                .orElseThrow(() -> new ResourceNotFoundException("File not found in trash"));

        metadata.setTrashed(false);
        metadata.setTrashedAt(null);

        fileMetadataRepository.save(metadata);
    }

    // =========================
    // Permanent Delete  (FIXED)
    // =========================
    @Transactional
    public void permanentlyDeleteFile(String fileId) {

        User owner = getCurrentUser();

        FileMetadata metadata = fileMetadataRepository
                .findByIdAndOwnerIdAndTrashedTrue(fileId, owner.getId())
                .orElseThrow(() -> new ResourceNotFoundException("File not found in trash"));

        // 1. Remove all share references for this file first.
        fileShareRepository.deleteByFileId(metadata.getId());

        // 2. Remove the metadata record — this is the source of truth for the UI.
        fileMetadataRepository.delete(metadata);

        // 3. Best-effort cleanup in MinIO. A failure here (object already gone,
        //    stale key, transient MinIO issue) must NOT block removing the file
        //    from the user's trash — the DB is already consistent at this point.
        try {
            fileStorageService.deleteFile(metadata.getObjectKey());
        } catch (Exception e) {
            log.warn("Could not delete MinIO object '{}' for file {}: {}",
                    metadata.getObjectKey(), metadata.getId(), e.getMessage());
        }
    }

    // =========================
    // Storage Usage
    // =========================
    public StorageUsageResponse getStorageUsage() {

        User owner = getCurrentUser();

        List<FileMetadata> files = fileMetadataRepository.findByOwnerId(owner.getId());

        long totalFiles = files.size();

        long totalBytes = files.stream()
                .mapToLong(FileMetadata::getSize)
                .sum();

        return StorageUsageResponse.builder()
                .totalFiles(totalFiles)
                .totalSizeBytes(totalBytes)
                .totalSizeReadable(formatSize(totalBytes))
                .build();
    }

    private String formatSize(long bytes) {

        if (bytes < 1024) {
            return bytes + " B";
        }

        int exp = (int) (Math.log(bytes) / Math.log(1024));
        String unit = "KMGTPE".charAt(exp - 1) + "B";

        return String.format("%.2f %s", bytes / Math.pow(1024, exp), unit);
    }

    private User getCurrentUser() {

        String email = securityUtil.getCurrentUserEmail();

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private FileResponse mapToResponse(FileMetadata metadata) {

        return FileResponse.builder()
                .id(metadata.getId())
                .originalFileName(metadata.getOriginalFileName())
                .contentType(metadata.getContentType())
                .size(metadata.getSize())
                .uploadedAt(metadata.getUploadedAt())
                .build();
    }
}