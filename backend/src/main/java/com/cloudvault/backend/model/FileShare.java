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
@Document(collection = "file_shares")
public class FileShare {

    @Id
    private String id;

    private String fileId;

    private String ownerId;

    private String sharedWithUserId;

    private String sharedWithEmail;

    private LocalDateTime sharedAt;
}