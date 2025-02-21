package com.coffeebean.domain.question.question.service;

import org.springframework.stereotype.Service;

import com.coffeebean.domain.item.entity.Item;
import com.coffeebean.domain.item.service.ItemService;
import com.coffeebean.domain.question.question.entity.Question;
import com.coffeebean.domain.question.question.repository.QuestionRepository;
import com.coffeebean.domain.user.user.enitity.User;
import com.coffeebean.global.exception.DataNotFoundException;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class QuestionService {

	private final QuestionRepository questionRepository;
	private final ItemService itemService;

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
}
