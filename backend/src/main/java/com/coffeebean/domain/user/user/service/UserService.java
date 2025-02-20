package com.coffeebean.domain.user.user.service;

import com.coffeebean.domain.user.user.Address;
import com.coffeebean.domain.user.user.dto.SignupReqBody;
import com.coffeebean.domain.user.user.enitity.User;
import com.coffeebean.domain.user.user.repository.UserRepository;
import com.coffeebean.global.util.JwtUtil;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

	private static final String ADMIN_EMAIL = "admin";  // 관리자 이메일

	@Autowired
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
			.password(encodedPassword)
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

	public String login(String email, String password) {
		// 사용자 검증 로직 (DB에서 이메일 및 비밀번호 확인)
		User user = userRepository.findByEmail(email)
			.orElseThrow(() -> new IllegalArgumentException("회원 정보가 없습니다."));

		if (!passwordEncoder.matches(password, user.getPassword())) {
			throw new IllegalArgumentException("비밀번호가 일치하지 않습니다.");
		}

		if (!user.isVerified()) {
			throw new IllegalArgumentException("본인인증이 완료되지 않았습니다.");
		}

		return JwtUtil.createToken(email); // 이메일을 기준으로 토큰 발급
	}

	// 관리자 로그인
	public String loginAdmin(String email, String password) {
		if (ADMIN_EMAIL.equals(email) && "admin1234".equals(password)) {
			return JwtUtil.createToken(email); // 이메일을 기준으로 토큰 발급
		} else {
			throw new IllegalArgumentException("잘못된 아이디 혹은 비밀번호입니다.");
		}
	}

	public boolean verifyEmail(String email, String code) {
		return emailVerificationService.verifyEmail(email, code);
	}

	public User getUserByAuthToken(String token) {
		Map<String, Object> payload = JwtUtil.getPayload(token);
		if (payload == null) {
			throw new IllegalArgumentException("잘못된 인증 정보입니다.");
		}

		String email = (String)payload.get("email");

		// 이메일만 담겨있는 User 반환
		return User.builder()
			.email(email)
			.build();
	}
}
