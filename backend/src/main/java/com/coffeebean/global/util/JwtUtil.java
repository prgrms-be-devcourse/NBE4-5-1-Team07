package com.coffeebean.global.util;

import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;
import java.util.Date;

import javax.crypto.SecretKey;

@Component
public class JwtUtil {
    private static final String SECRET_KEY = "676e27c6-60e8-49c7-8c0f-adf8e7ecaa2e";

    public static String createToken(String username) {
        SecretKey secretKey = Keys.hmacShaKeyFor(SECRET_KEY.getBytes());
        Date issuedAt = new Date();
        Date expiration = new Date(issuedAt.getTime() + 1000L * 3600 * 24); // 1일 만료 설정

        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(issuedAt)
                .setExpiration(expiration)
                .signWith(secretKey)
                .compact();
    }

}
