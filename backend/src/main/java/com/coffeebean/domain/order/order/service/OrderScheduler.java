package com.coffeebean.domain.order.order.service;

import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class OrderScheduler {

    private final OrderService orderService;

    // 배송 상태 변경 스케줄러
    @Scheduled(cron = "0 0 14 * * ?")// 매일 14시 실행
    public void scheduledDelivery() {
        orderService.updateDeliveryStatus();
    }
}
