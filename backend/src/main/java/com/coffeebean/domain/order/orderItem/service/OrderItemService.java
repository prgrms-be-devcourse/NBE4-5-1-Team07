package com.coffeebean.domain.order.orderItem.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.coffeebean.domain.cart.cart.entity.Cart;
import com.coffeebean.domain.cart.cart.repository.CartRepository;
import com.coffeebean.domain.cart.cart.service.CartService;
import com.coffeebean.domain.cart.cartItem.repository.CartItemRepository;
import com.coffeebean.domain.item.entity.Item;
import com.coffeebean.domain.item.repository.ItemRepository;
import com.coffeebean.domain.order.order.entity.Order;
import com.coffeebean.domain.order.orderItem.entity.OrderItem;
import com.coffeebean.domain.order.orderItem.repository.OrderItemRepository;
import com.coffeebean.domain.user.user.enitity.User;
import com.coffeebean.domain.user.user.repository.UserRepository;
import com.coffeebean.domain.user.user.service.UserService;
import com.coffeebean.global.exception.DataNotFoundException;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class OrderItemService {

	private final OrderItemRepository orderItemRepository;
	private final ItemRepository itemRepository;
	private final UserRepository userRepository;
	private final CartService cartService;

	@Transactional
	public List<OrderItem> createOrderItem(Order order, Map<Long, Integer> items, String email, boolean isCartOrder) {
		List<OrderItem> orderItems = new ArrayList<>();

		for (Long itemId : items.keySet()) {
			int count = items.get(itemId);
			Item item = itemRepository.findById(itemId)
				.orElseThrow(() -> new DataNotFoundException("주문하려는 상품이 존재하지 않습니다."));

			OrderItem orderItem = OrderItem.builder()
				.order(order)
				.item(item)
				.count(count)
				.orderPrice(item.getPrice())
				.build();

			orderItemRepository.save(orderItem);
			item.reduceStock(count);
			orderItems.add(orderItem);
		}

		Optional<User> opActor = userRepository.findByEmail(email);
		if (isCartOrder && opActor.isPresent()) {
			Cart cart = cartService.getMyCart(opActor.get());
			cart.deleteItems(orderItems.stream()
				.map(OrderItem::getItem)
				.collect(Collectors.toList()));
		}

		return orderItems;
	}
}
