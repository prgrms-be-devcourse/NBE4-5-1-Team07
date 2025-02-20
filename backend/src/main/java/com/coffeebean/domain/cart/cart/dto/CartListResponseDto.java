package com.coffeebean.domain.cart.cart.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@Getter
@AllArgsConstructor
public class CartListResponseDto {
    private List<CartItemDto> items;
}