package com.coffeebean.domain.review.review.service;

import com.coffeebean.domain.item.entity.Item;
import com.coffeebean.domain.item.repository.ItemRepository;
import com.coffeebean.domain.order.order.DeliveryStatus;
import com.coffeebean.domain.order.order.entity.Order;
import com.coffeebean.domain.order.orderItem.entity.OrderItem;
import com.coffeebean.domain.order.orderItem.repository.OrderItemRepository;
import com.coffeebean.domain.review.review.ReviewableOrderItemDto;
import com.coffeebean.domain.review.review.entity.Review;
import com.coffeebean.domain.review.review.respository.ReviewRepository;
import com.coffeebean.domain.user.user.enitity.User;
import com.coffeebean.domain.user.user.repository.UserRepository;
import jakarta.persistence.EntityManager;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@Transactional
@ActiveProfiles("test")
public class ReviewServiceIntegrationTest {

    @Autowired private ReviewService reviewService;
    @Autowired private ReviewRepository reviewRepository;
    @Autowired private OrderItemRepository orderItemRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private EntityManager entityManager;


    @BeforeEach
    void setUp() {
        // 테스트 데이터 초기화 (필요 시)
        entityManager.clear();
        prepareTestData();
    }

    private void prepareTestData() {
        // 사용자 생성
        User user = User.builder()
                .id(1L)
                .email("test@example.com")
                .password("password")
                .name("Test User")
                .totalPoints(0)
                .build();

        userRepository.save(user);

        // 주문 생성
        Order order = Order.builder()
                .email("test@example.com")
                .deliveryStatus(DeliveryStatus.DONE)
                .orderDate(LocalDateTime.now().minusDays(5))
                .build();

        entityManager.persist(order);

        // 주문 아이템 생성
        Item item = Item.builder()
                .name("Test Item")
                .price(10000)
                .build();

        entityManager.persist(item);

        OrderItem orderItem = OrderItem.builder()
                .order(order)
                .item(item)
                .orderPrice(10000)
                .count(1)
                .build();

        orderItemRepository.save(orderItem);
    }


    @AfterEach
    void tearDown() {
        reviewRepository.deleteAll();
        orderItemRepository.deleteAll();
        userRepository.deleteAll();
        entityManager.clear();
    }

    @Test
    void 리뷰_작성_성공() throws Exception {
        //given
        Long orderItemId = 1L;
        String content = "정말 좋았어요!";
        int rating = 5;

        //when
        reviewService.writeReivew(orderItemId, content, rating);

        //then
        List<Review> reviews = reviewRepository.findAll();
        assertThat(reviews.size()).isEqualTo(1);
        assertThat(reviews.getFirst().getContent()).isEqualTo("정말 좋았어요!");
        assertThat(reviews.getFirst().getRating()).isEqualTo(5);
    }

    @Test
    void 작성_가능한_리뷰() throws Exception {
        //given
        String email = "test@example.com";
        
        //when
        List<ReviewableOrderItemDto> reviewableOrderItems = reviewService.getReviewableOrderItems(email);

        //then
        assertThat(reviewableOrderItems.size()).isEqualTo(1);
        assertThat(reviewableOrderItems.getFirst().getItemName()).isEqualTo("Test Item");
    }

    @Test
    void 리뷰_수정() throws Exception {
        //given
        Long reviewId = 1L;
        String newContent = "수정된 내용입니다.";
        int newRating = 4;

        reviewService.writeReivew(1L, "기존 내용입니다.", 3);

        //when
        reviewService.modifyReview(reviewId, newContent, newRating);
        Review updateReview = reviewRepository.findById(reviewId).get();

        //then
        assertThat(updateReview.getContent()).isEqualTo(newContent);
        assertThat(updateReview.getRating()).isEqualTo(newRating);
    }

    @Test
    void 리뷰_삭제() throws Exception {
        //given
        Long userId = 1L;
        Long reviewId = 1L;

        reviewService.writeReivew(1L, "최고입니다", 5);

        //whene
        reviewService.deleteReview(reviewId);

        //then
        List<Review> reviews = reviewRepository.findAll();
        assertThat(reviews.isEmpty());
    }


}

