package com.coffeebean.domain.review.review.entity;

import java.time.LocalDateTime;
import java.util.UUID;

import com.coffeebean.domain.order.order.DeliveryStatus;
import com.coffeebean.domain.order.order.entity.Order;
import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import org.springframework.data.annotation.CreatedDate;

import com.coffeebean.domain.order.orderItem.entity.OrderItem;
import com.coffeebean.domain.user.user.enitity.User;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@Getter
@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@EntityListeners(AuditingEntityListener.class)
public class Review {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "review_id")
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "user_id")
	private User user;

	@OneToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "order_item_id")
	private OrderItem orderItem;

	@Lob
	@Column(columnDefinition = "TEXT")
	private String content;    // 리뷰 내용

	@Min(1)
	@Max(5)
	private int rating;    // 리뷰 별점

	@CreatedDate
	private LocalDateTime createDate; // 리뷰 작성 날짜

	@Column(nullable = true)  // 사용자 입력 URL
	private String originalFileName;

	@Column(nullable = true)
	private String generatedFileName; // DB 저장용 -> 사용자 입력을 UUID로 변환 후 저장 (중복 방지)

	// 별점 오류 처리 (선택하지 않는 경우 방지)
	public Review(User user, OrderItem orderItem, String content, int rating) {

		if (rating < 1 || rating > 5) {
			throw new IllegalArgumentException("별점은 최소 1점, 최대 5점입니다.");
		}
		this.user = user;
		this.orderItem = orderItem;
		this.content = content;
		this.rating = rating;
	}

	// 리뷰 내용 수정
	public void update(String content, int rating, String generatedFileName) {
		if (rating < 1 || rating > 5) {
			throw new IllegalArgumentException("별점은 최소 1점, 최대 5점입니다.");
		}
		this.content = content;
		this.rating = rating;
		this.generatedFileName = generatedFileName;
	}

	// 파일 이름 생성
	public void newFileName(String input) {
        String fileExtension = "";
		if (input != null && !input.isEmpty()) {
			String[] parts = input.split("\\."); // 파일명 점(.) 기준 분할
			if (parts.length > 1) { // 분할 결과가 2개 이상인 경우 (확장자가 있으면)
				fileExtension = "." + parts[parts.length - 1]; // 마지막 요소 추출
				fileExtension = fileExtension.toLowerCase();
			}
		}
		String uuid = UUID.randomUUID().toString();
		this.generatedFileName = uuid + fileExtension;
	}
}
