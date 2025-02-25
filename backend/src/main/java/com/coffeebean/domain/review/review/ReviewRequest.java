package com.coffeebean.domain.review.review;

import jakarta.annotation.Nullable;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import org.hibernate.validator.constraints.URL;
import org.springframework.web.multipart.MultipartFile;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReviewRequest {

    @NotBlank(message = "리뷰 내용은 필수입니다.")
    private String content; // 리뷰 내용

    @Min(value = 1, message = "별점은 최소 1점이어야 합니다.")
    @Max(value = 5, message = "별점은 최대 5점이어야 합니다.")
    private int rating; // 별점

    @Nullable()
    private MultipartFile originalFileName;
}
