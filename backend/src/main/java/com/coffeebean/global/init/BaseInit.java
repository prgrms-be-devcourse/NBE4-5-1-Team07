package com.coffeebean.global.init;

import com.coffeebean.domain.cart.cart.entity.Cart;
import com.coffeebean.domain.cart.cart.repository.CartRepository;
import com.coffeebean.domain.cart.cart.service.CartService;
import com.coffeebean.domain.cart.cartItem.service.CartItemService;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.coffeebean.domain.item.entity.Item;
import com.coffeebean.domain.item.repository.ItemRepository;
import com.coffeebean.domain.user.user.Address;
import com.coffeebean.domain.user.user.enitity.User;
import com.coffeebean.domain.user.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;

@Configuration
@RequiredArgsConstructor
public class BaseInit {

	private final UserRepository userRepository;
	private final PasswordEncoder passwordEncoder;
	private final ItemRepository itemRepository;
	private final CartService cartService;
	private final CartItemService cartItemService;
	private final CartRepository cartRepository;

	@Transactional
	@Bean
	@Order(1)
	public ApplicationRunner initUser() {
		return args -> {
			if (userRepository.count() == 0) {
				User user = User.builder()
					.email("example@exam.com")
					.password(passwordEncoder.encode("password")) // 암호화 생략
					.name("user1")
					.address(new Address("서울", "관악구 원두아파트", "12345"))
					.build();
				userRepository.save(user);
			}
		};
	}

	@Bean
	@Order(2)
	public ApplicationRunner initItem() {
		return args -> {

			if (itemRepository.count() == 0) {
				// 상품 20개 추가
				for (int i = 1; i < 20; i++) {
					itemRepository.save(Item.builder()
						.stockQuantity(3)
						.price(10000 + i * 1000)
						.description(i + "상품의 설명")
						.name(i + "상품")
						.build());
				}
			}
		};
	}

	@Transactional
	@Bean
	@Order(3)
	public ApplicationRunner initCart() {
		return args -> {
			if (cartRepository.count() == 0) {
				User actor = userRepository.findByEmail("example@exam.com").get();
				Cart cart = cartService.getMyCart(actor);
				cartItemService.addCartItem(cart, 3L, 4);
				cartItemService.addCartItem(cart, 8L, 2);
			}
		};
    }
}
