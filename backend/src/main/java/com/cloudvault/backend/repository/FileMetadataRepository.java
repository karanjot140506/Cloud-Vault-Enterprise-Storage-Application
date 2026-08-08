package com.cloudvault.backend.repository;

import com.cloudvault.backend.model.FileMetadata;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface FileMetadataRepository extends MongoRepository<FileMetadata, String> {

    List<FileMetadata> findByOwnerId(String ownerId);

    Optional<FileMetadata> findByIdAndOwnerId(String id, String ownerId);

    Page<FileMetadata> findByOwnerIdAndTrashedFalse(String ownerId, Pageable pageable);

    Page<FileMetadata> findByOwnerIdAndOriginalFileNameContainingIgnoreCaseAndTrashedFalse(
            String ownerId, String fileName, Pageable pageable);

    Page<FileMetadata> findByOwnerIdAndFolderIdAndTrashedFalse(String ownerId, String folderId, Pageable pageable);

    Page<FileMetadata> findByOwnerIdAndFolderIdIsNullAndTrashedFalse(String ownerId, Pageable pageable);

    List<FileMetadata> findByOwnerIdAndFolderId(String ownerId, String folderId);

    Page<FileMetadata> findByOwnerIdAndTrashedTrue(String ownerId, Pageable pageable);

    Optional<FileMetadata> findByIdAndOwnerIdAndTrashedTrue(String id, String ownerId);

    Optional<FileMetadata> findByIdAndOwnerIdAndTrashedFalse(String id, String ownerId);
}