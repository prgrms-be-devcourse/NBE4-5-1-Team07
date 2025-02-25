package com.coffeebean.domain.order.order.dto;

import com.coffeebean.domain.order.order.DeliveryStatus;
import com.coffeebean.domain.order.order.OrderStatus;
import com.coffeebean.domain.order.order.entity.Order;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@AllArgsConstructor
public class OrderListDto {

    private Long id;
    private String email;
    private OrderStatus orderStatus;
    private DeliveryStatus deliveryStatus;
    private LocalDateTime orderDate;
    private List<OrderItemsDto> orderItems;

    public OrderListDto(Order order) {
        this.id = order.getId();
        this.email = order.getEmail();
        this.orderStatus = order.getOrderStatus();
        this.deliveryStatus = order.getDeliveryStatus();
        this.orderDate = order.getOrderDate();
        this.orderItems = order.getOrderItems().stream()
                .map(OrderItemsDto::new)
                .collect(Collectors.toList());
    }

}
