package com.coffeebean.domain.order.order;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class OrderDto {

    private Long orderId; // 주문 ID
    private LocalDateTime orderDate; // 주문 시간
    private String itemName; // 주문 상품명
    private OrderStatus orderStatus; // 주문 상태
    private DeliveryStatus deliveryStatus; // 배송 상태
    private int totalPrice; // 전체 주문 금액
}
