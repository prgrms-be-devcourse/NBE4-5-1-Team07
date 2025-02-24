package com.coffeebean.domain.user.pointHitstory;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class PointHistoryDto {
    private int amount; // 포인트 적립 및 차감 금액
    private String description; // 포인트 적립 및 차감 사유
    private LocalDateTime createDate; // 포인트 적립 및 차감 시각
}