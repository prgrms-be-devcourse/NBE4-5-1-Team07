package com.coffeebean.domain.user.user.enitity;

import java.util.ArrayList;
import java.util.List;

import com.coffeebean.domain.user.pointHitstory.entity.PointHistory;
import com.coffeebean.domain.user.user.Address;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import lombok.*;

@Getter
@Setter
@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "users")
public class User {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "user_id")
	private Long id;

	@Email
	@Column(nullable = false, unique = true)
	private String email;

	@Column(nullable = false)
	private String password;

	@Column(length = 20)
	private String name;

	@Embedded
	private Address address;

	@Builder.Default
	private Integer totalPoints = 0; // (초기값 0)

	// 이메일 인증 코드
	@Column(name = "verification_code")
	private String verificationCode;

	// 이메일 인증 확인
	@Column(name = "verified", nullable = false, columnDefinition = "boolean default false")
	private boolean verified;

	@OneToMany(cascade = CascadeType.ALL)
	@JoinColumn(name = "user_id")
	private List<PointHistory> pointHistories = new ArrayList<>();

	// 포인트 적립 메서드
	public void addPoints(int amount, String description) {
		totalPoints += amount; // 총 포인트 업데이트
		pointHistories.add(new PointHistory(amount, description)); // 내역 추가
	}

	// 포인트 사용 메서드
	public void usePoints(int amount) {
		if (this.totalPoints < amount) {
			throw new IllegalArgumentException("사용 가능한 포인트가 부족합니다.");
		}
		this.totalPoints -= amount; // 총 포인트 차감
		this.pointHistories.add(new PointHistory(-amount, "포인트 사용")); // 내역 추가
	}
}
