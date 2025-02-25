package com.coffeebean.global.init;

import java.net.URI;
import java.net.URL;
import java.util.List;

import com.coffeebean.domain.cart.cart.entity.Cart;
import com.coffeebean.domain.cart.cart.repository.CartRepository;
import com.coffeebean.domain.cart.cart.service.CartService;
import com.coffeebean.domain.cart.cartItem.service.CartItemService;

import com.coffeebean.domain.notice.notice.entity.Notice;
import com.coffeebean.domain.notice.notice.repository.NoticeRepository;

import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.coffeebean.domain.item.entity.Item;
import com.coffeebean.domain.item.repository.ItemRepository;
import com.coffeebean.domain.question.answer.repository.AnswerRepository;
import com.coffeebean.domain.question.answer.service.AnswerService;
import com.coffeebean.domain.question.question.entity.Question;
import com.coffeebean.domain.question.question.repository.QuestionRepository;
import com.coffeebean.domain.user.pointHitstory.entity.PointHistory;
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
	private final QuestionRepository questionRepository;
	private final AnswerService answerService;
	private final AnswerRepository answerRepository;
	private final NoticeRepository noticeRepository;

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
					.totalPoints(5000)
					.pointHistories(List.of(PointHistory.builder()
						.amount(5000)
						.description("샘플 데이터 테스트를 위해 기본으로 지급되는 포인트")
						.build()))
					.build();
				userRepository.save(user);

				User user2 = User.builder()
					.email("user2@exam.com")
					.password(passwordEncoder.encode("password")) // 암호화 생략
					.name("user2")
					.address(new Address("수원", "수원구 원두아파트", "43251"))
					.totalPoints(5000)
					.pointHistories(List.of(PointHistory.builder()
						.amount(5000)
						.description("샘플 데이터 테스트를 위해 기본으로 지급되는 포인트")
						.build()))
					.build();
				userRepository.save(user2);
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
						.description("이 상품은 최고급 원두를 공수해 파는 No.1 제품입니다.<br>" +
							"이 제품은 사상 최대로 팔렸으며 지금도 월드 레코드를 갱신해 나가는 중입니다.<br>" +
							"상품번호는 " + i + "입니다.<br>" +
							"상품 문의는 문의사항에서 질문해주세요")
						.imageUrl("http://localhost:8080/%d.webp".formatted(i))
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

	@Transactional
	@Bean
	@Order(4)
	public ApplicationRunner initQuestion() {
		return args -> {
			if (questionRepository.count() == 0) {
				long userId = 1L;
				long itemId = 3L;
				User user = userRepository.findById(1L).get();
				Item item = itemRepository.findById(itemId).get();
				questionRepository.save(Question.builder()
					.item(item)
					.author(user)
					.subject("입고 질문")
					.content("언제 이 상품이 입고가 될까요")
					.build());

				long item2Id = 8L;
				Item item2 = itemRepository.findById(item2Id).get();
				questionRepository.save(Question.builder()
					.item(item2)
					.author(user)
					.subject("상품 원산지 관련 문의입니다.")
					.content("상품 원산지 정보가 표시되어 있지 않은데 어디인가요?")
					.build());

				long item3Id = 3L;
				Item item3 = itemRepository.findById(item3Id).get();
				questionRepository.save(Question.builder()
					.item(item3)
					.author(user)
					.subject("상품 원산지 관련 문의입니다.")
					.content("상품 원산지 정보가 표시되어 있지 않은데 어디인가요?")
					.build());

				User user2 = userRepository.findById(2L).get();
				long item4Id = 3L;
				Item item4 = itemRepository.findById(item4Id).get();
				questionRepository.save(Question.builder()
					.item(item4)
					.author(user2)
					.subject("배송 질문")
					.content("주문 했는데, 언제 배송되나요?")
					.build());
			}
		};
	}

	@Transactional
	@Bean
	@Order(5)
	public ApplicationRunner initAnswer() {
		return args -> {
			if (answerRepository.count() == 0) {
				long questionId = 1L;
				Question question = questionRepository.findById(questionId).get();
				answerService.writeAnswer(question, "내일 쯤 입고될 것 같습니다.");
			}
		};
	}

	@Bean
	@Order(6)
	public ApplicationRunner initNotice() {
		return args -> {

			if (noticeRepository.count() == 0) {
				// 공지사항 10개 추가
				for (int i = 1; i < 10; i++) {
					noticeRepository.save(Notice.builder()
						.title(i + "번 공지사항입니다.")
						.content("우리 커피빈은 최고급 원두를 공수해 파는 No.1 커피콩 브랜드입니다.<br>" +
							"우리 제품은 가장 많이 팔렸으며 지금도 월드 레코드를 갱신해 나가는 중입니다.<br>" +
							"공지사항번호는 " + i + "입니다.<br>" +
							"사이트는 추가로 업데이트할 예정입니다.")
						.build());
				}
			}
		};
	}
}
