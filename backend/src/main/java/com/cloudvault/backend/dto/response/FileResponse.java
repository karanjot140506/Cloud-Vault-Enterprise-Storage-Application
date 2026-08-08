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
public class FileResponse {

    private String id;
    private String originalFileName;
    private String contentType;
    private long size;
    private LocalDateTime uploadedAt;
}