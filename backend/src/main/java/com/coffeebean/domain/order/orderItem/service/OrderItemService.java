package com.coffeebean.domain.order.orderItem.service;

import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.coffeebean.domain.item.entity.Item;
import com.coffeebean.domain.order.order.entity.Order;
import com.coffeebean.domain.order.orderItem.entity.OrderItem;
import com.coffeebean.domain.order.orderItem.repository.OrderItemRepository;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class OrderItemService {

	private final OrderItemRepository orderItemRepository;

	@Transactional
	public void createOrderItem(Order order, Map<Long, Integer> items) {
		for (Long itemId : items.keySet()) {
			int count = items.get(itemId);
			OrderItem orderItem = OrderItem.builder()
				.order(order)
				.item(Item.builder().id(itemId).build()) // 아직 Item ID 유효성 검사는 하지 않음
				.count(count)
				.build();
			orderItemRepository.save(orderItem);
		}
	}
}
