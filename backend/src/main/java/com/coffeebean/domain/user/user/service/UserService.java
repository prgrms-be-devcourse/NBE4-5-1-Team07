package com.coffeebean.domain.user.user.service;

import com.coffeebean.domain.user.user.Address;
import com.coffeebean.domain.user.user.dto.SignupReqBody;
import com.coffeebean.domain.user.user.enitity.User;
import com.coffeebean.domain.user.user.repository.UserRepository;
import jakarta.transaction.Transactional;
import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Base64;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    // user 저장/생성
    @Transactional
    public void create(SignupReqBody signupReqBody) {
        // 비밀번호 암호화
        String encodedPassword = passwordEncoder.encode(signupReqBody.getPassword());

        // Address 객체 생성
        Address address = signupReqBody.toAddress();

        // User 객체 빌드
        User user = User.builder()
                .email(signupReqBody.getEmail())
                .password(encodedPassword)
                .name(signupReqBody.getName())
                .address(address)
                .build();

        userRepository.save(user);
    }


    // 이메일로 유저가 존재하는지 확인
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }
}
