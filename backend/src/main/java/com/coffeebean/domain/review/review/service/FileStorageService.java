package com.coffeebean.domain.review.review.service;

import com.coffeebean.global.exception.FileNotFoundException;
import com.coffeebean.global.exception.FileStorageException;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class FileStorageService {

    @Value("${file.upload-dir}")  // yml에서 주입
    private String uploadDir;

    @PostConstruct
    public void init() {
        try {
            Files.createDirectories(Paths.get(uploadDir));
            log.info("파일 디렉토리 생성: {}", Paths.get(uploadDir));
        } catch (IOException e) {
            throw new RuntimeException("파일 저장 디렉토리 생성 실패");
        }
    }

    // 서버에 사진 파일 저장
    public String storeFile(MultipartFile file) {
        String fileName = String.format("%s.%s",
                UUID.randomUUID(),
                getFileExtension(file.getOriginalFilename())
        );
        log.info("변경된 file name = {}", fileName);

        Path targetLocation = Paths.get(uploadDir).resolve(fileName);
        try {
            Files.copy(file.getInputStream(), targetLocation,
                    StandardCopyOption.REPLACE_EXISTING);
            log.info("저장된 파일 경로 = {}", targetLocation);
            return fileName;
        } catch (IOException e) {
            throw new FileStorageException("파일 저장 실패: " + fileName);
        }
    }

    // 파일 확장자 추출해서 뒤에 붙이기 (확장자명만 봐도 어떤 건지 알 수 있게끔)
    private String getFileExtension(String fileName) {
        return StringUtils.getFilenameExtension(fileName);
    }

    // 사진 파일 조회
    public Resource loadFile(String fileName) {
        try {
            Path filePath = Paths.get(uploadDir).resolve(fileName).normalize();
            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists()) {
                return resource;
            } else {
                throw new FileNotFoundException("파일을 찾을 수 없습니다. : " + fileName);
            }
        } catch (MalformedURLException e) {
            throw new FileStorageException("잘못된 파일 경로입니다: " + fileName);
        }
    }
}
