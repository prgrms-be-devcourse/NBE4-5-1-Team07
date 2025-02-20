package com.coffeebean.domain.user.user.service;

import com.coffeebean.domain.user.user.enitity.User;
import com.coffeebean.domain.user.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class EmailVerificationService {

    private final UserRepository  userRepository;
    private final MailService mailService;

    // 8자리 랜덤 인증 코드 생성 (영문 대소문자와 숫자)
    public String generateVerificationCode() {
        Random random = new Random();
        StringBuilder key = new StringBuilder();
        for (int i = 0; i < 8; i++) {
            int index = random.nextInt(3);
            switch (index) {
                case 0 -> key.append((char)(random.nextInt(26) + 97)); // 소문자
                case 1 -> key.append((char)(random.nextInt(26) + 65)); // 대문자
                case 2 -> key.append(random.nextInt(10));              // 숫자
            }
        }
        return key.toString();
    }

    // 회원가입 후, 이메일 인증 코드 전송 및 DB 업데이트
    public void sendVerificationEmail(User user) throws Exception {
        String code = generateVerificationCode();
        user.setVerificationCode(code);
        user.setVerified(false);
        userRepository.save(user);
        // 실제 이메일 발송 (메일 전송 실패 시 예외 발생)
        mailService.sendSimpleMessage(user.getEmail(), code);
    }

    // 사용자가 제출한 인증 코드를 검증하여, 일치하면 verified 상태 업데이트
    public boolean verifyEmail(String email, String inputCode) {
        Optional<User> optionalMember =userRepository.findByEmail(email);
        if (optionalMember.isEmpty()) {
            throw new IllegalArgumentException("회원 정보가 없습니다.");
        }
        User user = optionalMember.get();
        if (user.getVerificationCode() != null && user.getVerificationCode().equals(inputCode)) {
            user.setVerified(true);
            user.setVerificationCode(null); // 인증 후 코드 제거
            userRepository.save(user);
            return true;
        } else {
            throw new IllegalArgumentException("인증 코드가 일치하지 않습니다.");
        }
    }
}