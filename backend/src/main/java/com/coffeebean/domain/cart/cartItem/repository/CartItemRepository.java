package com.coffeebean.domain.cart.cartItem.repository;

import com.coffeebean.domain.cart.cart.entity.Cart;
import com.coffeebean.domain.cart.cartItem.entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    List<CartItem> findByCart(Cart cart);
    Optional<CartItem> findByCartIdAndItemId(Long cartId, Long itemId);
    Optional<CartItem> findByItemId(Long itemId);
}
