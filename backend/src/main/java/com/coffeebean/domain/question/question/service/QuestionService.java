package com.coffeebean.domain.question.question.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.coffeebean.domain.item.entity.Item;
import com.coffeebean.domain.item.service.ItemService;
import com.coffeebean.domain.question.question.entity.Question;
import com.coffeebean.domain.question.question.repository.QuestionRepository;
import com.coffeebean.domain.user.user.enitity.User;
import com.coffeebean.global.exception.DataNotFoundException;
import com.coffeebean.global.exception.ServiceException;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class QuestionService {

	private final QuestionRepository questionRepository;
	private final ItemService itemService;

	@Transactional
	public void writeQuestion(User author, long itemId, String subject, String content) {
		Item item = itemService.getItem(itemId)
			.orElseThrow(() -> new DataNotFoundException("존제하지 않는 상품에 질문을 작성할 수 없습니다."));

		Question question = Question.builder()
			.author(author)
			.item(item)
			.subject(subject)
			.content(content)
			.build();

		questionRepository.save(question);
	}

	@Transactional(readOnly = true)
	public Question findQuestionById(long id) {
		return questionRepository.findById(id)
			.orElseThrow(() -> new DataNotFoundException("존재하지 않는 질문입니다."));
	}

	@Transactional(readOnly = true)
	public List<Question> getQuestions() {
		return questionRepository.findAll();
	}

	@Transactional
	public void deleteQuestion(Long id) {
		Question question = questionRepository.findById(id)
			.orElseThrow(() -> new ServiceException("404-1", "존재하지 않는 질문입니다."));
		questionRepository.delete(question);
	}
}
