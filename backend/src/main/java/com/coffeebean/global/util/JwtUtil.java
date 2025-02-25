package com.coffeebean.global.util;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.util.Arrays;
import java.util.Date;
import java.util.Map;
import java.util.Optional;

import javax.crypto.SecretKey;

@Slf4j
@Component
public class JwtUtil {
    private static final String SECRET_KEY = "676e27c6-60e8-49c7-8c0f-adf8e7ecaa2e";
    private static final long EXPIRATION_TIME = 1000L * 3600 * 24; // 1일 (24시간)

    // JWT 생성 (추가적인 Claims 포함 가능)
    public static String createToken(Map<String, Object> claims) {
        SecretKey secretKey = Keys.hmacShaKeyFor(SECRET_KEY.getBytes());
        Date issuedAt = new Date();
        Date expiration = new Date(issuedAt.getTime() + EXPIRATION_TIME);

        return Jwts.builder()
                .setClaims(claims) // 추가적인 claims 포함
                .setIssuedAt(issuedAt)
                .setExpiration(expiration)
                .signWith(secretKey, SignatureAlgorithm.HS256)
                .compact();
    }

    // JWT 유효성 검사
    public static boolean isValidToken(String token) {
        try {
            SecretKey secretKey = Keys.hmacShaKeyFor(SECRET_KEY.getBytes());

            Jwts.parser()
                    .verifyWith(secretKey)
                    .build()
                    .parse(token);

            return true;
        } catch (Exception e) {
            return false;
        }
    }

    // JWT 페이로드 추출
    public static Map<String, Object> getPayload(String token) {
        SecretKey secretKey = Keys.hmacShaKeyFor(SECRET_KEY.getBytes());

        return (Map<String, Object>) Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parse(token)
                .getPayload();
    }

    // JWT를 쿠키에 저장
    public static void setJwtCookie(String jwt, HttpServletResponse response) {
        ResponseCookie cookie = ResponseCookie.from("token", jwt)
                .httpOnly(true)  // 클라이언트에서 JS로 접근 불가
                .path("/")       // 모든 경로에서 사용 가능
                .sameSite("None") // SameSite 설정 (CSRF 방어)
                .maxAge(Duration.ofDays(1))
                .secure(true)
                .build();

        response.addHeader("Set-Cookie", cookie.toString());
    }

    // 쿠키에서 JWT 추출
    public static Optional<String> getJwtFromCookies(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();

        if (cookies == null || cookies.length == 0) { // 쿠키가 없을 경우
            throw new SecurityException("로그인이 필요합니다: 요청에 쿠키가 없습니다.");
        }

        Arrays.stream(cookies)
                .forEach(cookie -> log.info("Cookie Name: {}, Value: {}", cookie.getName(), cookie.getValue()));

        return Arrays.stream(cookies)
                .filter(cookie -> "token".equals(cookie.getName()))
                .map(Cookie::getValue)
                .findFirst();
    }
}
