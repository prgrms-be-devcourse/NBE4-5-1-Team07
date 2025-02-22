package com.coffeebean.domain.review.review;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
// 작성 가능 리뷰
public class ReviewableOrderItemDto {

    private Long orderItemId; // 주문 아이템 ID
    private String itemName;  // 상품명
    private LocalDateTime orderDate; // 주문 날짜
}
