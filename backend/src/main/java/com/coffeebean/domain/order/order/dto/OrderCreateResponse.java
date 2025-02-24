package com.coffeebean.domain.order.order.dto;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.coffeebean.domain.order.order.DeliveryStatus;
import com.coffeebean.domain.order.order.OrderStatus;
import com.coffeebean.domain.order.order.entity.Order;
import com.coffeebean.domain.order.orderItem.entity.OrderItem;
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
	private List<OrderItemBody> items = new ArrayList<>();
	private int totalPrice; // 총 가격

	@Getter
	@Setter
	static class OrderItemBody {
		private long id;
		private String name;
		private int count;
		private int price;

		public OrderItemBody(OrderItem orderItem) {
			this.id = orderItem.getItem().getId();
			this.name = orderItem.getItem().getName();
			this.price = orderItem.getItem().getPrice();
			this.count = orderItem.getCount();
		}
	}

	public OrderCreateResponse(Order order, List<OrderItem> orderItems) {
		this.id = order.getId();
		this.email = order.getEmail();
		this.deliveryAddress = order.getDeliveryAddress();
		this.deliveryStatus = order.getDeliveryStatus();
		this.orderStatus = order.getOrderStatus();
		this.orderDate = order.getOrderDate();
		this.totalPrice = orderItems.stream()
			.mapToInt(orderItem -> orderItem.getItem().getPrice() * orderItem.getCount())
			.sum();

		orderItems.stream()
			.map(OrderItemBody::new)
			.forEach(this.getItems()::add);
	}
}
