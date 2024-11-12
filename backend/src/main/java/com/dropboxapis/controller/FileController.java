package com.dropboxapis.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import com.dropboxapis.model.FileMetadata;
import com.dropboxapis.service.FileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.nio.file.Path;
import java.time.LocalDateTime;
import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/files")
public class FileController {

    @Autowired
    private FileService fileService;

    private final String UPLOAD_DIR = "/Users/hemantsingh/Desktop/test/";

    @PostMapping("/upload")
    public String uploadFile(@RequestParam("file") MultipartFile file) throws IOException {
        File directory = new File(UPLOAD_DIR);
        if (!directory.exists() && !directory.mkdirs()) {
            throw new IOException("Failed to create upload directory");
        }

        File dest = new File(UPLOAD_DIR + file.getOriginalFilename());
        file.transferTo(dest);

        FileMetadata metadata = new FileMetadata();
        metadata.setName(file.getOriginalFilename());
        metadata.setType(file.getContentType());
        metadata.setSize(file.getSize());
        metadata.setUploadTime(LocalDateTime.now());

        fileService.saveFileMetadata(metadata);
        return "File uploaded successfully!";
    }

    @GetMapping
    public List<FileMetadata> listFiles() {
        return fileService.getAllFiles();
    }

    @GetMapping("/download/{fileName}")
    public ResponseEntity<Resource> downloadFile(@PathVariable String fileName, @RequestParam(defaultValue = "attachment") String mode) throws IOException {
        File file = new File(UPLOAD_DIR + fileName);
        if (!file.exists()) {
            throw new FileNotFoundException("File not found: " + fileName);
        }

        Path path = file.toPath();
        Resource resource = new UrlResource(path.toUri());
        if (!resource.exists() || !resource.isReadable()) {
            throw new FileNotFoundException("File not found or unreadable: " + fileName);
        }

        String contentType = switch (fileName.substring(fileName.lastIndexOf('.') + 1).toLowerCase()) {
            case "txt" -> "text/plain";
            case "csv" -> "text/csv";
            case "json" -> "application/json";
            case "jpg", "jpeg" -> "image/jpeg";
            case "png" -> "image/png";
            default -> "application/octet-stream";
        };

        String disposition = mode.equalsIgnoreCase("inline") ? "inline" : "attachment";

        return ResponseEntity.ok()
            .contentType(MediaType.parseMediaType(contentType))
            .header(HttpHeaders.CONTENT_DISPOSITION, disposition + "; filename=\"" + file.getName() + "\"")
            .body(resource);
    }
}
