package com.coffeebean.domain.order.order.controller;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.nio.charset.StandardCharsets;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.transaction.annotation.Transactional;

import com.coffeebean.domain.user.user.service.UserService;

@Transactional
@SpringBootTest
@ActiveProfiles("test")
@AutoConfigureMockMvc
class ApiV1OrderControllerTest {

	@Autowired
	private MockMvc mvc;

	@Autowired
	private UserService userService;

	private String authToken;

	@BeforeEach
	void setUp() {
		authToken = userService.login("example@exam.com", "password");
	}

	@Test
	@DisplayName("회원, 비회원은 주문을 등록할 수 있다")
	void createOrder() throws Exception {
		ResultActions resultActions = mvc.perform(
				post("/api/v1/orders")
					.content("""
						{
						  "items": [
						    {
						      "id": 1,
						      "count": 2
						    },
						    {
						      "id": 2,
						      "count": 3
						    }
						  ],
						  "address": {
						    "city": "서울",
						    "street": "원두아파트 100동 1201호",
						    "zipcode": "23578"
						  },
						  "email": "example@exam.com",
						  "authToken": "%s"
						}
						""".formatted(authToken).trim().stripIndent())
					.contentType(
						new MediaType(MediaType.APPLICATION_JSON, StandardCharsets.UTF_8)
					)
			)
			.andDo(print());

		resultActions
			.andExpect(status().isCreated())
			.andExpect(handler().handlerType(ApiV1OrderController.class))
			.andExpect(handler().methodName("createOrder"))
			.andExpect(jsonPath("$.deliveryAddress.city").value("서울"))
			.andExpect(jsonPath("$.deliveryAddress.street").value("원두아파트 100동 1201호"))
			.andExpect(jsonPath("$.deliveryAddress.zipcode").value("23578"))
			.andExpect(jsonPath("$.deliveryStatus").value("READY"))
			.andExpect(jsonPath("$.orderStatus").value("ORDER"))
			.andExpect(jsonPath("$.orderDate").isNotEmpty());
	}
}