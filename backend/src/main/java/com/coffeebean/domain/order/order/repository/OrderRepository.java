package com.coffeebean.domain.order.order.repository;

import com.coffeebean.domain.order.order.DeliveryStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.coffeebean.domain.order.order.entity.Order;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findAllByEmail(String email); // 사용자의 이메일로 전체 주문 내역 조회
    Optional<Order> findByEmail(String email); // 사용자의 이메일로 단건 주문 조회

    @Query("select o from Order o where o.email = :email order by o.orderDate desc limit 3")
    List<Order> findTop3ByEmailOrderByOrderDateDesc(@Param("email") String email); // 사용자의 이메일로 최신순 3건 조회

    // 특정 배송 상태에 해당되는 주문 조회
    List<Order> findByDeliveryStatusIn(List<DeliveryStatus> deliveryStatuses);

    // 전체 조회
    @Query("SELECT o FROM Order o " +
            "JOIN FETCH o.orderItems oi " +
            "JOIN FETCH oi.item")
    List<Order> findAllOrdersWithItems();


}
