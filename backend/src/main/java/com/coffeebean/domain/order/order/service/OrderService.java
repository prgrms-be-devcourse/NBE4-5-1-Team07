package com.coffeebean.domain.order.order.service;

import java.rmi.UnexpectedException;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.coffeebean.domain.order.order.DeliveryStatus;
import com.coffeebean.domain.order.order.OrderStatus;
import com.coffeebean.domain.order.order.entity.Order;
import com.coffeebean.domain.order.order.repository.OrderRepository;
import com.coffeebean.domain.user.user.Address;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class OrderService {

	private final OrderRepository orderRepository;

	@Transactional
	public Order createOrder(String email, String city, String street, String zipcode) throws UnexpectedException {
		Order order = Order.builder()
			.email(email)
			.deliveryAddress(new Address(city, street, zipcode))
			.deliveryStatus(DeliveryStatus.READY)
			.orderStatus(OrderStatus.ORDER)
			.build();

		orderRepository.save(order);
		orderRepository.flush();
		return orderRepository.findById(order.getId())
			.orElseThrow(() -> new UnexpectedException("주문이 등록되지 않았습니다."));
	}
}
