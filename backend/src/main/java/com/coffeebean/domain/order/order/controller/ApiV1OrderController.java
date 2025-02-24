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
import com.coffeebean.domain.user.user.enitity.User;
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
	private final UserService userService;
	private final ItemService itemService;

	@PostMapping
	public RsData<OrderCreateResponse> createOrder(@RequestBody @Valid OrderCreateRequest orderCreateRequest) {
		String email = orderCreateRequest.getEmail();

		// 재고 부족 시 주문 등록 실패
		if (!itemService.isStockSufficient(orderCreateRequest.getItems())) {
			throw new ServiceException("400-1", "재고가 충분하지 않습니다. 상품 수량을 확인하세요.");
		}

		// 회원이 주문을 등록하는 경우
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
		List<OrderItem> orderItems = orderItemService.createOrderItem(order, orderCreateRequest.getItems());

		return new RsData<>(
			"201-1",
			"주문이 등록되었습니다.",
			new OrderCreateResponse(order, orderItems)
		);
	}
}
