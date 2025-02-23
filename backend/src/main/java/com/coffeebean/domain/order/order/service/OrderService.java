package com.coffeebean.domain.order.order.service;

import java.rmi.UnexpectedException;
import java.util.List;

import com.coffeebean.domain.order.order.OrderDetailDto;
import com.coffeebean.domain.order.order.OrderDto;
import com.coffeebean.domain.order.orderItem.entity.OrderItem;
import com.coffeebean.global.email.MailService;
import org.aspectj.weaver.ast.Or;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.coffeebean.domain.order.order.DeliveryStatus;
import com.coffeebean.domain.order.order.OrderStatus;
import com.coffeebean.domain.order.order.entity.Order;
import com.coffeebean.domain.order.order.repository.OrderRepository;
import com.coffeebean.domain.user.user.Address;
import com.coffeebean.global.exception.ServiceException;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
@Transactional(readOnly = true)
public class OrderService {

    private final OrderRepository orderRepository;
    private final MailService mailService;
    private final OrderService self;

    @Transactional
    public Order createOrder(String email, String city, String street, String zipcode) {
        Order order = Order.builder()
                .email(email)
                .deliveryAddress(new Address(city, street, zipcode))
                .deliveryStatus(DeliveryStatus.READY)
                .orderStatus(OrderStatus.ORDER)
                .build();

        orderRepository.save(order);
        orderRepository.flush();
        return orderRepository.findById(order.getId())
                .orElseThrow(() -> new ServiceException("500-1", "주문이 등록되지 않았습니다."));
    }

    /**
     * 이메일로 주문 리스트 조회
     *
     * @param email 고객 이메일
     * @return List<OrderDto> 주문 DTO 리스트
     */
    public List<OrderDto> getOrdersByEmail(String email) {
        // 이메일로 주문 엔티티 리스트 조회
        List<Order> orders = orderRepository.findAllByEmail(email);

        // 주문 엔티티를 OrderDto로 변환하여 반환
        return orders.stream()
                .map(order -> {
                    // 주문 상품명이 없을 경우 기본값 설정
                    if (order.getOrderItems().isEmpty()) {
                        throw new IllegalStateException("주문에 상품이 없습니다.");
                    }

                    String itemName = order.getOrderItems().get(0).getItem().getName();

                    // OrderDto 생성 및 반환
                    return new OrderDto(
                            order.getId(), // 주문 ID
                            order.getOrderDate(), // 주문 시간
                            itemName, // 대표 상품명 (첫 번째 상품 또는 기본값)
                            order.getOrderStatus(), // 주문 상태
                            order.getDeliveryStatus(), // 배송 상태
                            order.getOrderItems().stream()
                                    .mapToInt(OrderItem::getTotalPrice) // 각 상품의 총 가격 합산
                                    .sum() // 전체 금액 계산
                    );
                })
                .toList();
    }

    // 주문 상세 조회 (단건)
    public Order getOrderDetail(String email) {
        return orderRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("해당 주문을 찾을 수 없습니다."));
    }

    // 주문 상세 조회 (단건)
    public OrderDetailDto getOrderDetailById(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("해당 주문을 찾을 수 없습니다."));

        // 주문 항목(OrderItem)을 DTO로 변환
        List<OrderDetailDto.OrderItemDto> orderItemDtos = order.getOrderItems().stream()
                .map(orderItem -> new OrderDetailDto.OrderItemDto(
                        orderItem.getItem().getName(), // 상품명
                        orderItem.getOrderPrice(),    // 개별 가격
                        orderItem.getCount(),         // 수량
                        orderItem.getTotalPrice()     // 개별 상품 총합
                ))
                .toList();

        // 배송 주소 조합 (city + street + zipcode)
        String address = String.format("%s %s %s",
                order.getDeliveryAddress().getCity(),
                order.getDeliveryAddress().getStreet(),
                order.getDeliveryAddress().getZipcode());

        // 전체 금액 계산
        int totalPrice = orderItemDtos.stream()
                .mapToInt(OrderDetailDto.OrderItemDto::getTotalPrice)
                .sum();

        return new OrderDetailDto(
                order.getId(),
                order.getOrderDate(),
                orderItemDtos,
                totalPrice,
                address,
                order.getOrderStatus(),
                order.getDeliveryStatus()
        );
    }

    // 3. 주문 취소
    @Transactional
    public void cancelOrder(Long orderId) {
        Order order = orderRepository.findById(orderId).get();
        order.cancel();
    }

    // 배송 상태 변경 스케줄러
    @Scheduled(cron = "0 0 14 * * ?")// 매일 14시 실행
    public void scheduledDelivery() {
        self.updateDeliveryStatus();
    }

    // 배송 상태 업데이트 트랜잭션처리
    @Transactional
    public void updateDeliveryStatus() {
        // 배송준비와 배송 중인 것만 처리
        List<Order> orders = orderRepository.findByDeliveryStatusIn(List.of(DeliveryStatus.READY, DeliveryStatus.START));

        for (Order order : orders) {
            try {
                // ORDER일 경우만 변경
                if (order.getOrderStatus() != OrderStatus.ORDER) {
                    continue;
                }

                // 배송 준비 -> 배송 중, 배송중 메일 발송
                if (order.getDeliveryStatus() == DeliveryStatus.READY) {
                    order.setDeliveryStatus(DeliveryStatus.START);
                    mailService.sendMail(order.getEmail(),
                            "배송이 시작되었습니다.",
                            "주문번호[%d]의 상품의 배송이 시작되었습니다.".formatted(order.getId())
                    );
                } else if (order.getDeliveryStatus() == DeliveryStatus.START) {
                    // 배송중 -> 배송 완료, 배송 완료 메일 발송
                    order.setDeliveryStatus(DeliveryStatus.DONE);
                    mailService.sendMail(
                            order.getEmail(),
                            "배송이 완료되었습니다.",
                            "주문번호[%d]의 상품의 배송이 완료되었습니다.".formatted(order.getId())
                    );
                }
            } catch (Exception e) {
                continue; // 프로세스 중단 방지
            }
        }
    }

}
