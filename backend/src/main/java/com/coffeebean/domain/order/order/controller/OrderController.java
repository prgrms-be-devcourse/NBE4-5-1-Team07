package com.coffeebean.domain.order.order.controller;

import com.coffeebean.domain.order.order.OrderDetailDto;
import com.coffeebean.domain.order.order.OrderDto;
import com.coffeebean.domain.order.order.service.OrderService;
import com.coffeebean.domain.user.user.dto.EmailVerificationRequest;
import com.coffeebean.domain.user.user.service.EmailVerificationService;
import com.coffeebean.domain.user.user.service.UserService;
import com.coffeebean.global.annotation.Login;
import com.coffeebean.global.dto.RsData;
import com.coffeebean.global.exception.DataNotFoundException;
import com.coffeebean.global.exception.ServiceException;
import com.coffeebean.global.util.CustomUserDetails;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.java.Log;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;
    private final EmailVerificationService emailVerificationService;

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

    // 비회원 주문 조회 - 이메일 인증
    @PostMapping("/v1/non-user/verify")
    public RsData<Void> nonUserEmailVerification(@RequestBody String email) {
        try {
            emailVerificationService.sendVerificationEmail(email);
            return new RsData<>("200-1", "인증번호가 이메일로 전송되었습니다.");
        } catch (Exception e) {
            throw new ServiceException("500-1", "이메일 발송 실패: " + e.getMessage());
        }
    }

    // 비회원 주문 조회 - 인증 완료
    @PostMapping("/v1/non-user/verify/true")
    public RsData<Void> verifyEmail(@RequestBody @Valid EmailVerificationRequest emailVerificationRequest) {
        boolean result = emailVerificationService.verifyEmailForGuest(emailVerificationRequest.getEmail(), emailVerificationRequest.getCode());
        log.info("컨트롤러 요청 데이터 -> email={}, code={}", emailVerificationRequest.getEmail(), emailVerificationRequest.getCode());
        if (!result) {
            throw new ServiceException("400-2", "이메일 인증 실패");
        }
        return new RsData<>("200-2", "이메일 인증 성공");
    }

    // 비회원 주문 조회 - 주문 리스트 반환
    @GetMapping("/v1/non-user/orders")
    public ResponseEntity<List<OrderDto>> getNonUserOrders(@RequestHeader("X-NonUser-Email") String email) {
        List<OrderDto> orders = orderService.getOrdersByEmail(email);
        if (orders.isEmpty()) {
            throw new DataNotFoundException("해당 이메일로 주문 내역을 찾을 수 없습니다.");
        }
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/v1/non-user/orders/{orderId}")
    public ResponseEntity<OrderDetailDto> getNonUserOrderDetailDto(@PathVariable("orderId") Long orderId) {
        OrderDetailDto order = orderService.getOrderDetailById(orderId);
        if (order == null) {
            throw new DataNotFoundException("해당 주문 번호를 찾을 수 없습니다.");
        }
        return ResponseEntity.ok(order);
    }
    @PutMapping("/v1/non-user/orders/{orderId}/cancel")
    public ResponseEntity<?> cancelNonUserOrder(@PathVariable("orderId") Long orderId) {
        orderService.cancelOrder(orderId);
        return ResponseEntity.noContent().build();
    }
}



