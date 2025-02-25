package com.coffeebean.domain.user.user.service;

import com.coffeebean.domain.user.pointHitstory.PointHistoryDto;
import com.coffeebean.domain.user.pointHitstory.entity.PointHistory;
import com.coffeebean.domain.user.user.dto.SignupReqBody;
import com.coffeebean.domain.user.user.dto.UserDto;
import com.coffeebean.domain.user.user.enitity.User;
import com.coffeebean.domain.user.user.repository.UserRepository;
import com.coffeebean.global.exception.ServiceException;
import com.coffeebean.global.exception.DataNotFoundException;
import com.coffeebean.global.util.JwtUtil;

import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;

import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserService {

	// ✅ 관리자 계정 정보
	private static final String ADMIN_USERNAME = "admin";
	private static final String ADMIN_PASSWORD = "admin1234";
	private static final String ADMIN_ROLE = "ROLE_ADMIN";

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

	// 관리자 로그인
	public String loginAdmin(String username, String password, HttpServletResponse response) {
		if (!ADMIN_USERNAME.equals(username) || !ADMIN_PASSWORD.equals(password)) {
			throw new ServiceException("401-1", "잘못된 관리자 아이디 또는 비밀번호입니다.");
		}

		// JWT 생성 (관리자)
		Map<String, Object> claims = new HashMap<>();
		claims.put("email", ADMIN_USERNAME);
		claims.put("role", ADMIN_ROLE);

		String token = JwtUtil.createToken(claims);
		JwtUtil.setJwtCookie(token, response); // ✅ 쿠키 저장

		return token; // ✅ 토큰 반환
	}

	// 일반 사용자 로그인
	public Map<String, String> loginUser(String email, String password, HttpServletResponse response) {
		User user = userRepository.findByEmail(email)
			.orElseThrow(() -> new ServiceException("404-1", "존재하지 않는 이메일입니다."));

		if (!passwordEncoder.matches(password, user.getPassword())) {
			throw new ServiceException("401-2", "비밀번호가 올바르지 않습니다.");
		}

		// JWT 생성 (일반 사용자)
		Map<String, Object> claims = new HashMap<>();
		claims.put("email", user.getEmail());
		claims.put("id", user.getId());

		String token = JwtUtil.createToken(claims);
		JwtUtil.setJwtCookie(token, response); // ✅ 쿠키 저장

		// ✅ 사용자 이름과 토큰을 반환
		Map<String, String> result = new HashMap<>();
		result.put("userName", user.getName());
		result.put("token", token);

		return result;
	}

	public User getUserByAuthToken(String token) {
		Map<String, Object> payload = JwtUtil.getPayload(token);
		if (payload == null) {
			throw new IllegalArgumentException("잘못된 인증 정보입니다.");
		}

		String email = (String)payload.get("email"); // email

		// 이메일만 담겨있는 User 반환
		return User.builder()
			.email(email)
			.build();
	}

	public boolean isAdminByAuthToken(String token) {
		Map<String, Object> payload = JwtUtil.getPayload(token);
		if (payload == null) {
			throw new IllegalArgumentException("잘못된 인증 정보입니다.");
		}

		if (payload.keySet().contains("role")) {
			String role = (String)payload.get("role");
			if (role.equals(ADMIN_ROLE)) {
				return true;
			}
		}
		return false;
	}

    public Long getUserIdFromEmail(String email) {
        return userRepository.findByEmail(email).orElseThrow(() ->
                        new DataNotFoundException("존재하지 않는 회원입니다."))
                .getId();
    }

    @Transactional(readOnly = true)
    public List<PointHistoryDto> getPointHistories(Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() ->
                new DataNotFoundException("사용자를 찾을 수 없습니다."));
        log.info("user={}", user);

        User userWithHistories = userRepository.findByIdWithPointHistories(userId).orElse(user);
        List<PointHistory> pointHistories = userWithHistories.getPointHistories();
        log.info("pointHistories={}", pointHistories);

        if (userWithHistories.getPointHistories().isEmpty()) {
            throw new DataNotFoundException("포인트 적립 내역이 없습니다.");
        }

        return pointHistories.stream().map(pointHistory -> new PointHistoryDto(
                pointHistory.getAmount(),
                pointHistory.getDescription(),
                pointHistory.getCreateDate())).toList();
    }

	@Transactional
	public UserDto getDetails(String email) {
		User user = userRepository.findByEmail(email).orElseThrow(() -> new DataNotFoundException("사용자를 찾을 수 없습니다."));
		return new UserDto(user.getName(), user.getTotalPoints());
	}
}
