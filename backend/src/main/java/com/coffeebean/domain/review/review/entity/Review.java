package com.coffeebean.domain.review.review.entity;

import java.time.LocalDateTime;

import org.springframework.data.annotation.CreatedDate;

import com.coffeebean.domain.order.orderItem.entity.OrderItem;
import com.coffeebean.domain.user.user.enitity.User;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
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

	private int rating;    // 리뷰 별점

	@CreatedDate
	private LocalDateTime createDate; // 리뷰 작성 날짜

	public Review(User user, OrderItem orderItem, String content, int rating) {
		this.user = user;
		this.orderItem = orderItem;
		this.content = content;
		this.rating = rating;
		this.createDate = LocalDateTime.now();
	}
}
