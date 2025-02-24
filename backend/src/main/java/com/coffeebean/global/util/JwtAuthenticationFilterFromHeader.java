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

@Slf4j
// @Component
@RequiredArgsConstructor
public class JwtAuthenticationFilterFromHeader extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;

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
            // 1. 요청 헤더에서 JWT 추출
            String authorizationHeader = request.getHeader("Authorization");

            // 2. "Bearer " 접두어 제거
            String token = authorizationHeader.replace("Bearer ", "");
            log.info("JWT Token={}", token);

            // 3. JWT 검증 및 페이로드 조회
            Map<String, Object> claims = jwtUtil.getPayload(token);
            log.info("JWT Claims={}", claims);

            // 4. 필수 클레임 검증
            if (!claims.containsKey("email") || !claims.containsKey("id")) {
                throw new JwtException("유효하지 않은 토큰입니다.");
            }

            // 5. 사용자 정보 조회 (클레임에서 ID 추출)
            Long userId = ((Number) claims.get("id")).longValue();
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new DataNotFoundException("찾을 수 없는 회원입니다."));

            // 6. 인증 객체 생성 및 저장 ✅
            CustomUserDetails customUserDetails = new CustomUserDetails(
                    user.getId(),
                    user.getEmail()
            );
            log.info("CustomUserDetails={}", customUserDetails);

            Authentication authentication = new UsernamePasswordAuthenticationToken(
                    customUserDetails,
                    null,
                    Collections.emptyList()
            );
            SecurityContextHolder.getContext().setAuthentication(authentication);

        } catch (JwtException | DataNotFoundException e) {
            throw new SecurityException(e.getMessage());
        } catch (NullPointerException e) {
            throw new DataNotFoundException("토큰 없음, 로그인이 필요합니다!");
        }
        // 요청 필터링 체인 계속 진행
        filterChain.doFilter(request, response);
    }

    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getRequestURI();
        // ✅ 필터가 필요 없는 지점 설정
        return request.getRequestURI().startsWith("/api/v1");
    }
}
