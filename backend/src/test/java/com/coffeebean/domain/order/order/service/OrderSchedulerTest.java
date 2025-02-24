package com.coffeebean.domain.order.order.service;

import com.coffeebean.domain.order.order.DeliveryStatus;
import com.coffeebean.domain.order.order.OrderStatus;
import com.coffeebean.domain.order.order.entity.Order;
import com.coffeebean.domain.order.order.repository.OrderRepository;
import com.coffeebean.domain.user.user.service.MailService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import com.coffeebean.domain.user.user.Address;
import org.springframework.test.context.bean.override.mockito.MockitoSpyBean;

import java.time.Clock;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;

import static org.mockito.Mockito.*;
import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@ActiveProfiles("test")
@ExtendWith(MockitoExtension.class)
class OrderSchedulerTest {

    @MockitoSpyBean
    private OrderRepository orderRepository;

    @MockitoSpyBean
    private MailService mailService;

    @MockitoSpyBean
    private OrderService orderService;

    @Autowired
    private OrderScheduler orderScheduler;

    private static final String TEST_TIME = "Asia/Seoul"; // 한국 시간대

    @BeforeEach
    void setUp() {

        // 테스트용 주문 데이터
        Order order1 = Order.builder()
                .id(1L)
                .email("jmskkr@naver.com")
                .deliveryAddress(new Address("서울", "강남구", "12345"))
                .deliveryStatus(DeliveryStatus.READY)
                .orderStatus(OrderStatus.ORDER)
                .orderDate(LocalDateTime.now())
                .build();

        when(orderRepository.findByDeliveryStatusIn(List.of(DeliveryStatus.READY, DeliveryStatus.START)))
                .thenReturn(List.of(order1));

        doCallRealMethod().when(orderService).updateDeliveryStatus();
    }

    @Test
    @DisplayName("오후 2시 배송 상태 변경 및 메일 전송 확인")
    void changeDeliveryStatus() {

        // 현재 시간 14시로 설정
        Clock fixedClock = Clock.fixed(Instant.parse("2025-02-23T05:00:00Z"), ZoneId.of(TEST_TIME));
        LocalDateTime now = LocalDateTime.now(fixedClock);
        assertThat(now.getHour()).isEqualTo(14); // 14시 확인

        // 스케줄러 강제 실행
        orderScheduler.scheduledDelivery();

        // 배송상태 변경 검증
        verify(orderService, times(1)).updateDeliveryStatus();

        verify(orderRepository, times(1)).findByDeliveryStatusIn(anyList());

        // 메일 전송 검증
        verify(mailService, times(1)).sendMailToUser(anyString(), anyString(), anyString());
    }

}
