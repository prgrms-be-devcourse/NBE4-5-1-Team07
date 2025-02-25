package com.coffeebean.domain.order.order.dto;

import com.coffeebean.domain.order.orderItem.entity.OrderItem;
import lombok.Getter;

@Getter
public class OrderItemsDto {

    private Long id;
    private String itemName;
    private int count; // 주문 수량
    private int orderPrice; // 주문 당시 가격

    public OrderItemsDto(OrderItem orderItem) {
        this.id = orderItem.getId();
        this.itemName = orderItem.getItem().getName();
        this.count = orderItem.getCount();
        this.orderPrice = orderItem.getOrderPrice();
    }
}
