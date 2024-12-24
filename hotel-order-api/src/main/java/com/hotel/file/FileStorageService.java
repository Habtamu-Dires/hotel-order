package com.hotel.file;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.lang.NonNull;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import static java.io.File.separator;
import static java.lang.System.currentTimeMillis;

@Service
@Slf4j
public class FileStorageService {

    @Value("${application.file.upload.picture-output-path}")
    private String fileUploadPath;

    @Value("${application.server.url}")
    String serverUrl;

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public String saveFile(
            @NonNull MultipartFile sourceFile,
            @NonNull String id,
            @NonNull String type)
    {
        return uploadFile(sourceFile,type,id);
    }

    private String uploadFile(
            @NonNull  MultipartFile sourceFile,
            @NonNull  String type,
            @NonNull  String id)
    {
        String uploadDir = fileUploadPath +separator+ type;
        Path folderPath = Paths.get(uploadDir);
        System.out.println("folder path");
        try{
            if (!Files.isDirectory(folderPath)) {
                Files.createDirectories(folderPath);
            }
        } catch (IOException e){
            log.info("Failed to create directory: {}", e.getMessage());
            throw new RuntimeException(e.getMessage());
        }

        final String fileExtension = getFileExtension(sourceFile.getOriginalFilename());
        String targetFilePath = uploadDir + separator + id +"-"+ currentTimeMillis() +"." + fileExtension;

        Path filePath = Paths.get(targetFilePath);

        try {
            Files.write(filePath,sourceFile.getBytes());
        } catch (IOException e) {
            log.warn("File was not saved {}", e.getMessage());
            throw new RuntimeException(e.getMessage());
        }
        //construct and return url
        return constructUrl(targetFilePath);
    }

    private String constructUrl(String targetFilepath) {
        return serverUrl  + "/files/get-image?image-path="+targetFilepath;
    }

    private String getFileExtension(String fileName) {
        if(fileName == null){
            return  "";
        }
        int lastDotIndex = fileName.lastIndexOf(".");
        if(lastDotIndex == -1){
            return "";
        }
        return fileName.substring(lastDotIndex + 1).toUpperCase();
    }

    public void deleteImage(String imageUrl) {
        if(imageUrl == null || imageUrl.isBlank()){
            return;
        }
        String targetFilePath = getFilePath(imageUrl);
        Path filePath = Paths.get(targetFilePath);
        try {
            Files.delete(filePath);
        } catch (IOException e) {
            log.info("File to be deleted not found ");
        }
    }

    private String getFilePath(String imageUrl) {
       int indexOfEq = imageUrl.indexOf("=");
       if(indexOfEq == -1) return "";
       return imageUrl.substring(indexOfEq + 1) ;
    }
}