package com.coffeebean.domain.question.question.dto;

import java.time.LocalDateTime;

import com.coffeebean.domain.question.question.entity.Question;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class QuestionDto {
	long id;
	String name;
	String subject;
	String content;
	LocalDateTime createDate;
	LocalDateTime modifyDate;
	AnswerDto answer;

	@Getter(AccessLevel.PUBLIC)
	@Setter(AccessLevel.PUBLIC)
	static class AnswerDto {
		String content;
		LocalDateTime createDate;
		LocalDateTime modifyDate;

		// 생성자 추가 (값이 있는 경우)
		public AnswerDto(String content, LocalDateTime createDate, LocalDateTime modifyDate) {
			this.content = content;
			this.createDate = createDate;
			this.modifyDate = modifyDate;
		}
	}

	public QuestionDto(Question question) {
		this.id = question.getId();
		this.name = question.getAuthor().getName();
		this.subject = question.getSubject();
		this.content = question.getContent();
		this.createDate = question.getCreateDate();
		this.modifyDate = question.getModifyDate();

		// answer가 존재하면 값을 채우고, 없으면 "answer": null
		if (question.getAnswer() != null) {
			this.answer = new AnswerDto(
				question.getAnswer().getContent(),
				question.getAnswer().getCreateDate(),
				question.getAnswer().getModifyDate()
			);
		}
	}
}
