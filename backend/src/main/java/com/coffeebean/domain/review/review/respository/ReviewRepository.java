package com.coffeebean.domain.review.review.respository;

import com.coffeebean.domain.review.review.entity.Review;
import com.coffeebean.domain.user.user.enitity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    Long user(User user);

    @Query("SELECT r FROM Review r WHERE r.user.id = :userId")
    Page<Review> findReviewsByUserId(@Param("userId") Long userId, Pageable pageable);
}
