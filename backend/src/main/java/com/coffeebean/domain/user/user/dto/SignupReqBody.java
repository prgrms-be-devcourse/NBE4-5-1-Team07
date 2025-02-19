package com.coffeebean.domain.user.user.dto;

import com.coffeebean.domain.user.user.Address;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class SignupReqBody {

    @NotBlank(message = "이메일을 입력해주세요.")  // 이메일은 빈 값일 수 없음
    @Email(message = "유효한 이메일을 입력해주세요.")  // 이메일 형식 검증
    private String email;

    @NotBlank(message = "비밀번호를 입력해주세요.")  // 비밀번호는 빈 값일 수 없음
    private String password;

    @NotBlank(message = "이름을 입력해주세요.")  // 이름은 빈 값일 수 없음
    private String name;

    @NotBlank(message = "도시를 입력해주세요.")  // 도시도 빈 값일 수 없음
    private String city;

    @NotBlank(message = "거리를 입력해주세요.")  // 거리도 빈 값일 수 없음
    private String street;

    @NotBlank(message = "우편번호를 입력해주세요.")  // 우편번호도 빈 값일 수 없음
    private String zipcode;

    // Address 클래스 변환
    public Address toAddress() {
        return new Address(city, street, zipcode);
    }
}
