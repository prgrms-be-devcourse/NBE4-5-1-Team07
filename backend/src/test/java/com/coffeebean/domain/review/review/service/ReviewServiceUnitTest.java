package com.coffeebean.domain.review.review.service;

import com.coffeebean.domain.item.entity.Item;
import com.coffeebean.domain.order.order.DeliveryStatus;
import com.coffeebean.domain.order.order.entity.Order;
import com.coffeebean.domain.order.orderItem.entity.OrderItem;
import com.coffeebean.domain.order.orderItem.repository.OrderItemRepository;
import com.coffeebean.domain.review.review.ReviewableOrderItemDto;
import com.coffeebean.domain.review.review.entity.Review;
import com.coffeebean.domain.review.review.entity.ReviewDetailDto;
import com.coffeebean.domain.review.review.respository.ReviewRepository;
import com.coffeebean.domain.user.pointHitstory.entity.PointHistory;
import com.coffeebean.domain.user.user.repository.UserRepository;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import com.coffeebean.domain.user.user.enitity.User;
import org.springframework.data.domain.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;

@ExtendWith(MockitoExtension.class)
class ReviewServiceUnitTest {

    @InjectMocks
    private ReviewService reviewService;

    @Mock
    private OrderItemRepository orderItemRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private ReviewRepository reviewRepository;

    @Test
    void 작성가능리뷰확인() {
        // given
        String email = "test@example.com";
        LocalDateTime fixedCutoff = LocalDateTime.parse("2025-02-15T12:54:41.904135");

        Order mockOrder = Order.builder()
                .orderDate(fixedCutoff.plusDays(4)) // 기준 시간 +4일
                .deliveryStatus(DeliveryStatus.DONE)
                .email(email)
                .build();

        OrderItem mockOrderItem = OrderItem.builder()
                .id(1L)
                .isWritten(false)
                .order(mockOrder)
                .build();

        // 스텁 설정
        Mockito.doReturn(List.of(mockOrderItem))
                .when(orderItemRepository)
                .findReviewableOrderItems(eq(email), any(LocalDateTime.class));

        // when
        List<OrderItem> result = getPendingReviews(email);

        // then
        assertThat(result).hasSize(1);
    }

    // 서비스 코드 수정 (테스트용 시간 주입) <테스트용>
    public List<OrderItem> getPendingReviews(String email) {
        LocalDateTime cutoffDate = getCutoffDate(); // ← 시간 생성 메서드 분리
        return orderItemRepository.findReviewableOrderItems(email, cutoffDate);
    }

    // 테스트에서 주입 가능하도록 변경 <테스트용>
    protected LocalDateTime getCutoffDate() {
        return LocalDateTime.now().minusDays(9);
    }

    @Test
    void 리뷰작성_기간초과_작성불가() throws Exception {
        //given
        Long orderId = 1L;
        String content = "너무 좋네요!";
        int rating = 5;

        //when
        Item mockItem = Item.builder()
                .id(1L)
                .name("Test Item")
                .price(10000)
                .stockQuantity(50)
                .description("커피의 풍미가 어쩌고...")
                .build();

        Order mockOrder = Order.builder()
                .id(1L)
                .orderDate(LocalDateTime.now().minusDays(10)) // 주문 날짜 10일 전
                .deliveryStatus(DeliveryStatus.DONE)
                .email("test@example.com")
                .build();

        OrderItem mockOrderItem = OrderItem.builder()
                .id(1L)
                .order(mockOrder)
                .item(mockItem)
                .orderPrice(10000) // 주문 시점의 개별 상품 가격
                .count(2) // 주문 수량
                .build();

        User mockUser = User.builder()
                .email("test@example.com")
                .build();

        Mockito.when(orderItemRepository.findById(orderId)).thenReturn(Optional.of(mockOrderItem));

        //then
        IllegalStateException exception = assertThrows(IllegalStateException.class, () -> {
            reviewService.writeReivew(orderId, content, rating);
        });

        Assertions.assertEquals("리뷰 작성 가능 기간이 지났습니다.", exception.getMessage());
    }

    @Test
    void 리뷰작성_배송전_작성불가() throws Exception {
        //given
        Long orderId = 1L;
        String content = "너무 좋네요!";
        int rating = 5;

        //when
        Item mockItem = Item.builder()
                .id(1L)
                .name("Test Item")
                .price(10000)
                .stockQuantity(50)
                .description("커피의 풍미가 어쩌고...")
                .build();

        Order mockOrder = Order.builder()
                .id(1L)
                .orderDate(LocalDateTime.now().minusDays(1))
                .deliveryStatus(DeliveryStatus.START)
                .email("test@example.com")
                .build();

        OrderItem mockOrderItem = OrderItem.builder()
                .id(1L)
                .order(mockOrder)
                .item(mockItem)
                .orderPrice(10000) // 주문 시점의 개별 상품 가격
                .count(2) // 주문 수량
                .build();


        //then
        Mockito.when(orderItemRepository.findById(orderId)).thenReturn(Optional.of(mockOrderItem));

        // When & Then
        IllegalStateException exception = assertThrows(IllegalStateException.class, () -> {
            reviewService.writeReivew(orderId, content, rating);
        });

        Assertions.assertEquals("배송이 완료되지 않은 주문에 대해 리뷰를 작성할 수 없습니다.", exception.getMessage());
    }
    
