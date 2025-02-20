package com.coffeebean.domain.cart.cart.dto;

import com.coffeebean.domain.cart.cartItem.entity.CartItem;
import lombok.Getter;
import org.springframework.lang.NonNull;

@Getter
public class CartItemDto {

    @NonNull
    private long id;

    private int quantity;

    private String name;

    private int price;

    public CartItemDto(CartItem cartItem) {
        this.quantity = cartItem.getQuantity();
        this.id = cartItem.getItem().getId();
        this.name = cartItem.getItem().getName();
        this.price = cartItem.getItem().getPrice();
    }
}
