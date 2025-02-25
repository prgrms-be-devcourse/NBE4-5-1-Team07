package com.coffeebean.domain.review.review.respository;

import com.coffeebean.domain.review.review.entity.Review;
import com.coffeebean.domain.review.review.entity.ReviewDetailDto;
import com.coffeebean.domain.review.review.entity.ReviewDetailNotImageDto;
import com.coffeebean.domain.user.user.enitity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    Long user(User user);

    @Query("SELECT r FROM Review r WHERE r.user.id = :userId")
    Page<Review> findReviewsByUserId(@Param("userId") Long userId, Pageable pageable);

    @Query("SELECT r.orderItem.id FROM Review r WHERE r.user.id = :userId")
    List<Long> findReviewedOrderItemIdsByUserId(@Param("userId") Long userId);

    @Query("SELECT new com.coffeebean.domain.review.review.entity.ReviewDetailNotImageDto(r.id, r.content, r.rating, r.createDate) " +
            "FROM Review r JOIN r.orderItem oi JOIN oi.item i WHERE i.id = :itemId")
    List<ReviewDetailNotImageDto> findByItemId(@Param("itemId") Long itemId);

    List<Review> findAllByOrderByCreateDateDesc();
}
