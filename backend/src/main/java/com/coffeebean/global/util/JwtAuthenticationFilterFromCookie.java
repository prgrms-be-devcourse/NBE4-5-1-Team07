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
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;
import java.util.Map;
import java.util.Optional;

@Slf4j
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilterFromCookie extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        // 특정 경로에서 필터를 적용하지 않도록 설정
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
                Long userId = ((Number) claims.get("id")).longValue();

                // 5. DB 조회
                User user = userRepository.findById(userId).orElseThrow(() -> new DataNotFoundException("찾을 수 없는 회원입니다."));

                // 6. 인증 객체 생성 및 저장 ✅
                CustomUserDetails customUserDetails = new CustomUserDetails(
                        user.getId(),
                        user.getEmail());
                log.info("customUserDetails={}", customUserDetails);

                // 권한은 필요없어서 빈 리스트로 반환
                Authentication authentication = new UsernamePasswordAuthenticationToken(customUserDetails,
                        null, Collections.emptyList());
                log.info("authentication={}", authentication);

                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        } catch (JwtException | DataNotFoundException e) {
            throw new SecurityException(e.getMessage());
        }
        filterChain.doFilter(request, response);
    }

    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getRequestURI();
        // ✅ 필터가 필요 없는 지점 설정 (예: /api/v1/user/login 같은 엔드포인트)
        return request.getRequestURI().startsWith("/api/v1");
    }
}
