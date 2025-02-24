package com.coffeebean.domain.user.user.service;

import com.coffeebean.domain.user.user.dto.VerificationData;
import com.coffeebean.domain.user.user.enitity.User;
import com.coffeebean.domain.user.user.repository.UserRepository;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.Random;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailVerificationService {

    private final HttpSession httpSession;
    private final MailService mailService;

    private static final String SESSION_KEY = "email_verification";

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

    // 이메일 인증 요청 (세션에 인증 정보 저장)
    public void sendVerificationEmail(String email) throws Exception {
        // 인증 코드 생성
        String code = generateVerificationCode();

        // 인증 코드 전송
        mailService.sendSimpleMessage(email, code);

        httpSession.setAttribute(SESSION_KEY, new VerificationData(email.trim(), code, false));
        log.info("세션에 저장된 데이터 -> email={}, code={}", email, code);
    }

    // 인증 코드 확인 후 세션 상태 변경
    public boolean verifyEmail(String email, String inputCode) {
        VerificationData verificationData = (VerificationData) httpSession.getAttribute(SESSION_KEY);

        System.out.println("세션 이메일: [" + verificationData.getEmail() + "]");
        System.out.println("요청 이메일: [" + email + "]");

        if (verificationData == null || !verificationData.getEmail().trim().equals(email.trim())) {
            throw new IllegalArgumentException("이메일 인증 요청이 없습니다.");
        }

        if (!verificationData.getCode().equals(inputCode)) {
            throw new IllegalArgumentException("인증 코드가 일치하지 않습니다.");
        }

        verificationData.setVerified(true);
        httpSession.setAttribute(SESSION_KEY, verificationData);
        return true;
    }

    public boolean verifyEmailForGuest(String email, String inputCode) {
        VerificationData verificationData = (VerificationData) httpSession.getAttribute(SESSION_KEY);

        System.out.println("세션 이메일: [" + verificationData.getEmail() + "]");
        System.out.println("요청 이메일: [" + email + "]");

        if (!verificationData.getEmail().trim().replace("\"", "").equals(email.trim().replace("\"", ""))) {
            throw new IllegalArgumentException("이메일 인증 요청이 없습니다.");
        }

        if (!verificationData.getCode().equals(inputCode)) {
            throw new IllegalArgumentException("인증 코드가 일치하지 않습니다.");
        }

        verificationData.setVerified(true);
        httpSession.setAttribute(SESSION_KEY, verificationData);
        return true;
    }

    // 세션으로 이메일 인증 여부 확인
    public boolean isEmailVerified(String email) {
        VerificationData verificationData = (VerificationData) httpSession.getAttribute(SESSION_KEY);
        return verificationData != null && verificationData.getEmail().equals(email);
    }
}