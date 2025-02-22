package com.coffeebean.global.security;

import com.coffeebean.domain.user.user.repository.UserRepository;
import com.coffeebean.global.app.AppConfig;

import java.util.Arrays;

import com.coffeebean.global.util.JwtAuthenticationFilter;
import com.coffeebean.global.util.JwtUtil;
import io.jsonwebtoken.Jwt;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.header.writers.frameoptions.XFrameOptionsHeaderWriter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;

    @Bean
    SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .authorizeHttpRequests((authorizeHttpRequests) ->
                        authorizeHttpRequests
                                // "/h2-console/**", "/api/v1/user/admin/login" 경로는 인증 없이 접근 가능
                                .requestMatchers("/h2-console/**", "/api/v1/user/admin/login").permitAll()
                                // "/api/v1/user/admin/**" 경로는 관리자만 접근 가능
                                .requestMatchers("/api/v1/user/admin/**").hasAuthority("admin")
                                .requestMatchers("/api/v1/users/mypage").authenticated() // 인증 필요
                                // 그 외의 모든 경로는 인증 없이 접근 가능
                                .anyRequest().permitAll()
                )
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .addFilterBefore(new JwtAuthenticationFilter(jwtUtil, userRepository), UsernamePasswordAuthenticationFilter.class)
                .headers((headers) -> headers
                        .addHeaderWriter(new XFrameOptionsHeaderWriter(
                                XFrameOptionsHeaderWriter.XFrameOptionsMode.SAMEORIGIN)))
                .csrf(csrf -> csrf.disable());

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }


    @Bean
    public UrlBasedCorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        // 허용할 오리진 설정
        configuration.setAllowedOrigins(Arrays.asList("https://cdpn.io", AppConfig.getSiteFrontUrl()));
        // 허용할 HTTP 메서드 설정
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE"));
        // 자격 증명 허용 설정
        configuration.setAllowCredentials(true);
        // 허용할 헤더 설정
        configuration.setAllowedHeaders(Arrays.asList("*"));
        // CORS 설정을 소스에 등록
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/api/**", configuration);
        source.registerCorsConfiguration("/h2-console/**", configuration);
        return source;
    }
}