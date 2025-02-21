package com.coffeebean.domain.order.order;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class OrderDetailDto {
    private Long orderId; // 주문 번호
    private LocalDateTime orderDate; // 주문 시간
    private List<OrderItemDto> orderItems; // 전체 주문 내역 (각 상품 정보 포함)
    private int totalPrice; // 전체 금액
    private String address; // 배송 주소 (city + street + zipcode)
    private OrderStatus orderStatus; // 주문 상태
    private DeliveryStatus deliveryStatus; // 배송 상태

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class OrderItemDto {
        private String itemName; // 상품명
        private int orderPrice; // 개별 가격
        private int count; // 수량
        private int totalPrice; // 개별 상품 총합 (orderPrice * count)
    }
}
