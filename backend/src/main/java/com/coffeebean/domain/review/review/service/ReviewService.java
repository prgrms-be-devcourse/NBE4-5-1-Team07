package com.coffeebean.domain.review.review.service;

import com.coffeebean.domain.order.order.DeliveryStatus;
import com.coffeebean.domain.order.orderItem.entity.OrderItem;
import com.coffeebean.domain.order.orderItem.repository.OrderItemRepository;
import com.coffeebean.domain.review.review.ReviewableOrderItemDto;
import com.coffeebean.domain.review.review.entity.Review;
import com.coffeebean.domain.review.review.entity.ReviewDetailDto;
import com.coffeebean.domain.review.review.respository.ReviewRepository;
import com.coffeebean.domain.user.user.enitity.User;
import com.coffeebean.domain.user.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final OrderItemRepository orderItemRepository;
    private final UserRepository userRepository;

    /**
     * 리뷰 작성 기간 초과 시 작성 불가 (배송 완료 후 7일 이내)
     * 상품 주문을 기준으로 이틀 후면 무조건 도착한다고 가정
     * 상품 주문 날짜 + 9 일 -> 리뷰 작성 가능일
     */
    public void writeReivew(Long orderItemId, String content, int rating) {
        // 주문 아이템 조회
        OrderItem orderItem = orderItemRepository.findById(orderItemId)
                .orElseThrow(() -> new IllegalArgumentException("유효하지 않은 주문입니다."));

        // 검증 로직 호출
        if (isReviewable(orderItem)) {
            // 유저 정보 조회
            String email = orderItem.getOrder().getEmail();
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new IllegalArgumentException("유효하지 않은 사용자입니다."));

            // 리뷰 생성 및 저장
            Review review = Review.builder()
                    .user(user)
                    .orderItem(orderItem)
                    .content(content)
                    .rating(rating)
                    .build();

            reviewRepository.save(review);

            // 주문 아이템 상태 변경
            orderItem.markAsWritten();

            // 결제 금액의 10% 포인트 적립
            pointAdded(orderItem, user);
        }
    }

    private void pointAdded(OrderItem orderItem, User user) {
        int pointsToAdd = (int) (orderItem.getTotalPrice() * 0.1);
        String description = "리뷰 작성 포인트 적립 - 주문 상품 번호: " + orderItem.getId();
        user.addPoints(pointsToAdd, description);
    }

    // 리뷰 작성 검증 로직
    private boolean isReviewable(OrderItem orderItem) {
        // 배송 완료 여부 확인
        if (orderItem.getOrder().getDeliveryStatus() != DeliveryStatus.DONE) {
            throw new IllegalStateException("배송이 완료되지 않은 주문에 대해 리뷰를 작성할 수 없습니다.");
        }

        // 리뷰 작성 가능 기간 검증 (구매일 + 9일 이내)
        LocalDateTime orderDate = orderItem.getOrder().getOrderDate();
        if (orderDate.plusDays(9).isBefore(LocalDateTime.now())) {
            throw new IllegalStateException("리뷰 작성 가능 기간이 지났습니다.");
        }
        return true;
    }

    @Transactional(readOnly = true)
    // 작성한 리뷰 내역 전체 조회 (삭제된 리뷰 빼고)
    public List<ReviewDetailDto> getWrittenReviews(Long userId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createDate").descending());

        // 삭제되지 않은 리뷰 페이징 조회
        Page<Review> reviews = reviewRepository.findReviewsByUserId(userId, pageable);

        // Review 엔티티를 ReviewDetailDto로 변환
        return reviews.stream().map(review -> new ReviewDetailDto(
                review.getId(),
                review.getContent(),
                review.getRating(),
                review.getCreateDate()
        )).toList();
    }

    // 작성 가능한 리뷰만 보여 주는 용도
    @Transactional(readOnly = true)
    public List<ReviewableOrderItemDto> getPendingReviews(String email) {
        // 리뷰 작성 가능 기간
        LocalDateTime cutoffDate = LocalDateTime.now().minusDays(9);

        // 데이터베이스에서 필터링한 OrderItem 조회
        List<OrderItem> orderItems = orderItemRepository.findReviewableOrderItems(email, cutoffDate);

        // DTO 변환
        return orderItems.stream()
                .map(orderItem -> new ReviewableOrderItemDto(
                        orderItem.getId(),
                        orderItem.getItem().getName(),
                        orderItem.getOrder().getOrderDate(),
                        orderItem.isWritten()
                )).toList();
    }

    public void modifyReview(Long reviewId, String content, int rating) {

        Review review = reviewRepository.findById(reviewId).orElseThrow(() -> new IllegalArgumentException("해당 리뷰가 존재하지 않습니다."));

        Optional<User> _user = userRepository.findById(review.getUser().getId());
        if (_user.isPresent()) {
            User user = _user.get();

            if (!review.getUser().getId().equals(user.getId())) {
                throw new IllegalStateException("본인의 리뷰만 수정할 수 있습니다.");
            }
        }

        review.update(content, rating);
    }

    public void deleteReview(Long reviewId) {
        Review review = reviewRepository.findById(reviewId).orElseThrow(() -> new IllegalArgumentException("해당 리뷰가 존재하지 않습니다."));

        Optional<User> _user = userRepository.findById(review.getUser().getId());
        if (_user.isPresent()) {
            User user = _user.get();

            if (!review.getUser().getId().equals(user.getId())) {
                throw new IllegalStateException("본인의 리뷰만 삭제할 수 있습니다.");
            }
        }

        reviewRepository.delete(review);
    }
}
