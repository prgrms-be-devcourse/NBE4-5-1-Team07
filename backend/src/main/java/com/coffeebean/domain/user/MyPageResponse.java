package com.coffeebean.domain.user;

import com.coffeebean.domain.order.order.OrderDto;
import com.coffeebean.domain.user.user.enitity.User;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@Getter
@AllArgsConstructor
public class MyPageResponse {
    private final String userName;
    private final int totalPoints;
    private final List<OrderDto> orders; // 기존 OrderDto 재사용

    public static MyPageResponse from(User user, List<OrderDto> orders) {
        return new MyPageResponse(
                user.getName(),
                user.getTotalPoints(),
                orders
        );
    }
}
