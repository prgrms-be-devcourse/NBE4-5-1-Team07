package com.coffeebean.domain.user.user.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor  // 기본 생성자 추가
public class VerificationData {
    private String email;
    private String code;
    private boolean verified;

    public VerificationData(String email, String code, boolean verified) {
        this.email = email;
        this.code = code;
        this.verified = verified;
    }
}