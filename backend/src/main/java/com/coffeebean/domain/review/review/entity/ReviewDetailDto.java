package com.coffeebean.domain.review.review.entity;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
// 리뷰 내역 간단 조회 DTO
public class ReviewDetailDto {

    private Long reviewId;
    private String content;
    private int rating;
    private LocalDateTime createDate;
    private String imageUrl;

    public ReviewDetailDto(Review review) {
        this.reviewId = review.getId();
        this.content = review.getContent();
        this.rating = review.getRating();
        this.createDate = review.getCreateDate();
    }
}
