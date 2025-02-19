package com.coffeebean.domain.user.user.controller;

import com.coffeebean.domain.user.user.dto.EmailVerificationRequest;
import com.coffeebean.domain.user.user.dto.SignupReqBody;
import com.coffeebean.domain.user.user.enitity.User;
import com.coffeebean.domain.user.user.service.EmailVerificationService;
import com.coffeebean.domain.user.user.service.UserService;
import jakarta.mail.MessagingException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    // 회원가입 처리
    @PostMapping("/signup")
    public ResponseEntity<String> signup(@RequestBody @Valid SignupReqBody signupRequest, BindingResult bindingResult) {
        // 유효성 검사
        if (bindingResult.hasErrors()) {
            StringBuilder errorMessage = new StringBuilder();
            bindingResult.getAllErrors().forEach(error -> errorMessage.append(error.getDefaultMessage()).append("\n"));
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorMessage.toString().trim());
        }

        // 이메일 중복 확인
        Optional<User> existingUser = userService.findByEmail(signupRequest.getEmail());
        if (existingUser.isPresent()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("이미 존재하는 이메일입니다.");
        }

        userService.create(signupRequest);

        return ResponseEntity.status(HttpStatus.OK).body("인증번호가 이메일로 전송되었습니다.");
    }

    // 이메일 인증: 사용자가 이메일로 받은 인증 코드를 제출하여 이메일 인증을 완료
    @PostMapping("/verify-email")
    public ResponseEntity<?> verifyEmail(@RequestBody EmailVerificationRequest emailVerificationRequest) {
        boolean result = userService.verifyEmail(emailVerificationRequest.getEmail(), emailVerificationRequest.getCode());
        return ResponseEntity.ok(result ? "이메일 인증 성공" : "이메일 인증 실패");
    }

}
