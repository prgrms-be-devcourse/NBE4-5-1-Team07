package com.coffeebean.domain.question.answer.service;

import com.coffeebean.domain.notice.notice.entity.Notice;
import com.coffeebean.global.exception.DataNotFoundException;
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

	// 답변 Id로 조회
	@Transactional(readOnly = true)
	public Answer findByAnswerId(long id) {
		return answerRepository.findById(id)
				.orElseThrow(() -> new DataNotFoundException("존재하지 않는 답변입니다."));
	}

	// 답변 수정
	@Transactional
	public Answer modifyAnswer(Answer answer, String content) {
		answer.setContent(content);
		return answerRepository.save(answer);
	}

	public Answer findByQuestion(Question question) {
		return answerRepository.findByQuestion(question);
	}
}
