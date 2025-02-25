package com.coffeebean.domain.order.order.controller;

import java.util.List;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.coffeebean.domain.item.service.ItemService;
import com.coffeebean.domain.order.order.dto.OrderCreateRequest;
import com.coffeebean.domain.order.order.dto.OrderCreateResponse;
import com.coffeebean.domain.order.order.entity.Order;
import com.coffeebean.domain.order.order.service.OrderService;
import com.coffeebean.domain.order.orderItem.entity.OrderItem;
import com.coffeebean.domain.order.orderItem.service.OrderItemService;
import com.coffeebean.domain.user.user.service.UserService;
import com.coffeebean.global.dto.RsData;
import com.coffeebean.global.exception.ServiceException;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/orders")
public class ApiV1OrderController {

	private final OrderService orderService;
	private final OrderItemService orderItemService;
	private final ItemService itemService;
	private final UserService userService;

	@PostMapping
	public RsData<OrderCreateResponse> createOrder(@RequestBody @Valid OrderCreateRequest orderCreateRequest) {
		String email = orderCreateRequest.getEmail();

		// 재고 부족 시 주문 등록 실패
		if (!itemService.isStockSufficient(orderCreateRequest.getItems())) {
			throw new ServiceException("400-3", "재고가 충분하지 않습니다. 상품 수량을 확인하세요.");
		}

		// 주문에 상품이 하나도 포함되어 있지 않으면 실패
		if (orderCreateRequest.getItems().isEmpty()) {
			throw new ServiceException("400-4", "주문에 상품이 추가되지 않았습니다. 먼저 상품을 추가하세요.");
		}

		// 적립금을 사용하는 주문이면 적립금이 사용 가능한지 검사
		if (orderCreateRequest.getPoint() != 0 &&
			!userService.isPointAvailable(orderCreateRequest.getEmail(), orderCreateRequest.getPoint())) {
			throw new ServiceException("400-5", "적립금을 사용할 수 없습니다.");
		}

		// Order 생성
		Order order = orderService.createOrder(email,
			orderCreateRequest.getAddress().getCity(),
			orderCreateRequest.getAddress().getStreet(),
			orderCreateRequest.getAddress().getZipcode());

		// Order의 세부 상품 항목들 OderItem 저장
		List<OrderItem> orderItems = orderItemService.createOrderItem(order, orderCreateRequest.getItems(), email,
			orderCreateRequest.getCartOrder(), orderCreateRequest.getPoint());

		orderService.sendOrderMail(order);

		return new RsData<>(
			"201-1",
			"주문이 등록되었습니다.",
			new OrderCreateResponse(order, orderItems)
		);
	}
}
