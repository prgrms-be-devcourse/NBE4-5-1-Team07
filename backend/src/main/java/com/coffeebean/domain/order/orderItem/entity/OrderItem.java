package com.coffeebean.domain.order.orderItem.entity;

import com.coffeebean.domain.item.entity.Item;
import com.coffeebean.domain.order.order.entity.Order;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class OrderItem {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "order_id")
	private Order order;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "item_id")
	private Item item;

	private int orderPrice; // 주문 시점의 개별 상품 가격

	private int count; // 주문 수량

	@Builder.Default
	private boolean isWritten = false;

	public void markAsWritten() {
		isWritten = true;
	}

	// 조회 로직 주문 상품 전체 가격
	public int getTotalPrice() {
		return getOrderPrice() * getCount();
	}
}
