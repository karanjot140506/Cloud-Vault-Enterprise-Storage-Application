package com.cloudvault.backend.repository;

import com.cloudvault.backend.model.FileShare;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface FileShareRepository extends MongoRepository<FileShare, String> {

    List<FileShare> findBySharedWithUserId(String sharedWithUserId);

    List<FileShare> findByFileId(String fileId);

    Optional<FileShare> findByIdAndFileId(String id, String fileId);

    Optional<FileShare> findByFileIdAndSharedWithUserId(String fileId, String sharedWithUserId);

    boolean existsByFileIdAndSharedWithUserId(String fileId, String sharedWithUserId);

    void deleteByFileIdAndSharedWithUserId(String fileId, String sharedWithUserId);

    // Removes ALL share records for a file (not scoped to one user).
    void deleteByFileId(String fileId);
}