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
public class SharedFileResponse {

    private String fileId;
    private String originalFileName;
    private String contentType;
    private long size;
    private String sharedByEmail;
    private LocalDateTime sharedAt;
}