package com.cloudvault.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StorageUsageResponse {

    private long totalFiles;
    private long totalSizeBytes;
    private String totalSizeReadable;
}