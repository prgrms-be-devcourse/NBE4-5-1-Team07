package com.coffeebean.domain.cart.cart.controller;

import com.coffeebean.domain.cart.cart.dto.CartItemDto;
import com.coffeebean.domain.cart.cart.dto.CartListResponseDto;
import com.coffeebean.domain.cart.cart.entity.Cart;
import com.coffeebean.domain.cart.cart.service.CartService;
import com.coffeebean.domain.cart.cartItem.service.CartItemService;
import com.coffeebean.domain.user.user.enitity.User;
import com.coffeebean.domain.user.user.service.UserService;
import com.coffeebean.global.annotation.Login;
import com.coffeebean.global.dto.RsData;
import com.coffeebean.global.exception.ServiceException;
import com.coffeebean.global.util.CustomUserDetails;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.java.Log;

import java.util.List;

import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

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
		Integer quantity
		) {
	}

	// 자신의 장바구니에 상품 추가
	@PostMapping
	public RsData<Void> addCartItemToCart(@RequestBody @Valid AddItemReqBody addItemReqBody,
		@Login CustomUserDetails userDetails) {
		User actor = User.builder()
			.id(userDetails.getUserId())
			.email(userDetails.getEmail())
			.build();

		Cart cart = cartService.getMyCart(actor);
		cartItemService.addCartItem(cart, addItemReqBody.id(), addItemReqBody.quantity());

		return new RsData<>(
			"200-1",
			"장바구니에 상품이 추가되었습니다."
		);
	}

	record AuthReqBody(@NotBlank(message = "인증 정보가 없습니다.") String authToken) {
	}

	// 자신의 장바구니 전체 조회
	@GetMapping
	@Transactional(readOnly = true)
	public RsData<CartListResponseDto> getCarts(@Login CustomUserDetails userDetails) {

		User actor = User.builder()
			.id(userDetails.getUserId())
			.email(userDetails.getEmail())
			.build();

		Cart cart = cartService.getMyCart(actor);

		List<CartItemDto> cartItems = cartItemService.getCartItems(cart).stream()
			.map(CartItemDto::new)
			.toList();

		return new RsData<>(
			"200-1",
			"내 장바구니 조회가 완료되었습니다.",
			new CartListResponseDto(cartItems)
		);
	}

	record CartItemModifyReqBody(
		@NotNull(message = "상품 수량이 입력되지 않았습니다.")
		@Min(value = 1, message = "잘못된 상품 수량입니다.")
		int quantity,
		@NotBlank(message = "인증 정보가 없습니다.")
		String authToken
	) {
	}

	// 자신의 장바구니 상품 수량 변경
	@PutMapping("/{id}")
	@Transactional
	public RsData<Void> modifyCartItem(@RequestBody @Valid CartItemModifyReqBody cartModifyReqBody,
		@PathVariable(name = "id") Long itemId) {

		User actor = userService.getUserByAuthToken(cartModifyReqBody.authToken());
		User realActor = userService.findByEmail(actor.getEmail())
			.orElseThrow(() -> new ServiceException("401", "인증 정보가 잘못되었습니다."));
		Cart cart = cartService.getMyCart(realActor);

		cartItemService.modifyCartItem(cart, itemId, cartModifyReqBody.quantity());

		return new RsData<>(
			"200-1",
			"장바구니의 상품 수량이 변경되었습니다."
		);
	}

	// 자신의 장바구니 상품 삭제
	@DeleteMapping("/{id}")
	@Transactional
	public RsData<Void> deleteCartItem(
		@RequestBody @Valid AuthReqBody authReqBody,
		@PathVariable(name = "id") Long itemId
	) {
		User actor = userService.getUserByAuthToken(authReqBody.authToken());
		User realActor = userService.findByEmail(actor.getEmail())
			.orElseThrow(() -> new ServiceException("401", "인증 정보가 잘못되었습니다."));
		Cart cart = cartService.getMyCart(realActor);

		cartItemService.deleteCartItem(cart, itemId);

		return new RsData<>(
			"200-1",
			"장바구니의 상품이 삭제되었습니다."
		);
	}

	// 자산의 장바구니 상품 전체 삭제
	@DeleteMapping()
	@Transactional
	public RsData<Void> deleteCart(@RequestBody @Valid AuthReqBody authReqBody) {
		User actor = userService.getUserByAuthToken(authReqBody.authToken());
		User realActor = userService.findByEmail(actor.getEmail())
			.orElseThrow(() -> new ServiceException("401", "인증 정보가 잘못되었습니다."));
		Cart cart = cartService.getMyCart(realActor);

		cartService.deleteCart(cart);

		return new RsData<>(
			"200-1",
			"장바구니에 담긴 모든 상품이 삭제되었습니다."
		);
	}
}
