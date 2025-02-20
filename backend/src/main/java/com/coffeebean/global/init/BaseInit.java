package com.coffeebean.global.init;

import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.coffeebean.domain.item.entity.Item;
import com.coffeebean.domain.item.repository.ItemRepository;
import com.coffeebean.domain.user.user.Address;
import com.coffeebean.domain.user.user.enitity.User;
import com.coffeebean.domain.user.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Configuration
@RequiredArgsConstructor
public class BaseInit {

	private final UserRepository userRepository;
	private final PasswordEncoder passwordEncoder;
	private final ItemRepository itemRepository;

	@Bean
	public ApplicationRunner initUser() {
		return args -> {
			if (userRepository.count() == 0) {
				String encodedPassword = passwordEncoder.encode("password");
				User user = User.builder()
					.email("example@exam.com")
					.password(encodedPassword) // 암호화 생략
					.name("user1")
					.address(new Address("서울", "관악구 원두아파트", "12345"))
					.verified(true) // 이메일 인증 완료되었다고 가정
					.build();

				// User 엔티티를 DB에 저장
				userRepository.save(user);
			}
		};
	}

	@Bean
	public ApplicationRunner initItem() {
		return args -> {

			if (itemRepository.count() == 0) {
				// 상품 20개 추가
				for (int i = 0; i < 20; i++) {
					itemRepository.save(Item.builder()
						.stockQuantity(3)
						.price(20000 + i * 10)
						.description(i + "상품의 설명")
						.name(i + "상품")
						.build());
				}
			}
		};
	}
}
