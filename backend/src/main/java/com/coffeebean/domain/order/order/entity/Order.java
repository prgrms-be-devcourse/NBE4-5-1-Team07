package com.coffeebean.domain.order.order.entity;

import java.time.LocalDateTime;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import com.coffeebean.domain.order.order.DeliveryStatus;
import com.coffeebean.domain.order.order.OrderStatus;
import com.coffeebean.domain.user.user.Address;

import jakarta.persistence.Column;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

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

}
