package com.coffeebean.domain.order.order.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.coffeebean.domain.order.order.entity.Order;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
}
