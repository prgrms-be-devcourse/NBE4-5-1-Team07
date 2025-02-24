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
		// Admin 쿠키 검증
		String token = JwtUtil.getJwtFromCookies(request)
				.orElseThrow(() -> new ServiceException("401-1", "인증 정보가 없습니다."));
		Map<String, Object> payload = JwtUtil.getPayload(token);

		if (!payload.containsKey("role") || !payload.get("role").equals("ROLE_ADMIN")) {
			throw new ServiceException("403-1", "관리자 권한이 없습니다.");
		}
	}
}
