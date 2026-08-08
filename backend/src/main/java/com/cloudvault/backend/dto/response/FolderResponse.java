package com.cloudvault.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FolderResponse {

    private String id;
    private String name;
    private String parentFolderId;
    private LocalDateTime createdAt;


}