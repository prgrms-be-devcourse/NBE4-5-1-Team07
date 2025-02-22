package com.coffeebean.domain.review.review;

import com.coffeebean.domain.review.review.entity.ReviewDetailDto;
import com.coffeebean.domain.review.review.service.ReviewService;
import com.coffeebean.domain.user.user.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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
    @GetMapping("/pending/{email}")
    public ResponseEntity<List<ReviewableOrderItemDto>> getPendingReviews(@PathVariable("email") String email) {
        List<ReviewableOrderItemDto> reviewableOrderItems = reviewService.getReviewableOrderItems(email);
        return ResponseEntity.ok(reviewableOrderItems);
    }

    // 전체 리뷰 조회
    @GetMapping("/{email}")
    public ResponseEntity<List<ReviewDetailDto>> getAllReviews(@PathVariable("email") String email,
                                                               @RequestParam(value = "page", defaultValue = "0") int page,
                                                               @RequestParam(value = "size", defaultValue = "10") int size) {
        Long userId = userService.getUserIdFromEmail(email);
        List<ReviewDetailDto> reviews = reviewService.getReviewsByUser(userId, page, size);

        if (reviews.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok(reviews);
    }

    // 리뷰 작성
    @PostMapping("/{orderId}")
    public ResponseEntity<String> writeReview(@PathVariable("orderId") Long orderId,
                                              @Validated @RequestBody ReviewRequest reviewRequest) {

        reviewService.writeReivew(orderId, reviewRequest.getContent(), reviewRequest.getRating());
        return ResponseEntity.ok("리뷰가 성공적으로 작성되었습니다!");
    }

    // 리뷰 수정
    @PutMapping("/{reviewId}")
    public ResponseEntity<String> modifyReview(@PathVariable("reviewId") Long reviewId,
                                               @Validated @RequestBody ReviewRequest reviewRequest) {
        reviewService.modifyReview(reviewId, reviewRequest.getContent(), reviewRequest.getRating());
        return ResponseEntity.ok("리뷰가 수정되었습니다.");
    }

    // 리뷰 삭제
    @DeleteMapping("/{reviewId}")
    public ResponseEntity<String> deleteReview(@PathVariable("reviewId") Long reviewId) {
        reviewService.deleteReview(reviewId);
        return ResponseEntity.ok("리뷰가 삭제되었습니다.");
    }
}
