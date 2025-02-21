package com.coffeebean.domain.user.user.service;

import com.coffeebean.domain.user.user.Address;
import com.coffeebean.domain.user.user.dto.SignupReqBody;
import com.coffeebean.domain.user.user.enitity.User;
import com.coffeebean.domain.user.user.repository.UserRepository;
import com.coffeebean.global.util.JwtUtil;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
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

	// 이메일 인증이 완료된 경우 회원가입 허용
	public User create(@Valid SignupReqBody signupRequest) {
		if (!emailVerificationService.isEmailVerified(signupRequest.getEmail())) {
			throw new IllegalArgumentException("이메일 인증이 완료되지 않았습니다.");
		}

		// 비밀번호 암호화
		String encodedPassword = passwordEncoder.encode(signupRequest.getPassword());

		// User 엔티티 생성
		User user = User.builder()
			.email(signupRequest.getEmail())
			.password(encodedPassword)
			.name(signupRequest.getName())
			.address(signupRequest.toAddress())
			.build();

		// User 엔티티를 DB에 저장
		return userRepository.save(user);
	}

	public User getUserByAuthToken(String token) {
		Map<String, Object> payload = JwtUtil.getPayload(token);
		if (payload == null) {
			throw new IllegalArgumentException("잘못된 인증 정보입니다.");
		}

		String email = (String)payload.get("sub"); // email

		// 이메일만 담겨있는 User 반환
		return User.builder()
				.email(email)
				.build();
	}

//	public String login(String email, String password) {
//		// 사용자 검증 로직 (DB에서 이메일 및 비밀번호 확인)
//		User user = userRepository.findByEmail(email)
//			.orElseThrow(() -> new IllegalArgumentException("회원 정보가 없습니다."));
//
//		if (!passwordEncoder.matches(password, user.getPassword())) {
//			throw new IllegalArgumentException("비밀번호가 일치하지 않습니다.");
//		}
//
//		return JwtUtil.createToken(email); // 이메일을 기준으로 토큰 발급
//	}
//
//	// 관리자 로그인
//	public String loginAdmin(String email, String password) {
//		if (ADMIN_EMAIL.equals(email) && "admin1234".equals(password)) {
//			return JwtUtil.createToken(email); // 이메일을 기준으로 토큰 발급
//		} else {
//			throw new IllegalArgumentException("잘못된 아이디 혹은 비밀번호입니다.");
//		}
//	}
}
