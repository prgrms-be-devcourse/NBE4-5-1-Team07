package com.coffeebean.domain.order.orderItem.repository;

import com.coffeebean.domain.order.order.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.coffeebean.domain.order.orderItem.entity.OrderItem;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
    List<OrderItem> order(Order order);

    @Query("SELECT oi FROM OrderItem oi WHERE oi.order.email = :email")
    List<OrderItem> findByEmail(@Param("email") String email);

    @Query("SELECT oi FROM OrderItem oi " +
            "JOIN oi.order o " +
            "WHERE o.email = :email " +
            "AND o.deliveryStatus = 'DONE' " +
            "AND o.orderDate > :cutoffDate")
    List<OrderItem> findReviewableOrderItems(@Param("email") String email,
                                             @Param("cutoffDate") LocalDateTime cutoffDate);
}
