package com.coffeebean.domain.question.question.controller;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.coffeebean.domain.question.answer.service.AnswerService;
import com.coffeebean.domain.question.question.dto.QuestionDto;
import com.coffeebean.domain.question.question.entity.Question;
import com.coffeebean.domain.question.question.service.QuestionService;
import com.coffeebean.domain.user.user.enitity.User;
import com.coffeebean.domain.user.user.service.UserService;
import com.coffeebean.global.dto.RsData;
import com.coffeebean.global.exception.ServiceException;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/questions")
public class ApiV1QuestionController {

	private final QuestionService questionService;
	private final UserService userService;
	private final AnswerService answerService;

	record WriteQuestionReqBody(
		@NotNull(message = "질문할 상품이 선택되지 않았습니다.")
		long itemId,
		@NotBlank(message = "질문 제목을 입력하세요.")
		String subject,
		@NotBlank(message = "내용을 입력하세요.")
		String content,
		@NotBlank(message = "인증 정보가 없습니다.")
		String authToken
	) {
	}

	// 질문 작성
	@PostMapping
	public RsData<Void> writeQuestion(@RequestBody @Valid WriteQuestionReqBody writeQuestionReqBody) {
		User actor = userService.getUserByAuthToken(writeQuestionReqBody.authToken());
		User realActor = userService.findByEmail(actor.getEmail())
			.orElseThrow(() -> new ServiceException("401-1", "인증 정보가 잘못되었습니다."));

		questionService.writeQuestion(realActor, writeQuestionReqBody.itemId(), writeQuestionReqBody.subject(),
			writeQuestionReqBody.content());

		return new RsData<>(
			"200-1",
			"질문 작성이 완료되었습니다."
		);
	}

	// 질문 단건 조회
	@GetMapping("/{id}")
	public RsData<QuestionDto> findById(@PathVariable long id) {
		Question question = questionService.findQuestionById(id);

		return new RsData<>(
			"200-1",
			"질문에 대한 조회가 완료되었습니다.",
			new QuestionDto(question)
		);
	}

	// 질문 목록 조회
	@GetMapping
	public RsData<List<QuestionDto>> getQuestions() {

		List<QuestionDto> questionLists = questionService.getQuestions().stream()
			.map(QuestionDto::new)
			.toList();

		return new RsData<>(
			"200-1",
			"질문 목록 조회가 완료되었습니다.",
			questionLists
		);
	}

	record AuthReqBody(@NotBlank(message = "인증 정보가 없습니다.") String authToken) {
	}

	// 질문 삭제
	@DeleteMapping("/{id}")
	public RsData<Void> deleteQuestion(
		@RequestBody @Valid AuthReqBody authReqBody,
		@PathVariable(name = "id") Long questionId) {
		if (canDeleteQuestion(questionId, authReqBody.authToken())) {
			questionService.deleteQuestion(questionId);
			return new RsData<>("200-1", "질문이 삭제되었습니다.");
		}
		return new RsData<>("403-1", "질문을 삭제할 권한이 없습니다.");
	}

	private boolean canDeleteQuestion(Long questionId, String authToken) {
		// 관리자인 경우
		if (userService.isAdminByAuthToken(authToken)) {
			return true;
		}
		// 작성자인 경우
		User actor = userService.getUserByAuthToken(authToken);
		Question question = questionService.findQuestionById(questionId);
		return question.getAuthor().getEmail().equals(actor.getEmail());
	}

	record WriteAnswerReqBody(
		@NotBlank(message = "답변 내용은 공백일 수 없습니다.")
		String content,
		@NotNull(message = "인증 정보가 없습니다.")
		String authToken
	) {
	}

	// 질문에 대한 답변 작성
	@PostMapping("/{id}")
	public RsData<Void> writeAnswer(@RequestBody @Valid WriteAnswerReqBody writeAnswerReqBody,
		@PathVariable(name = "id") long questionId) {
		if (!userService.isAdminByAuthToken(writeAnswerReqBody.authToken())) {
			throw new ServiceException("403-1", "답변 작성은 관리자만 가능합니다.");
		}

		Question question = questionService.findQuestionById(questionId);
		answerService.writeAnswer(question, writeAnswerReqBody.content());

		return new RsData<>(
			"200-1",
			"답변이 작성되었습니다."
		);
	}

	// 질문에 대한 답변 삭제
	@DeleteMapping("/{id}/answers")
	public RsData<Void> deleteAnswer(
		@RequestBody @Valid AuthReqBody authReqBody,
		@PathVariable(name = "id") Long questionId) {
		if (!userService.isAdminByAuthToken(authReqBody.authToken())) {
			throw new ServiceException("403-1", "답변 삭제는 관리자만 가능합니다.");
		}

		questionService.deleteAnswer(questionId);

		return new RsData<>("200-1", "답변이 삭제되었습니다.");
	}
}
