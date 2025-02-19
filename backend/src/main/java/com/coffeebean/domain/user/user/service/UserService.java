package com.coffeebean.domain.user.user.service;

import com.coffeebean.domain.user.user.Address;
import com.coffeebean.domain.user.user.dto.SignupReqBody;
import com.coffeebean.domain.user.user.enitity.User;
import com.coffeebean.domain.user.user.repository.UserRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailVerificationService emailVerificationService;

    // 이메일로 유저가 존재하는지 확인
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    // 유저 정보 저장 및 인즏
    public User create(@Valid SignupReqBody signupRequest) {
        // 비밀번호 암호화
        String encodedPassword = passwordEncoder.encode(signupRequest.getPassword());

        // SignupReqBody를 User 엔티티로 변환
        Address address = signupRequest.toAddress();

        // User 엔티티 생성
        User user = User.builder()
                .email(signupRequest.getEmail())
                .password(signupRequest.getPassword())
                .name(signupRequest.getName())
                .address(address)
                .verified(false)  // 기본 값 설정
                .build();

        // User 엔티티를 DB에 저장
        userRepository.save(user);
        try {
            emailVerificationService.sendVerificationEmail(user);
        } catch (Exception e) {
            throw new RuntimeException("이메일 발송 실패: " + e.getMessage());
        }
        return user;
    }

    public boolean verifyEmail(String email, String code) {
        return emailVerificationService.verifyEmail(email, code);
    }
}
