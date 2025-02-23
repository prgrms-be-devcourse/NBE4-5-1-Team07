package com.coffeebean.domain.user.user.mypage;

import com.coffeebean.domain.order.order.OrderDto;
import com.coffeebean.domain.order.order.service.OrderService;
import com.coffeebean.domain.review.review.service.ReviewService;
import com.coffeebean.domain.user.MyPageResponse;
import com.coffeebean.domain.user.pointHitstory.PointHistoryDto;
import com.coffeebean.domain.user.user.enitity.User;
import com.coffeebean.domain.user.user.repository.UserRepository;
import com.coffeebean.domain.user.user.service.UserService;
import com.coffeebean.global.annotation.Login;
import com.coffeebean.global.exception.DataNotFoundException;
import com.coffeebean.global.exception.ServiceException;
import com.coffeebean.global.util.CustomUserDetails;
import com.coffeebean.global.util.JwtUtil;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@AllArgsConstructor
@RequestMapping("/api")
public class MyPageController {

    private UserService userService;
    private OrderService orderService;
    private UserRepository repository;

    // 마이 페이지 접근
    @GetMapping("/my/home")
    // @Login CustomUserDetails userDetails,
    public ResponseEntity<MyPageResponse> myPage(@Login CustomUserDetails userDetails) {
        // 사용자 정보 추출
        String email = userDetails.getEmail();

        // ✅ 사용자별 데이터 조회
        // 주문 내역 조회 (최근 주문 내역으로 3건만) -> 더보기 버튼
        List<OrderDto> recentOrders = orderService.getRecentOrdersByEmail(email);

        // 리뷰 내역 조회 (작성 가능한 리뷰 / 작성한 리뷰) -> 버튼

        return ResponseEntity.ok(new MyPageResponse(userDetails.getName(),
                userDetails.getTotalPoints(),
                recentOrders));
    }

    // 적립금 내역 조회 -> 전체 적립금 보여 주고 적립금 클릭하면 사용 내역으로 이동
    @GetMapping("/point/history")
    public ResponseEntity<List<PointHistoryDto>> showPointHistory(@Login CustomUserDetails userDetails) {
        List<PointHistoryDto> pointHistories = userService.getPointHistories(userDetails.getUserId());

        return ResponseEntity.ok(pointHistories);
    }
}
