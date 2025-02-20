package com.coffeebean.domain.order.order.service;

import com.coffeebean.domain.order.order.DeliveryStatus;
import com.coffeebean.domain.order.order.OrderStatus;
import com.coffeebean.domain.order.order.entity.Order;
import com.coffeebean.domain.order.order.repository.OrderRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class OrderServiceUnitTest {


    @InjectMocks
    private OrderService orderService;

    @Mock
    private OrderRepository orderRepository;

    private Order mockOrder1 = null;
    private Order mockOrder2 = null;
    private Order mockOrder3 = null;

    @BeforeEach
    void setUp() {
        // Mock Order 객체 생성
        mockOrder1 = Order.builder()
                .email("test@example.com")
                .orderStatus(OrderStatus.ORDER)
                .deliveryStatus(DeliveryStatus.READY)
                .orderDate(LocalDateTime.now())
                .build();

        mockOrder2 = Order.builder()
                .email("test@example.com")
                .orderStatus(OrderStatus.ORDER)
                .deliveryStatus(DeliveryStatus.START)
                .orderDate(LocalDateTime.now())
                .build();

        mockOrder3 = Order.builder()
                .email("another@example.com")
                .orderStatus(OrderStatus.ORDER)
                .deliveryStatus(DeliveryStatus.DONE)
                .orderDate(LocalDateTime.now())
                .build();
    }

    @Test
    void 전체주문조회_성공() throws Exception {
        //given: Mock 데이터 설정
        when(orderRepository.findAllByEmail("test@example.com")).thenReturn(Arrays.asList(mockOrder1, mockOrder2));

        //when
        List<Order> result = orderRepository.findAllByEmail("test@example.com");

        //then
        assertThat(result).isNotNull(); // 리스트가 null이 아님
        assertThat(result.size()).isEqualTo(2); // 리스트 크기가 2인지 확인
        assertThat(result).extracting(Order::getEmail).containsOnly("test@example.com"); // 이메일 값이 "test@example.com" 만 포함

        verify(orderRepository, times(1)).findAllByEmail("test@example.com"); // Mock 객체의 메서드가 정확히 한 번 호출되었는지 확인
    }

    @Test
    void 전체주문조회_실패() throws Exception {
        // given: Mock 데이터 설정
        when(orderRepository.findAllByEmail("notfound@example.com")).thenReturn(Collections.emptyList()); // 빈 리스트 반환

        // when
        List<Order> result = orderRepository.findAllByEmail("notfound@example.com");

        // then
        assertThat(result).isNotNull(); // 리스트가 null이 아님 (비어있을 뿐)
        assertThat(result).isEmpty(); // 리스트가 비어 있는지 확인

        verify(orderRepository, times(1)).findAllByEmail("notfound@example.com"); // Mock 객체의 메서드가 정확히 한 번 호출되었는지 확인
    }


    @Test
    void 단건주문조회_성공() throws Exception {
        //given
        Long orderId = 1L;
        Order mockOrder = Order.builder()
                .id(orderId)
                .email("test@example.com")
                .orderDate(LocalDateTime.now())
                .build();
        when(orderRepository.findById(orderId)).thenReturn(Optional.of(mockOrder));

        //when
        Order result = orderRepository.findById(orderId).get();

        //then
        assertThat(result).isNotNull(); // 주문이 null이 아님
        assertThat(result.getId()).isEqualTo(orderId); // 주문 ID가 일치함
        assertThat(result.getEmail()).isEqualTo("test@example.com"); // 이메일이 일치함
        verify(orderRepository, times(1)).findById(orderId); // findById 메서드가 1회 호출됨
    }

    @Test
    void 단건주문조회_실패_주문없음() {
        //given
        Long orderId = 1L;
        when(orderRepository.findById(orderId)).thenReturn(Optional.empty());

        //when & then
        assertThatThrownBy(() -> orderService.getOrderDetailById(orderId))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("해당 주문을 찾을 수 없습니다.");
        verify(orderRepository, times(1)).findById(orderId);
    }

    @Test
    void 주문취소_성공() throws Exception {
        // given: 배송 상태 - READY
        Order mockOrder = Order.builder()
                .id(1L)
                .email("test@example.com")
                .deliveryStatus(DeliveryStatus.READY)
                .orderStatus(OrderStatus.ORDER)
                .orderDate(LocalDateTime.now())
                .build();
        when(orderRepository.findById(1L)).thenReturn(Optional.of(mockOrder));

        // when
        orderService.cancelOrder(1L);

        // then
        assertThat(mockOrder.getOrderStatus()).isEqualTo(OrderStatus.CANCELED); // 주문 상태가 CANCELED로 변경됨
        assertThat(mockOrder.getDeliveryStatus()).isEqualTo(DeliveryStatus.CANCELLED); // 배송 상태가 CANCELLED로 변경됨
        verify(orderRepository, times(1)).findById(1L); // findById 호출 확인
    }

    @Test
    void 주문취소_실패_배송중() throws Exception {
        // given: 배송 상태 - START (취소 불가능)
        Order mockOrder = Order.builder()
                .id(2L)
                .email("test@example.com")
                .deliveryStatus(DeliveryStatus.START)
                .orderStatus(OrderStatus.ORDER)
                .orderDate(LocalDateTime.now())
                .build();
        when(orderRepository.findById(2L)).thenReturn(Optional.of(mockOrder));

        // when & then
        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> orderService.cancelOrder(2L) // 취소 시도
        );
        assertThat(exception.getMessage()).isEqualTo("주문을 취소할 수 없는 상태입니다."); // 예외 메시지 검증
        verify(orderRepository, times(1)).findById(2L); // findById 호출 확인
    }

    @Test
    void 주문취소_실패_주문완료() throws Exception {
        // given: 배송 상태 - DONE (취소 불가능)
        Order mockOrder = Order.builder()
                .id(3L)
                .email("another@example.com")
                .deliveryStatus(DeliveryStatus.DONE)
                .orderStatus(OrderStatus.ORDER)
                .orderDate(LocalDateTime.now())
                .build();
        when(orderRepository.findById(3L)).thenReturn(Optional.of(mockOrder));

        // when & then
        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> orderService.cancelOrder(3L) // 취소 시도
        );
        assertThat(exception.getMessage()).isEqualTo("주문을 취소할 수 없는 상태입니다."); // 예외 메시지 검증
        verify(orderRepository, times(1)).findById(3L); // findById 호출 확인
    }
}

