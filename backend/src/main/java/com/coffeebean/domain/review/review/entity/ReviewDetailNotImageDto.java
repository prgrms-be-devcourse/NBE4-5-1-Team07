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
// 리뷰 내역 간단 조회 imageUrl 없는 DTO
public class ReviewDetailNotImageDto {

    private Long reviewId;
    private String content;
    private int rating;
    private LocalDateTime createDate;

    public ReviewDetailNotImageDto(Review review) {
        this.reviewId = review.getId();
        this.content = review.getContent();
        this.rating = review.getRating();
        this.createDate = review.getCreateDate();
    }
}
