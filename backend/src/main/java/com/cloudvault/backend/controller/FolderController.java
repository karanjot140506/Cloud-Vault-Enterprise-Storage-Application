package com.cloudvault.backend.controller;

import com.cloudvault.backend.dto.request.CreateFolderRequest;
import com.cloudvault.backend.dto.request.RenameFolderRequest;
import com.cloudvault.backend.dto.response.ApiResponse;
import com.cloudvault.backend.dto.response.FolderResponse;
import com.cloudvault.backend.service.FolderService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/folders")
@RequiredArgsConstructor
@Tag(name = "Folders", description = "Folder organization endpoints")
public class FolderController {

    private final FolderService folderService;

    @PostMapping
    public ResponseEntity<ApiResponse<FolderResponse>> createFolder(@Valid @RequestBody CreateFolderRequest request) {
        FolderResponse response = folderService.createFolder(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Folder created successfully", response));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<FolderResponse>>> getFolders(
            @RequestParam(required = false) String parentFolderId) {
        List<FolderResponse> folders = folderService.getFolders(parentFolderId);
        return ResponseEntity.ok(ApiResponse.success("Folders fetched successfully", folders));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<FolderResponse>> renameFolder(@PathVariable String id,
                                                                     @Valid @RequestBody RenameFolderRequest request) {
        FolderResponse response = folderService.renameFolder(id, request.getName());
        return ResponseEntity.ok(ApiResponse.success("Folder renamed successfully", response));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> deleteFolder(@PathVariable String id) {
        folderService.deleteFolder(id);
        return ResponseEntity.ok(ApiResponse.success("Folder deleted successfully", null));
    }
}