    @Test
    void 리뷰작성_포인트적립_성공() throws Exception {
        //given
        Long orderId = 1L;
        String content = "너무 좋네요!";
        int rating = 5;

        Item mockItem = Item.builder()
                .id(1L)
                .name("커피 머신")
                .price(10000)
                .stockQuantity(50)
                .description("최고의 커피 머신")
                .build();

        Order mockOrder = Order.builder()
                .orderDate(LocalDateTime.now().minusDays(5)) // 주문 날짜 5일 전
                .deliveryStatus(DeliveryStatus.DONE) // 배송 완료 상태
                .email("test@example.com")
                .build();

        OrderItem mockOrderItem = OrderItem.builder()
                .id(orderId)
                .order(mockOrder)
                .item(mockItem)
                .orderPrice(10000) // 주문 시점의 개별 상품 가격
                .count(2) // 주문 수량
                .build();

        User mockUser = User.builder()
                .email("test@example.com")
                .totalPoints(0)
                .build();


        Mockito.when(orderItemRepository.findById(orderId)).thenReturn(Optional.of(mockOrderItem));
        Mockito.when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(mockUser));

        //when
        reviewService.writeReivew(orderId, content, rating);

        //then
        Mockito.verify(reviewRepository, Mockito.times(1)).save(any(Review.class));
        assertThat(mockUser.getTotalPoints()).isEqualTo(2000); // 전체 주문 금액의 10 퍼센트
        assertThat(mockUser.getPointHistories().size()).isEqualTo(1);
        PointHistory pointHistory = mockUser.getPointHistories().getFirst();
        assertThat(pointHistory.getDescription()).isEqualTo("리뷰 작성 포인트 적립 - 주문 상품 번호: " + orderId);
    }

    @Test
    void 리뷰조회() throws Exception {
        //given
        Long userId = 1L;
        int page = 0;
        int size = 2;

        //when
        List<Review> mockReviews = List.of(
                Review.builder()
                        .content("좋은 상품이에요!") // 한글 content
                        .rating(5)
                        .createDate(LocalDateTime.now().minusDays(1))
                        .build(),
                Review.builder()
                        .content("배송이 빨라서 좋아요.") // 한글 content
                        .rating(4)
                        .createDate(LocalDateTime.now().minusDays(2))
                        .build()
        );

        Page<Review> mockPage = new PageImpl<>(mockReviews);
        Pageable pageable = PageRequest.of(page, size, Sort.by("createDate").descending());
        Mockito.when(reviewRepository.findReviewsByUserId(userId, pageable)).thenReturn(mockPage);

        List<ReviewDetailDto> result = reviewService.getWrittenReviews(userId, page, size);

        //then
        assertThat(result.size()).isEqualTo(2);
        assertThat(result.getFirst().getContent()).isEqualTo("좋은 상품이에요!");
        assertThat(result.getLast().getContent()).isEqualTo("배송이 빨라서 좋아요.");
        assertThat(result.getFirst().getRating()).isEqualTo(5);
        assertThat(result.getLast().getRating()).isEqualTo(4);
        Mockito.verify(reviewRepository, Mockito.times(1)).findReviewsByUserId(userId, pageable);
    }

    @Test
    void 리뷰수정_성공() throws Exception {
        //given
        Long reviewId = 1L;
        Long userId = 1L; // 요청한 사용자 ID
        String updatedContent = "수정된 리뷰 내용";
        int updatedRating = 4;

        User mockUser = User.builder()
                .id(userId)
                .email("test@example.com")
                .build();

        Review mockReview = Review.builder()
                .id(reviewId)
                .user(mockUser) // 작성자 설정
                .content("기존 리뷰 내용")
                .rating(5)
                .createDate(LocalDateTime.now())
                .build();

        Mockito.when(reviewRepository.findById(reviewId)).thenReturn(Optional.of(mockReview));

        //when
        reviewService.modifyReview(reviewId, updatedContent, updatedRating);

        //then
        assertThat(updatedContent).isEqualTo(mockReview.getContent());
        assertThat(updatedRating).isEqualTo(mockReview.getRating());
        Mockito.verify(reviewRepository, Mockito.times(1)).findById(reviewId);
    }
    
    @Test
    void 리뷰수정_존재하지않는리뷰_실패() throws Exception {
        //given
        Long reviewId = 1L;
        Long userId = 1L;

        Mockito.when(reviewRepository.findById(reviewId)).thenReturn(Optional.empty());

        //when
        //then
        IllegalArgumentException exception = Assertions.assertThrows(IllegalArgumentException.class, () -> {
            reviewService.modifyReview(reviewId,"수정된 내용", 4);
        });

        Assertions.assertEquals("해당 리뷰가 존재하지 않습니다.", exception.getMessage());
    }

    @Test
    void 리뷰삭제_성공() throws Exception {
        //given
        Long reviewId = 1L;
        Long userId = 1L;

        User mockUser = User.builder()
                .id(userId)
                .email("test@example.com")
                .build();

        Review mockReview = Review.builder()
                .id(reviewId)
                .user(mockUser) // 작성자 설정
                .content("기존 리뷰 내용")
                .rating(5)
                .createDate(LocalDateTime.now())
                .build();

        Mockito.when(reviewRepository.findById(reviewId)).thenReturn(Optional.of(mockReview));
        //when
        reviewService.deleteReview(reviewId);

        //then
        Mockito.verify(reviewRepository, Mockito.times(1)).delete(mockReview);
    }
}