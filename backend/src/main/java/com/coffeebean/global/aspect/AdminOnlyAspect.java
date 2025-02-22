package com.coffeebean.global.aspect;

import java.util.Map;

import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.stereotype.Component;

import com.coffeebean.global.exception.ServiceException;
import com.coffeebean.global.util.JwtUtil;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Aspect
@Component
public class AdminOnlyAspect {

	private final HttpServletRequest request;

	// AdminOnly 애너테이션이 붙은 메서드를 가로채는 Pointcut
	@Pointcut("@annotation(com.coffeebean.global.security.annotations.AdminOnly)")
	public void checkAdminPointcut() {
	}

	@Before("checkAdminPointcut()")
	public void before() {
		// Authorization 헤더 검증
		String authHeader = request.getHeader("Authorization");
		if (authHeader == null || !authHeader.startsWith("Bearer ")) {
			throw new ServiceException("401-1", "인증 정보가 없거나 잘못되었습니다.");
		}

		Map<String, Object> payload;
		try {
			payload = JwtUtil.getPayload(authHeader.substring("Bearer ".length()));
		} catch (Exception e) {
			throw new ServiceException("401-2", "유효하지 않은 인증 토큰입니다.");
		}

		// 토큰에 관리자 권한이 있는지 검증
		if (!payload.containsKey("role") || !payload.get("role").equals("ROLE_ADMIN")) {
			throw new ServiceException("403-1", "접근 권한이 없습니다.");
		}
	}
}
