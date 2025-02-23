package com.coffeebean.domain.order.order.service;

import java.rmi.UnexpectedException;
import java.util.List;

import com.coffeebean.domain.order.order.OrderDetailDto;
import com.coffeebean.domain.order.order.OrderDto;
import com.coffeebean.domain.order.orderItem.entity.OrderItem;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.coffeebean.domain.order.order.DeliveryStatus;
import com.coffeebean.domain.order.order.OrderStatus;
import com.coffeebean.domain.order.order.entity.Order;
import com.coffeebean.domain.order.order.repository.OrderRepository;
import com.coffeebean.domain.user.user.Address;
import com.coffeebean.global.exception.ServiceException;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
@Transactional(readOnly = true)
public class OrderService {

	private final OrderRepository orderRepository;

	@Transactional
	public Order createOrder(String email, String city, String street, String zipcode) {
		Order order = Order.builder()
			.email(email)
			.deliveryAddress(new Address(city, street, zipcode))
			.deliveryStatus(DeliveryStatus.READY)
			.orderStatus(OrderStatus.ORDER)
			.build();

		orderRepository.save(order);
		orderRepository.flush();
		return orderRepository.findById(order.getId())
			.orElseThrow(() -> new ServiceException("500-1", "주문이 등록되지 않았습니다."));
	}

	/**
	 * 이메일로 주문 리스트 조회
	 *
	 * @param email 고객 이메일
	 * @return List<OrderDto> 주문 DTO 리스트
	 */
	public List<OrderDto> getOrdersByEmail(String email) {
		List<Order> orders = orderRepository.findAllByEmail(email);
		return convertToDtoList(orders);
	}

	// 최신 3건만 보여 주는 용도
	@Transactional
	public List<OrderDto> getRecentOrdersByEmail(String email) {
		List<Order> orders = orderRepository.findTop3ByEmailOrderByOrderDateDesc(email);
		return convertToDtoList(orders);
	}

	private List<OrderDto> convertToDtoList(List<Order> orders) {
		return orders.stream()
				.map(order -> {
					// 주문 상품명이 없을 경우 기본값 설정
					return convertToDto(order);
				})
				.toList();
	}

	private OrderDto convertToDto(Order order) {
		if (order.getOrderItems().isEmpty()) {
			throw new IllegalStateException("주문에 상품이 없습니다.");
		}

		String itemName = order.getOrderItems().get(0).getItem().getName();

		// OrderDto 생성 및 반환
		return new OrderDto(
				order.getId(), // 주문 ID
				order.getOrderDate(), // 주문 시간
				itemName, // 대표 상품명 (첫 번째 상품 또는 기본값)
				order.getOrderStatus(), // 주문 상태
				order.getDeliveryStatus(), // 배송 상태
				order.getOrderItems().stream()
						.mapToInt(OrderItem::getTotalPrice) // 각 상품의 총 가격 합산
						.sum() // 전체 금액 계산
		);
	}

	/**
	 * 마이 페이지 - 주문 최근 내역 3건만 보여 주기
	 * @param email
	 * @return
	 */

	// 주문 상세 조회 (단건)
	public Order getOrderDetail(String email) {
		return orderRepository.findByEmail(email)
				.orElseThrow(() -> new IllegalArgumentException("해당 주문을 찾을 수 없습니다."));
	}

	// 주문 상세 조회 (단건)
	public OrderDetailDto getOrderDetailById(Long orderId) {
		Order order = orderRepository.findById(orderId)
				.orElseThrow(() -> new IllegalArgumentException("해당 주문을 찾을 수 없습니다."));

		// 주문 항목(OrderItem)을 DTO로 변환
		List<OrderDetailDto.OrderItemDto> orderItemDtos = order.getOrderItems().stream()
				.map(orderItem -> new OrderDetailDto.OrderItemDto(
						orderItem.getItem().getName(), // 상품명
						orderItem.getOrderPrice(),    // 개별 가격
						orderItem.getCount(),         // 수량
						orderItem.getTotalPrice()     // 개별 상품 총합
				))
				.toList();

		// 배송 주소 조합 (city + street + zipcode)
		String address = String.format("%s %s %s",
				order.getDeliveryAddress().getCity(),
				order.getDeliveryAddress().getStreet(),
				order.getDeliveryAddress().getZipcode());

		// 전체 금액 계산
		int totalPrice = orderItemDtos.stream()
				.mapToInt(OrderDetailDto.OrderItemDto::getTotalPrice)
				.sum();

		return new OrderDetailDto(
				order.getId(),
				order.getOrderDate(),
				orderItemDtos,
				totalPrice,
				address,
				order.getOrderStatus(),
				order.getDeliveryStatus()
		);
	}

	// 3. 주문 취소
	@Transactional
	public void cancelOrder(Long orderId) {
		Order order = orderRepository.findById(orderId).get();
		order.cancel();
	}
}
