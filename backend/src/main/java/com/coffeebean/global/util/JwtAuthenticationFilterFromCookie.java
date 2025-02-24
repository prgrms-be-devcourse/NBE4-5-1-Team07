package com.coffeebean.global.util;

import com.coffeebean.domain.user.user.enitity.User;
import com.coffeebean.domain.user.user.repository.UserRepository;
import com.coffeebean.global.exception.DataNotFoundException;

import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Arrays;
import java.util.Collections;
import java.util.Map;
import java.util.Optional;

@Slf4j
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilterFromCookie extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        // 리뷰, 마이 페이지만 필터 탈 수 있도록 설정
        if (shouldNotFilter(request)) {
            filterChain.doFilter(request, response);
            return;
        }

        try {
            // 1. 쿠키에서 JWT 추출
            Optional<String> token = jwtUtil.getJwtFromCookies(request);
            log.info("JWT Token={}", token.orElse("No Token Found"));

            if (token.isPresent()) {
                // 2. 페이로드 조회
                Map<String, Object> claims = jwtUtil.getPayload(token.get());
                log.info("JWT Claims={}", claims);

                // 3. 필수 클레임 검증
                if (!claims.containsKey("email")) {
                    throw new JwtException("유효하지 않은 토큰입니다.");
                }

                // 4. 사용자 정보 조회 (클레임 추출)
                Long userId = ((Number)claims.get("id")).longValue();
                String email = (String)claims.get("email");

                // 5. DB 조회 생략
                // 6. 인증 객체 생성 및 저장 ✅
                CustomUserDetails customUserDetails = new CustomUserDetails(userId, email);
                log.info("customUserDetails={}", customUserDetails);

                // 권한은 필요없어서 빈 리스트로 반환
                Authentication authentication = new UsernamePasswordAuthenticationToken(customUserDetails,
                        null, Collections.emptyList());
                log.info("authentication={}", authentication);

                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
            filterChain.doFilter(request, response);
        } catch (JwtException | DataNotFoundException e) {
            throw new SecurityException(e.getMessage());
        }
    }

    protected boolean shouldNotFilter(HttpServletRequest request) {
        // ✅ 필터가 필요 없는 지점 설정
        return request.getRequestURI().startsWith("/api/v1");
    }
}
