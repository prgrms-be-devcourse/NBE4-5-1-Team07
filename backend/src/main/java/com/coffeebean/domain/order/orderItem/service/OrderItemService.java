package com.coffeebean.domain.order.orderItem.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.coffeebean.domain.item.entity.Item;
import com.coffeebean.domain.item.repository.ItemRepository;
import com.coffeebean.domain.order.order.entity.Order;
import com.coffeebean.domain.order.orderItem.entity.OrderItem;
import com.coffeebean.domain.order.orderItem.repository.OrderItemRepository;
import com.coffeebean.global.exception.DataNotFoundException;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class OrderItemService {

	private final OrderItemRepository orderItemRepository;
	private final ItemRepository itemRepository;

	@Transactional
	public List<OrderItem> createOrderItem(Order order, Map<Long, Integer> items) {
		List<OrderItem> orderItems = new ArrayList<>();
		for (Long itemId : items.keySet()) {
			int count = items.get(itemId);
			Item item = itemRepository.findById(itemId)
				.orElseThrow(() -> new DataNotFoundException("주문하려는 상품이 존재하지 않습니다."));

			OrderItem orderItem = OrderItem.builder()
				.order(order)
				.item(item)
				.count(count)
				.build();

			orderItemRepository.save(orderItem);
			item.reduceStock(count);
			orderItems.add(orderItem);
		}
		return orderItems;
	}
}
