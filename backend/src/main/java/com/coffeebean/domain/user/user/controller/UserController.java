package com.coffeebean.domain.user.user.controller;

import com.coffeebean.domain.user.user.dto.SignupReqBody;
import com.coffeebean.domain.user.user.enitity.User;
import com.coffeebean.domain.user.user.service.UserService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
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

    // 회원가입
    @PostMapping("signup")
    public ResponseEntity<String> signup(@RequestBody @Valid SignupReqBody signupReqBody, BindingResult bindingResult) {
        // 입력 값 유효성 검사
        if (bindingResult.hasErrors()) {
            StringBuilder errorMessage = new StringBuilder();
            bindingResult.getAllErrors().forEach(error -> errorMessage.append(error.getDefaultMessage()).append("\n"));
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorMessage.toString().trim());
        }

        // 이메일 중복 확인
        userService.findByEmail(signupReqBody.getEmail())
                .ifPresent(user -> {
                    throw new IllegalStateException("이미 존재하는 회원입니다.");
                });

        // user 저장
        userService.create(signupReqBody);

        // 회원가입 성공
        return ResponseEntity.status(HttpStatus.CREATED).body("회원가입이 완료되었습니다.");
    }


}
