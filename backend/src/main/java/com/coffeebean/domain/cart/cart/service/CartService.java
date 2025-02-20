package com.coffeebean.domain.cart.cart.service;

import com.coffeebean.domain.cart.cart.entity.Cart;
import com.coffeebean.domain.cart.cart.repository.CartRepository;
import com.coffeebean.domain.user.user.enitity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartRepository cartRepository;

    @Transactional
    public Cart getMyCart(User actor) {
        Optional<Cart> opCart = cartRepository.findByUser(actor);

        // 사용자의 Cart가 존재하지 않는 경우 생성해 반환
        if (opCart.isEmpty()) {
            return cartRepository.save(Cart.builder().user(actor).build());
        }

        return opCart.get();
    }

}
