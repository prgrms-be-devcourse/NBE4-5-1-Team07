package com.coffeebean.domain.question.question.entity;

import java.time.LocalDateTime;

import org.springframework.data.annotation.LastModifiedDate;

import com.coffeebean.domain.item.entity.Item;
import com.coffeebean.domain.question.answer.entity.Answer;

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
import lombok.Setter;

@Getter
@Setter
@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Question {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;

	private String subject; // 질문 주제

	@Lob
	@Column(columnDefinition = "TEXT")
	private String content; // 질문 내용

	@OneToOne
	@JoinColumn(name = "answer_id")
	private Answer answer;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "item_id", nullable = false)
	private Item item;

	private LocalDateTime createDate;

	@LastModifiedDate
	private LocalDateTime modifyDate;
}
