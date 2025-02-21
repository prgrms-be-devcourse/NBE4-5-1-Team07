package com.coffeebean.domain.user.user.controller;

import com.coffeebean.domain.user.user.dto.EmailVerificationRequest;
import com.coffeebean.domain.user.user.dto.SignupReqBody;
import com.coffeebean.domain.user.user.enitity.User;
import com.coffeebean.domain.user.user.service.EmailVerificationService;
import com.coffeebean.domain.user.user.service.UserService;
import com.coffeebean.global.dto.RsData;
import com.coffeebean.global.exception.ServiceException;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final EmailVerificationService emailVerificationService;

    // 이메일 인증: 사용자가 이메일로 받은 인증 코드를 제출하여 이메일 인증을 완료
    @PostMapping("/request-verification")
    public RsData<Void> requestEmailVerification(@RequestParam("email") String email) {
        try {
            emailVerificationService.sendVerificationEmail(email);
            return new RsData<>("200-1", "인증번호가 이메일로 전송되었습니다.");
        } catch (Exception e) {
            throw new ServiceException("500-1", "이메일 발송 실패: " + e.getMessage());
        }
    }

    // 이메일 인증 확인
    @PostMapping("/verify-email")
    public RsData<Void> verifyEmail(@RequestBody @Valid EmailVerificationRequest emailVerificationRequest) {
        boolean result = emailVerificationService.verifyEmail(emailVerificationRequest.getEmail(), emailVerificationRequest.getCode());
        if (!result) {
            throw new ServiceException("400-2", "이메일 인증 실패");
        }
        return new RsData<>("200-2", "이메일 인증 성공");
    }

    // 회원가입
    @PostMapping("/signup")
    public RsData<User> signup(@RequestBody @Valid SignupReqBody signupRequest, BindingResult bindingResult) {
        // 유효성 검사
        if (bindingResult.hasErrors()) {
            StringBuilder errorMessage = new StringBuilder();
            bindingResult.getAllErrors().forEach(error -> errorMessage.append(error.getDefaultMessage()).append("\n"));
            throw new ServiceException("400-4", errorMessage.toString().trim());
        }

        // 이메일 중복 확인
        userService.findByEmail(signupRequest.getEmail())
                .ifPresent(user -> {
                    throw new ServiceException("409-1", "이미 사용중인 이메일입니다.");
                });

        // 회원가입 진행
        User user = userService.create(signupRequest);
        return new RsData<>("200-3", "회원가입이 완료되었습니다.", user);
    }



    // 관리자 로그인
    @PostMapping("/admin/login")
    public RsData<String> adminLogin(@RequestBody Map<String, String> credentials, HttpServletResponse response) {
        String username = credentials.get("username");
        String password = credentials.get("password");

        String token = userService.loginAdmin(username, password, response);

        return new RsData<>("200-1", "관리자 로그인 성공", token);
    }

    // 일반 회원 로그인
    @PostMapping("/login")
    public RsData<String> userLogin(@RequestBody Map<String, String> credentials, HttpServletResponse response) {
        String email = credentials.get("email");
        String password = credentials.get("password");

        Map<String, String> loginResult = userService.loginUser(email, password, response); // ✅ 사용자 이름과 토큰 반환
        String message = String.format("%s님 반갑습니다.", loginResult.get("userName"));
        String token = loginResult.get("token");

        return new RsData<>("200-2", message, token);
    }
}
