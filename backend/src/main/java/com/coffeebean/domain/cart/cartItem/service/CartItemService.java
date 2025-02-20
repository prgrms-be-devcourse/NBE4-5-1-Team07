package com.coffeebean.domain.cart.cartItem.service;

import com.coffeebean.domain.cart.cart.entity.Cart;
import com.coffeebean.domain.cart.cartItem.entity.CartItem;
import com.coffeebean.domain.cart.cartItem.repository.CartItemRepository;
import com.coffeebean.domain.item.entity.Item;
import com.coffeebean.domain.item.service.ItemService;
import com.coffeebean.global.exception.ServiceException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CartItemService {

    private final CartItemRepository cartItemRepository;
    private final ItemService itemService;

    @Transactional
    public void addCartItem(Cart cart, Long id, Integer quantity) {
        Item item = itemService.getItem(id)
                .orElseThrow(() -> new ServiceException("404-1", "존재하지 않는 상품입니다."));

        // 장바구니에 이미 존재하는 아이템을 또 장바구니에 추가하면 수량만 추가됨
        Optional<CartItem> opCartItem = cartItemRepository.findByCartIdAndItemId(cart.getId(), id);
        if (opCartItem.isPresent()) {
            CartItem cartItem = opCartItem.get();
            cartItem.addQuantity(quantity);
            cartItemRepository.save(cartItem);
            return;
        }

        // 장바구니에 존재하지 않는 아이템을 장바구니에 추가하면 장바구니 아이템 항목이 새로 추가됨
        CartItem cartItem = CartItem.builder()
                .cart(cart)
                .item(item)
                .quantity(quantity)
                .build();

        cartItemRepository.save(cartItem);
    }


}
