package com.coffeebean;

import static org.assertj.core.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.transaction.annotation.Transactional;

import com.coffeebean.domain.item.controller.ApiV1ItemController;
import com.coffeebean.domain.item.entity.Item;
import com.coffeebean.domain.item.service.ItemService;
import com.coffeebean.domain.user.user.service.UserService;

import jakarta.servlet.http.HttpServletResponse;

@Transactional
@SpringBootTest
@ActiveProfiles("test")
@AutoConfigureMockMvc
public class ApiV1ItemControllerTest {

	@Autowired
	private MockMvc mvc;

	@Autowired
	private ItemService itemService;

	@Autowired
	private UserService userService;

	@Autowired
	private HttpServletResponse response;

	String adminAuthToken;

	String userAuthToken;

	@BeforeEach
	void setUp() {
		adminAuthToken = userService.loginAdmin("admin", "admin1234", response);
		userAuthToken = userService.loginUser("example@exam.com", "password", response).get("token");
	}

	@Test
	@DisplayName("커피 등록 및 조회")
	void addItem() {
		itemService.addItem("커피1", 1000, 10, "브라질 원두");
		itemService.addItem("커피2", 3000, 40, "미국 원두");
		itemService.addItem("커피3", 4000, 50, "케냐 원두");
		itemService.addItem("커피4", 6000, 12, "이탈리아 원두");
		itemService.addItem("커피5", 7000, 8, "가나 원두");

		// 저장된 아이템 목록 가져오기 (가정: getItems() 메서드가 존재)
		List<Item> items = itemService.getItems();

		assertThat(items).hasSize(5); // 아이템 개수 확인

		assertThat(items).extracting(Item::getName)
			.containsExactly("커피1", "커피2", "커피3", "커피4", "커피5");

		assertThat(items).extracting(Item::getPrice)
			.containsExactly(1000, 3000, 4000, 6000, 7000);

		assertThat(items).extracting(Item::getStockQuantity)
			.containsExactly(10, 40, 50, 12, 8);

		assertThat(items).extracting(Item::getDescription)
			.containsExactly("브라질 원두", "미국 원두", "케냐 원두", "이탈리아 원두", "가나 원두");
	}

	@Test
	@DisplayName("단건 조회")
	void getItem() {

		Item item = itemService.getItem(1).get();

		assertThat(item.getName()).isEqualTo("커피1");
	}

	@Nested
	@DisplayName("상품 삭제")
	class deleteItem {

		@Test
		@DisplayName("성공 - 관리자는 상품을 삭제할 수 있다")
		void deleteItemA_AdminRole() throws Exception {
			var itemId = 1L;

			ResultActions resultActions = mvc.perform(
					delete("/api/v1/items/%d".formatted(itemId))
						.header("Authorization", "Bearer " + adminAuthToken)
				)
				.andDo(print());

			resultActions
				.andExpect(status().isOk())
				.andExpect(handler().handlerType(ApiV1ItemController.class))
				.andExpect(handler().methodName("deleteItem"))
				.andExpect(jsonPath("$.code").value("200-1"))
				.andExpect(jsonPath("$.msg").value(itemId + "번 상품 삭제가 완료되었습니다."));

			assertThat(itemService.getItem(itemId)).isEmpty();
		}

		@Test
		@DisplayName("실패 - Admin 권한이 없는 일반 회원이 상품을 삭제하면 실패한다")
		void deleteItemB_noAdminRole() throws Exception {
			var itemId = 1L;

			ResultActions resultActions = mvc.perform(
					delete("/api/v1/items/%d".formatted(itemId))
						.header("Authorization", "Bearer " + userAuthToken)
				)
				.andDo(print());

			resultActions
				.andExpect(status().isForbidden())
				.andExpect(handler().handlerType(ApiV1ItemController.class))
				.andExpect(handler().methodName("deleteItem"))
				.andExpect(jsonPath("$.code").value("403-1"))
				.andExpect(jsonPath("$.msg").value("접근 권한이 없습니다."));

			assertThat(itemService.getItem(itemId)).isNotEmpty();
		}

		@Test
		@DisplayName("실패 - 로그인하지 않은 비회원이 상품을 삭제하면 실패한다")
		void deleteItemC_noAuth() throws Exception {
			var itemId = 1L;

			ResultActions resultActions = mvc.perform(
					delete("/api/v1/items/%d".formatted(itemId))
				)
				.andDo(print());

			resultActions
				.andExpect(status().isUnauthorized())
				.andExpect(handler().handlerType(ApiV1ItemController.class))
				.andExpect(handler().methodName("deleteItem"))
				.andExpect(jsonPath("$.code").value("401-1"))
				.andExpect(jsonPath("$.msg").value("인증 정보가 없거나 잘못되었습니다."));

			assertThat(itemService.getItem(itemId)).isNotEmpty();
		}
	}
}

