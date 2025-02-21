package com.coffeebean.domain.cart.cart.controller;

import static org.assertj.core.api.Assertions.*;
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

import com.coffeebean.domain.cart.cartItem.repository.CartItemRepository;
import com.coffeebean.domain.user.user.service.UserService;

import jakarta.servlet.http.HttpServletResponse;

@Transactional
@SpringBootTest
@ActiveProfiles("test")
@AutoConfigureMockMvc
class ApiV1CartControllerTest {

    @Autowired
    private MockMvc mvc;

    @Autowired
    private UserService userService;

    private String authToken;
    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private HttpServletResponse httpServletResponse;

    @BeforeEach
    void setUp() {
          authToken = userService.loginUser("example@exam.com", "password", httpServletResponse).get("token");
    }

    @Test
    @DisplayName("장바구니에 상품 추가")
    void addItemToCart() throws Exception {
        ResultActions resultActions = mvc.perform(
                        post("/api/v1/carts")
                                .content("""
                                        {
                                            "id": 3,
                                            "quantity": 1,
                                            "authToken": "%s"
                                        }
                                        """.formatted(authToken).trim().stripIndent())
                                .contentType(
                                        new MediaType(MediaType.APPLICATION_JSON, StandardCharsets.UTF_8)
                                )
                )
                .andDo(print());

        resultActions
                .andExpect(status().isOk())
                .andExpect(handler().handlerType(ApiV1CartController.class))
                .andExpect(handler().methodName("addCartItemToCart"))
                .andExpect(jsonPath("$.code").value("200-1"))
                .andExpect(jsonPath("$.msg").value("장바구니에 상품이 추가되었습니다."));
    }

    @Test
    @DisplayName("회원 자신의 장바구니 조회")
        // 테스트를 위해 데이터 추가 필요
    void getCarts() throws Exception {
        ResultActions resultActions = mvc
                .perform(
                        get("/api/v1/carts")
                                .content("""
                                        {
                                            "authToken": "%s"
                                        }
                                        """.formatted(authToken).trim().stripIndent())
                                .contentType(
                                        new MediaType(MediaType.APPLICATION_JSON, StandardCharsets.UTF_8))
                )
                .andDo(print());

        resultActions
                .andExpect(status().isOk())
                .andExpect(handler().handlerType(ApiV1CartController.class))
                .andExpect(handler().methodName("getCarts"))
                .andExpect(jsonPath("$.code").value("200-1"))
                .andExpect(jsonPath("$.msg").value("내 장바구니 조회가 완료되었습니다."))
                .andExpect(jsonPath("$.data.items[0].id").value("3"))
                .andExpect(jsonPath("$.data.items[0].name").value("3상품"))
                .andExpect(jsonPath("$.data.items[0].price").value("13000"))
                .andExpect(jsonPath("$.data.items[0].quantity").value("4"))
                .andExpect(jsonPath("$.data.items[1].id").value("8"))
                .andExpect(jsonPath("$.data.items[1].name").value("8상품"))
                .andExpect(jsonPath("$.data.items[1].price").value("18000"))
                .andExpect(jsonPath("$.data.items[1].quantity").value("2"));
    }

    @Test
    @DisplayName("자신의 장바구니의 상품 수량 변경")
        // 테스트를 위해 데이터 추가 필요
    void modifyCartItem() throws Exception {
        long itemId = 8L;
        int quantity = 4;
        ResultActions resultActions = mvc
                .perform(
                        put("/api/v1/carts/%d".formatted(itemId))
                                .content("""
                                        {
                                            "quantity": %d,
                                            "authToken": "%s"
                                        }
                                        """.formatted(quantity, authToken).trim().stripIndent())
                                .contentType(
                                        new MediaType(MediaType.APPLICATION_JSON, StandardCharsets.UTF_8))
                )
                .andDo(print());

        resultActions
                .andExpect(status().isOk())
                .andExpect(handler().handlerType(ApiV1CartController.class))
                .andExpect(handler().methodName("modifyCartItem"))
                .andExpect(jsonPath("$.code").value("200-1"))
                .andExpect(jsonPath("$.msg").value("장바구니의 상품 수량이 변경되었습니다."));

        int savedQuantity = cartItemRepository.findByItemId(itemId).get().getQuantity();
        assertThat(savedQuantity).isEqualTo(quantity);
    }

    @Test
    @DisplayName("자신의 장바구니 상품 삭제")
    void deleteCartItem() throws Exception {
        long itemId = 3;
        ResultActions resultActions = mvc
                .perform(
                        delete("/api/v1/carts/%d".formatted(itemId))
                                .content("""
                                        {
                                            "authToken": "%s"
                                        }
                                        """.formatted(authToken).trim().stripIndent())
                                .contentType(
                                        new MediaType(MediaType.APPLICATION_JSON, StandardCharsets.UTF_8))
                )
                .andDo(print());

        resultActions
                .andExpect(status().isOk())
                .andExpect(handler().handlerType(ApiV1CartController.class))
                .andExpect(handler().methodName("deleteCartItem"))
                .andExpect(jsonPath("$.code").value("200-1"))
                .andExpect(jsonPath("$.msg").value("장바구니의 상품이 삭제되었습니다."));

        assertThat(cartItemRepository.findByItemId(itemId)).isEmpty();
    }

    @Test
    @DisplayName("자신의 장바구니 상품 전체 삭제")
    void deleteCart() throws Exception {
        ResultActions resultActions = mvc
                .perform(
                        delete("/api/v1/carts")
                                .content("""
                                        {
                                            "authToken": "%s"
                                        }
                                        """.formatted(authToken).trim().stripIndent())
                                .contentType(
                                        new MediaType(MediaType.APPLICATION_JSON, StandardCharsets.UTF_8))
                )
                .andDo(print());

        resultActions
                .andExpect(status().isOk())
                .andExpect(handler().handlerType(ApiV1CartController.class))
                .andExpect(handler().methodName("deleteCart"))
                .andExpect(jsonPath("$.code").value("200-1"))
                .andExpect(jsonPath("$.msg").value("장바구니에 담긴 모든 상품이 삭제되었습니다."));

        assertThat(cartItemRepository.findByItemId(3L)).isEmpty();
        assertThat(cartItemRepository.findByItemId(8L)).isEmpty();
    }
}