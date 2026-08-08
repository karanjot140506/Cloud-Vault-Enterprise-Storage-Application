package com.cloudvault.backend.controller;

import com.cloudvault.backend.dto.response.ApiResponse;
import com.cloudvault.backend.dto.response.FileResponse;
import com.cloudvault.backend.model.FileMetadata;
import com.cloudvault.backend.service.FileService;
import com.cloudvault.backend.service.FileShareService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.cloudvault.backend.dto.request.ShareFileRequest;
import com.cloudvault.backend.dto.response.FileShareResponse;
import com.cloudvault.backend.dto.response.SharedFileResponse;
import jakarta.validation.Valid;
import com.cloudvault.backend.dto.response.PagedResponse;

import java.util.List;

@RestController
@RequestMapping("/api/v1/files")
@RequiredArgsConstructor
@Tag(name = "Files", description = "File upload and management endpoints")
public class FileController {

    private final FileService fileService;
    private final FileShareService fileShareService;

    @PostMapping(value = "/upload", consumes = "multipart/form-data")
    public ResponseEntity<ApiResponse<FileResponse>> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam(required = false) String folderId) {
        FileResponse response = fileService.uploadFile(file, folderId);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("File uploaded successfully", response));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<PagedResponse<FileResponse>>> getMyFiles(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String folderId) {
        PagedResponse<FileResponse> files = fileService.getMyFiles(page, size, search, folderId);
        return ResponseEntity.ok(ApiResponse.success("Files fetched successfully", files));
    }

    @GetMapping("/trash")
    public ResponseEntity<ApiResponse<PagedResponse<FileResponse>>> getTrashedFiles(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        PagedResponse<FileResponse> files = fileService.getTrashedFiles(page, size);
        return ResponseEntity.ok(ApiResponse.success("Trashed files fetched successfully", files));
    }

    @GetMapping("/{id}/download")
    public ResponseEntity<Resource> downloadFile(@PathVariable String id) {
        FileMetadata metadata = fileService.getFileForDownload(id);
        Resource resource = fileService.loadFileAsResource(metadata);

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(
                        metadata.getContentType() != null ? metadata.getContentType() : "application/octet-stream"))
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" + metadata.getOriginalFileName() + "\"")
                .body(resource);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> deleteFile(@PathVariable String id) {
        fileService.deleteFile(id);
        return ResponseEntity.ok(ApiResponse.success("File moved to trash", null));
    }

    @PostMapping("/{id}/restore")
    public ResponseEntity<ApiResponse<Object>> restoreFile(@PathVariable String id) {
        fileService.restoreFile(id);
        return ResponseEntity.ok(ApiResponse.success("File restored successfully", null));
    }

    @DeleteMapping("/{id}/permanent")
    public ResponseEntity<ApiResponse<Object>> permanentlyDeleteFile(@PathVariable String id) {
        fileService.permanentlyDeleteFile(id);
        return ResponseEntity.ok(ApiResponse.success("File permanently deleted", null));
    }

    @PostMapping("/{id}/share")
    public ResponseEntity<ApiResponse<Object>> shareFile(@PathVariable String id,
                                                         @Valid @RequestBody ShareFileRequest request) {
        fileShareService.shareFile(id, request);
        return ResponseEntity.ok(ApiResponse.success("File shared successfully", null));
    }

    @GetMapping("/shared-with-me")
    public ResponseEntity<ApiResponse<List<SharedFileResponse>>> getSharedWithMe() {
        List<SharedFileResponse> files = fileShareService.getFilesSharedWithMe();
        return ResponseEntity.ok(ApiResponse.success("Shared files fetched successfully", files));
    }

    @GetMapping("/{id}/shares")
    public ResponseEntity<ApiResponse<List<FileShareResponse>>> getFileShares(@PathVariable String id) {
        List<FileShareResponse> shares = fileShareService.getSharesForFile(id);
        return ResponseEntity.ok(ApiResponse.success("Shares fetched successfully", shares));
    }

    @DeleteMapping("/{id}/share/{email}")
    public ResponseEntity<ApiResponse<Object>> unshareFile(@PathVariable String id,
                                                           @PathVariable String email) {
        fileShareService.unshareFile(id, email);
        return ResponseEntity.ok(ApiResponse.success("File access revoked successfully", null));
    }

    @DeleteMapping("/{id}/shares/{shareId}")
    public ResponseEntity<ApiResponse<Object>> revokeShare(@PathVariable String id,
                                                            @PathVariable String shareId) {
        fileShareService.revokeShareById(id, shareId);
        return ResponseEntity.ok(ApiResponse.success("File access revoked successfully", null));
    }
}