package com.cloudvault.backend.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "folders")
public class Folder {

    @Id
    private String id;

    private String name;

    private String ownerId;

    private String parentFolderId; // null = root-level folder

    private LocalDateTime createdAt;
}