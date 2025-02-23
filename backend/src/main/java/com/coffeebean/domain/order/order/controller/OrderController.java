package com.coffeebean.domain.order.order.controller;

import com.coffeebean.domain.order.order.OrderDetailDto;
import com.coffeebean.domain.order.order.OrderDto;
import com.coffeebean.domain.order.order.service.OrderService;
import com.coffeebean.global.annotation.Login;
import com.coffeebean.global.exception.DataNotFoundException;
import com.coffeebean.global.util.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    /**
     * 1. 전체 주문 내역 조회
     * GET /api/users/{email}/orders
     */
    @GetMapping("/my/orders")
    public ResponseEntity<List<OrderDto>> getAllOrders(@Login CustomUserDetails customUserDetails) {
        String email = customUserDetails.getEmail();
        List<OrderDto> orders = orderService.getOrdersByEmail(email);
        if (orders.isEmpty()) {
            throw new DataNotFoundException("해당 이메일로 주문 내역을 찾을 수 없습니다.");
        }
        return ResponseEntity.ok(orders);
    }

    /**
     * 2. 주문 상세 조회
     * GET /api/orders/{orderId}
     */
    @GetMapping("/orders/{orderId}")
    public ResponseEntity<OrderDetailDto> getOrderDetail(@Login CustomUserDetails customUserDetails, @PathVariable("orderId") Long orderId) {
        log.info("Received request for order ID: {}", orderId);
        OrderDetailDto order = orderService.getOrderDetailById(orderId);
        if (order == null) {
            throw new DataNotFoundException("해당 주문 번호를 찾을 수 없습니다.");
        }
        return ResponseEntity.ok(order);
    }

    /**
     * 3. 주문 취소
     * PUT /api/orders/{orderId}/cancel
     */
    @PutMapping("/orders/{orderId}/cancel")
    public ResponseEntity<?> cancelOrder(@PathVariable("orderId") Long orderId) {
        orderService.cancelOrder(orderId);
        return ResponseEntity.noContent().build();
    }
}
