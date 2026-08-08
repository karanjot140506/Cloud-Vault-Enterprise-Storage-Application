package com.cloudvault.backend.repository;

import com.cloudvault.backend.model.Folder;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface FolderRepository extends MongoRepository<Folder, String> {

    List<Folder> findByOwnerIdAndParentFolderId(String ownerId, String parentFolderId);

    Optional<Folder> findByIdAndOwnerId(String id, String ownerId);

    List<Folder> findByOwnerId(String ownerId);
}