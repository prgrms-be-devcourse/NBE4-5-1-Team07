package com.coffeebean.domain.user.user.mypage;

import com.coffeebean.domain.order.order.OrderDto;
import com.coffeebean.domain.order.order.service.OrderService;
import com.coffeebean.domain.review.review.service.ReviewService;
import com.coffeebean.domain.user.MyPageResponse;
import com.coffeebean.domain.user.pointHitstory.PointHistoryDto;
import com.coffeebean.domain.user.user.dto.UserInfoResponse;
import com.coffeebean.domain.user.user.enitity.User;
import com.coffeebean.domain.user.user.repository.UserRepository;
import com.coffeebean.domain.user.user.service.UserService;
import com.coffeebean.global.annotation.Login;
import com.coffeebean.global.dto.RsData;
import com.coffeebean.global.exception.DataNotFoundException;
import com.coffeebean.global.exception.ServiceException;
import com.coffeebean.global.util.CustomUserDetails;
import com.coffeebean.global.util.JwtUtil;
import lombok.AllArgsConstructor;
import lombok.extern.java.Log;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

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
        User user = repository.findByEmail(email).orElseThrow();

        // ✅ 사용자별 데이터 조회
        // 주문 내역 조회 (최근 주문 내역으로 3건만) -> 더보기 버튼
        List<OrderDto> recentOrders = orderService.getRecentOrdersByEmail(email);

        // 리뷰 내역 조회 (작성 가능한 리뷰 / 작성한 리뷰) -> 버튼

        return ResponseEntity.ok(new MyPageResponse(user.getName(),
                user.getTotalPoints(),
                recentOrders));
    }

    // 적립금 내역 조회 -> 전체 적립금 보여 주고 적립금 클릭하면 사용 내역으로 이동
    @GetMapping("/point/history")
    public ResponseEntity<List<PointHistoryDto>> showPointHistory(@Login CustomUserDetails userDetails) {
        List<PointHistoryDto> pointHistories = userService.getPointHistories(userDetails.getUserId());

        return ResponseEntity.ok(pointHistories);
    }

    // 내 정보 조회 - 회원인 경우 결제 페이지에서 이메일, 배송지 주소를 미리 입력하기 위해 사용
    @GetMapping("/my/info")
    public RsData<UserInfoResponse> myInfo(@Login CustomUserDetails userDetails) {
        User actor = userService.findByEmail(userDetails.getEmail())
            .orElseThrow(() -> new ServiceException("401-1", "인증 정보가 없습니다."));

        return new RsData<>(
            "200-1",
            "내 정보 조회가 완료되었습니다.",
            new UserInfoResponse(actor)
        );
    }
}
