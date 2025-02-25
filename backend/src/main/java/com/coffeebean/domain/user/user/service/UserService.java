package com.coffeebean.domain.user.user.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import com.coffeebean.domain.user.user.Address;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.coffeebean.domain.user.pointHitstory.PointHistoryDto;
import com.coffeebean.domain.user.pointHitstory.entity.PointHistory;
import com.coffeebean.domain.user.user.dto.SignupReqBody;
import com.coffeebean.domain.user.user.dto.UserDto;
import com.coffeebean.domain.user.user.enitity.User;
import com.coffeebean.domain.user.user.repository.UserRepository;
import com.coffeebean.global.exception.DataNotFoundException;
import com.coffeebean.global.exception.ServiceException;
import com.coffeebean.global.util.JwtUtil;

import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

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
		JwtUtil.setJwtCookie(token, response); // 쿠키 저장

		return token; // 토큰 반환
	}

	// newName으로 이름 수정
	@Transactional
	public User modifyName(String email, String newName) {
		// 사용자 확인
		User user = userRepository.findByEmail(email)
				.orElseThrow(() -> new ServiceException("404-1", "사용자를 찾을 수 없습니다."));

		if (user.getName().equals(newName)) {
			throw new ServiceException("400-2", "새로운 이름이 기존 이름과 동일합니다.");
		}

		// 이름 변경
		user.setName(newName);
		return userRepository.save(user);
	}

	// newAddress로 주소 수정
	@Transactional
	public User modifyAddress(String email, String city, String street, String zipcode) {
		// 사용자 확인
		User user = userRepository.findByEmail(email)
				.orElseThrow(() -> new ServiceException("404-1", "사용자를 찾을 수 없습니다."));

		// 주소 수정
		Address newAddress = new Address(city, street, zipcode);
		user.setAddress(newAddress);

		return userRepository.save(user);
	}

	// 비밀번호 변경
	@Transactional
	public void modifyPassword(String email,String oldPassword, String newPassword) {
		User user = userRepository.findByEmail(email)
				.orElseThrow(() -> new ServiceException("404-1", "사용자를 찾을 수 없습니다."));

		if(!passwordEncoder.matches(oldPassword, user.getPassword())) {
			throw new ServiceException("400-2", "기존 비밀번호가 일치하지 않습니다.");
		}

		// 새 비밀번호 암호화 후 저장
		String encodedPassword = passwordEncoder.encode(newPassword);
		user.setPassword(encodedPassword);

		log.info("변경된 비밀번호: {}", encodedPassword);
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
		JwtUtil.setJwtCookie(token, response); // 쿠키 저장

		// 사용자 이름과 토큰을 반환
		Map<String, String> result = new HashMap<>();
		result.put("userName", user.getName());
		result.put("token", token);

		return result;
	}

	// 이메일을 통해 사용자 ID 가져오기
    public Long getUserIdFromEmail(String email) {
        return userRepository.findByEmail(email).orElseThrow(() ->
                        new DataNotFoundException("존재하지 않는 회원입니다."))
                .getId();
    }

	// 포인트 적립 내역 조회
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

	// 포인트가 충분한지 확인
	public boolean isPointAvailable(String email, int point) {
		Optional<User> opActor = userRepository.findByEmail(email);
		if (opActor.isEmpty()) {
			return false;
		}
		User actor = opActor.get();
		return actor.isTotalPointAvailable(point);
	}

	// 적립금을 사용하고 적립금 사용 내역을 저장
	@Transactional
	public void usePoint(User user, int point, String description) {
		if (!user.isTotalPointAvailable(point)) {
			throw new ServiceException("400-5", "적립금이 부족합니다.");
		}
		// 적립금 사용
		user.setTotalPoints(user.getTotalPoints() - point);
		// 적립금 사용 내역 추가
		user.getPointHistories().add(PointHistory.builder()
			.amount(-point)
			.description(description)
			.build());
    }

	// 유저 상세 정보 조회
	@Transactional
	public UserDto getDetails(String email) {
		User user = userRepository.findByEmail(email).orElseThrow(() -> new DataNotFoundException("사용자를 찾을 수 없습니다."));
		return new UserDto(user.getName(), user.getTotalPoints());
	}
}
