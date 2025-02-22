package com.coffeebean.domain.order.order.dto;

import java.time.LocalDateTime;

import com.coffeebean.domain.order.order.DeliveryStatus;
import com.coffeebean.domain.order.order.OrderStatus;
import com.coffeebean.domain.order.order.entity.Order;
import com.coffeebean.domain.user.user.Address;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OrderCreateResponse {
	private long id; // 주문ID
	private String email; // 주문자 이메일
	private Address deliveryAddress; // 배송 주소
	private DeliveryStatus deliveryStatus; // 배송 상태
	private OrderStatus orderStatus; // 주문 상태
	private LocalDateTime orderDate; // 주문 시간

	public OrderCreateResponse(Order order) {
		this.id = order.getId();
		this.email = order.getEmail();
		this.deliveryAddress = order.getDeliveryAddress();
		this.deliveryStatus = order.getDeliveryStatus();
		this.orderStatus = order.getOrderStatus();
		this.orderDate = order.getOrderDate();
	}
}
