package com.coffeebean.domain.order.order.service;

import com.coffeebean.domain.order.order.DeliveryStatus;
import com.coffeebean.domain.order.order.OrderStatus;
import com.coffeebean.domain.order.order.entity.Order;
import com.coffeebean.domain.order.order.repository.OrderRepository;
import com.coffeebean.domain.user.user.Address;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import java.time.LocalDateTime;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;

@SpringBootTest
class OrderServiceIntegrationTest {

    @Autowired
    private OrderService orderService;

    @Autowired
    private OrderRepository orderRepository;


    @BeforeEach
    void init() {
        orderRepository.deleteAll();

        Order order1 = Order.builder()
                .email("test@example.com")
                .deliveryAddress(new Address("서울", "강남구", "12345"))
                .deliveryStatus(DeliveryStatus.READY)
                .orderStatus(OrderStatus.ORDER)
                .orderDate(LocalDateTime.now())
                .build();
        orderRepository.save(order1);

        Order order2 = Order.builder()
                .email("test@example.com")
                .deliveryAddress(new Address("서울", "성동구", "12345"))
                .deliveryStatus(DeliveryStatus.DONE)
                .orderStatus(OrderStatus.COMPLETED)
                .orderDate(LocalDateTime.now())
                .build();
        orderRepository.save(order2);

        Order order3 = Order.builder()
                .email("another@example.com")
                .deliveryAddress(new Address("강원도", "속초군", "22222"))
                .deliveryStatus(DeliveryStatus.CANCELLED)
                .orderStatus(OrderStatus.CANCELED)
                .orderDate(LocalDateTime.now())
                .build();
        orderRepository.save(order3);

        Order order4 = Order.builder()
                .email("orderCancel@example.com")
                .deliveryAddress(new Address("서울시", "노원구", "123434"))
                .deliveryStatus(DeliveryStatus.READY)
                .orderStatus(OrderStatus.ORDER)
                .orderDate(LocalDateTime.now())
                .build();
        orderRepository.save(order4);
    }

    @Test
    void 주문전체조회_성공() {
        // given
        String email = "test@example.com";

        // when
        List<Order> result = orderRepository.findAllByEmail(email);

        // then
        assertThat(result).hasSize(2);
        assertThat(result).allMatch(order -> order.getEmail().equals(email));
    }

    @Test
    void 주문_상세조회_성공() {
        // given: 데이터 준비
        Order savedOrder = orderRepository.save(Order.builder()
                .email("test@example.com")
                .deliveryAddress(new Address("서울", "강남구", "12345"))
                .orderStatus(OrderStatus.ORDER)
                .deliveryStatus(DeliveryStatus.READY)
                .orderDate(LocalDateTime.now())
                .build());

        // when: 서비스 호출
        Order result = orderRepository.findById(savedOrder.getId()).orElseThrow();

        // then: 결과 검증
        assertThat(result).isNotNull();
        assertThat(result.getEmail()).isEqualTo("test@example.com");
        assertThat(result.getOrderStatus()).isEqualTo(OrderStatus.ORDER);
        assertThat(result.getDeliveryAddress().getCity()).isEqualTo("서울");
    }

    @Test
    void 주문_상세조회_실패() {
        // given: 존재하지 않는 ID 사용

        // when & then: 예외 발생 검증
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            orderService.getOrderDetailById(999L); // 존재하지 않는 ID
        });

        assertThat(exception.getMessage()).isEqualTo("해당 주문을 찾을 수 없습니다.");
    }

    @Test
    void 주문_취소_성공() {
        // given: 취소 가능한 주문 데이터 준비
        Order savedOrder = orderRepository.save(Order.builder()
                .email("cancel@example.com")
                .deliveryAddress(new Address("서울", "강남구", "12345"))
                .orderStatus(OrderStatus.ORDER)
                .deliveryStatus(DeliveryStatus.READY)
                .orderDate(LocalDateTime.now())
                .build());

        // when: 주문 취소 호출
        orderService.cancelOrder(savedOrder.getId());

        // then: 상태 변경 확인
        Order updatedOrder = orderRepository.findById(savedOrder.getId()).orElseThrow();
        assertThat(updatedOrder.getOrderStatus()).isEqualTo(OrderStatus.CANCELED);
        assertThat(updatedOrder.getDeliveryStatus()).isEqualTo(DeliveryStatus.CANCELLED);
    }

    @Test
    void 주문_취소_실패() {
        // given: 취소 불가능한 상태의 주문 데이터 준비
        Order savedOrder = orderRepository.save(Order.builder()
                .email("fail@example.com")
                .deliveryAddress(new Address("서울", "강남구", "12345"))
                .orderStatus(OrderStatus.ORDER)
                .deliveryStatus(DeliveryStatus.DONE) // 배송 완료 상태로 설정
                .orderDate(LocalDateTime.now())
                .build());

        // when & then: 예외 발생 검증
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            orderService.cancelOrder(savedOrder.getId());
        });

        assertThat(exception.getMessage()).isEqualTo("주문을 취소할 수 없는 상태입니다.");
    }

}
