package com.coffeebean.domain.cart.cart.controller;

import com.coffeebean.domain.cart.cart.entity.Cart;
import com.coffeebean.domain.cart.cart.service.CartService;
import com.coffeebean.domain.cart.cartItem.service.CartItemService;
import com.coffeebean.domain.user.user.enitity.User;
import com.coffeebean.domain.user.user.service.UserService;
import com.coffeebean.global.dto.RsData;
import com.coffeebean.global.exception.ServiceException;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/carts")
public class ApiV1CartController {

    private final CartService cartService;
    private final CartItemService cartItemService;
    private final UserService userService;

    record AddItemReqBody(
            Long id,
            @NotNull(message = "상품 수량이 입력되지 않았습니다.")
            @Min(value = 1, message = "잘못된 상품 수량입니다.")
            Integer quantity,
            @NotBlank(message = "인증 정보가 없습니다.")
            String authToken
    ) {
    }

    // 자신의 장바구니에 상품 추가
    @PostMapping
    public RsData<Void> addCartItemToCart(@RequestBody @Valid AddItemReqBody addItemReqBody) {

        User actor = userService.getUserByAuthToken(addItemReqBody.authToken());
        User realActor = userService.findByEmail(actor.getEmail())
                .orElseThrow(() -> new ServiceException("401", "인증 정보가 잘못되었습니다."));
        Cart cart = cartService.getMyCart(realActor);
        cartItemService.addCartItem(cart, addItemReqBody.id(), addItemReqBody.quantity());

        return new RsData<>(
                "200-1",
                "장바구니에 상품이 추가되었습니다."
        );
    }


}
