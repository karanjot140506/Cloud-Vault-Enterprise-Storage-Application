package com.cloudvault.backend.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "files")
public class FileMetadata {

    @Id
    private String id;

    // Original file name uploaded by user
    private String originalFileName;

    // Unique object key stored in MinIO
    private String objectKey;

    // MinIO bucket name
    private String bucketName;

    // File MIME type (pdf, image, video etc.)
    private String contentType;

    // File size in bytes
    private long size;

    // Owner details
    private String ownerId;

    private String ownerEmail;

    // Folder reference (null means root folder)
    private String folderId;

    // Trash management
    @Builder.Default
    private boolean trashed = false;

    private LocalDateTime trashedAt;

    // Upload timestamp
    @CreatedDate
    private LocalDateTime uploadedAt;
}