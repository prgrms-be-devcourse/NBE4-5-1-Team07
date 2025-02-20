package com.coffeebean.domain.order.order.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@RestController
public class OrderController {

	record OrderCreateReqBody(List<OrderItem> items, Address address,
							  @NotBlank(message = "이메일은 필수입니다.") @Email(message = "잘못된 이메일 형식입니다.") String email) {
	}

	record OrderItem(@NotNull(message = "상품 ID는 필수입니다.") Long id,
					 @Min(value = 1, message = "수량은 1개 이상입니다.") int count) {
	}

	record Address(@NotBlank(message = "배송지 주소 도시명은 필수입니다.") String city,
				   @NotBlank(message = "배송지 주소 상세주소는 필수입니다.") String street,
				   @NotBlank(message = "배송지 주소 우편번호는 필수입니다.") String zipcode) {
	}

	@PostMapping
	public ResponseEntity createOrder(@RequestBody @Valid OrderCreateReqBody orderCreateReqBody, BindingResult bindingResult) {
		return null;
	}
}
