package com.coffeebean.domain.review.review.controller;

import com.coffeebean.domain.review.review.ReviewRequest;
import com.coffeebean.domain.review.review.ReviewableOrderItemDto;
import com.coffeebean.domain.review.review.entity.ReviewDetailDto;
import com.coffeebean.domain.review.review.service.ReviewService;
import com.coffeebean.domain.user.user.service.UserService;
import com.coffeebean.global.annotation.Login;
import com.coffeebean.global.util.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;
    private final UserService userService;

    /**
     * 작성 가능한 리뷰 조회 API
     *
     * @param email 사용자 PK (요청 파라미터)
     * @return 작성 가능한 리뷰 목록
     */
    @GetMapping("/pending")
    public ResponseEntity<List<ReviewableOrderItemDto>> getPendingReviews(@Login CustomUserDetails userDetails) {
        List<ReviewableOrderItemDto> reviewableOrderItems = reviewService.getPendingReviews(userDetails.getEmail());
        return ResponseEntity.ok(reviewableOrderItems);
    }

    // 전체 리뷰 조회 (이미지 url 포함)
    // {"reviewId":24,"content":"제품 품질이 좋습니다.","rating":5,"createDate":"2025-02-25T17:05:12.166747",
    // "imageUrl":"http://localhost:8080/files/2de0b2d0-575a-4282-be64-9ca581248d1e.jpeg"} < api 데이터 예시
    @GetMapping("/written")
    public ResponseEntity<List<ReviewDetailDto>> getAllReviews(@Login CustomUserDetails userDetails,
                                                               @RequestParam(value = "page", defaultValue = "0") int page,
                                                               @RequestParam(value = "size", defaultValue = "10") int size) {
        List<ReviewDetailDto> reviews = reviewService.getWrittenReviews(userDetails.getUserId(), page, size);

        if (reviews.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok().body(reviews);
    }

    /**
     * [요청 형식]
     * POST /api/reviews/123
     * Content-Type: multipart/form-data
     */
    // 리뷰 작성
    @PostMapping(value = "/{orderItemId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> writeReview(@PathVariable("orderItemId") Long orderItemId,
                                              @Login CustomUserDetails userDetails,
                                              @Validated @ModelAttribute ReviewRequest reviewRequest) {

        reviewService.writeReivew(orderItemId, reviewRequest);
        return ResponseEntity.ok("리뷰가 성공적으로 작성되었습니다!");
    }

    // 리뷰 수정
    @PutMapping(value = "/{reviewId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> modifyReview(@PathVariable("reviewId") Long reviewId,
                                               @Login CustomUserDetails userDetails,
                                               @Validated @ModelAttribute ReviewRequest reviewRequest) {
        Long userId = userDetails.getUserId();
        reviewService.modifyReview(userId, reviewId, reviewRequest);
        return ResponseEntity.ok("리뷰가 수정되었습니다.");
    }

    // 리뷰 삭제
    @DeleteMapping("/{reviewId}")
    public ResponseEntity<String> deleteReview(@Login CustomUserDetails userDetails,
                                               @PathVariable("reviewId") Long reviewId) {
        reviewService.deleteReview(reviewId, userDetails.getUserId());
        return ResponseEntity.ok("리뷰가 삭제되었습니다.");
    }
}
