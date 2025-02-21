package com.coffeebean.domain.order.order.controller;

import java.rmi.UnexpectedException;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.coffeebean.domain.order.order.dto.OrderCreateRequest;
import com.coffeebean.domain.order.order.entity.Order;
import com.coffeebean.domain.order.order.service.OrderService;
import com.coffeebean.domain.order.orderItem.service.OrderItemService;
import com.coffeebean.domain.user.user.enitity.User;
import com.coffeebean.domain.user.user.service.UserService;
import com.coffeebean.global.dto.RsData;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/orders")
public class ApiV1OrderController {

	private final OrderService orderService;
	private final OrderItemService orderItemService;
	private final UserService userService;

	@PostMapping
	public ResponseEntity<Order> createOrder(@RequestBody @Valid OrderCreateRequest orderCreateRequest) throws UnexpectedException {
		String email = orderCreateRequest.getEmail();

		if (orderCreateRequest.getAuthToken() != null) {
			User actor = userService.getUserByAuthToken(orderCreateRequest.getAuthToken());
			email = actor.getEmail();
		}

		// Order 생성
		Order order = orderService.createOrder(email,
			orderCreateRequest.getAddress().getCity(),
			orderCreateRequest.getAddress().getStreet(),
			orderCreateRequest.getAddress().getZipcode());

		// Order의 세부 상품 항목들 OderItem 저장
		orderItemService.createOrderItem(order, orderCreateRequest.getItems());

		return ResponseEntity.status(HttpStatus.CREATED).body(order);
	}
}
