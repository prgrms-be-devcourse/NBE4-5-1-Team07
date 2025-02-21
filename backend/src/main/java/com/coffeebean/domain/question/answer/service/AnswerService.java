package com.coffeebean.domain.question.answer.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.coffeebean.domain.question.answer.entity.Answer;
import com.coffeebean.domain.question.answer.repository.AnswerRepository;
import com.coffeebean.domain.question.question.entity.Question;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class AnswerService {

	private final AnswerRepository answerRepository;

	@Transactional
	public void writeAnswer(Question question, String content) {
		answerRepository.save(Answer.builder()
				.content(content)
				.question(question)
			.build()
		);
	}
}
