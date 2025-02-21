package com.coffeebean.domain.order.order.entity;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.coffeebean.domain.order.orderItem.entity.OrderItem;
import jakarta.persistence.*;
import org.hibernate.annotations.BatchSize;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import com.coffeebean.domain.order.order.DeliveryStatus;
import com.coffeebean.domain.order.order.OrderStatus;
import com.coffeebean.domain.user.user.Address;

import jakarta.validation.constraints.Email;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import static jakarta.persistence.CascadeType.ALL;

@Entity
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "orders")
@EntityListeners(AuditingEntityListener.class)
public class Order {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "order_id")
	private Long id;

	@Email
	@Column(nullable = false)
	private String email;    // 주문자 이메일

	@Embedded
	private Address deliveryAddress; // 배송 주소

	@Enumerated(EnumType.STRING)
	private DeliveryStatus deliveryStatus; // 배송 상태

	@Enumerated(EnumType.STRING)
	private OrderStatus orderStatus; // 주문 상태

	@CreatedDate
	@Setter(AccessLevel.PRIVATE)
	private LocalDateTime orderDate; // 주문 시간

	@OneToMany(mappedBy = "order")
	@Builder.Default
	private List<OrderItem> orderItems = new ArrayList<>();

	/**
	 * 비즈니스 로직 추가: 주문 취소
	 */
	public void cancel() {
		if (orderStatus != OrderStatus.ORDER || deliveryStatus != DeliveryStatus.READY) {
			throw new IllegalArgumentException("주문을 취소할 수 없는 상태입니다.");
		}
		orderStatus = OrderStatus.CANCELED;
		deliveryStatus = DeliveryStatus.CANCELLED;
	}
}
