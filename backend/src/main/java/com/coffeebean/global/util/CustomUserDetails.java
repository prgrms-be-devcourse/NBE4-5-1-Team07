package com.coffeebean.global.util;

import lombok.Getter;
import lombok.ToString;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;


@Getter
@ToString
public class CustomUserDetails implements UserDetails {
    private final Long userId;
    private final String name;
    private final String email;
    private final int totalPoints;

    public CustomUserDetails(Long userId, String name, String email, int totalPoints) {
        this.userId = userId;
        this.name = name;
        this.email = email;
        this.totalPoints = totalPoints;
    }

    // 필수 메서드 구현
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // 권한이 필요 없으므로 빈 리스트 반환
        return Collections.emptyList();
    }

    @Override
    public String getPassword() {
        return "";
    }

    @Override
    public String getUsername() {
        return name;
    }

}
