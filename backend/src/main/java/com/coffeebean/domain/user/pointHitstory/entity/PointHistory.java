package com.coffeebean.domain.user.pointHitstory.entity;

import java.time.LocalDateTime;

import org.springframework.data.annotation.CreatedDate;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class PointHistory {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	private Integer amount; // 포인트 적립 및 차감 금액

	private String description; // 포인트 적립 및 차감 사유

	@CreatedDate
	private LocalDateTime createDate; // 포인트 적립 및 차감 시각

	public PointHistory(int amount, String description) {
		this.amount = amount;
		this.description = description;
	}
}
