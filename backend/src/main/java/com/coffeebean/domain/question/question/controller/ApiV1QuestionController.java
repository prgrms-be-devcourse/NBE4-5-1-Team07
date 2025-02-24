package com.coffeebean.domain.question.question.controller;

import java.util.List;

import com.coffeebean.domain.notice.notice.controller.ApiV1NoticeController;
import com.coffeebean.domain.notice.notice.entity.Notice;
import com.coffeebean.domain.question.answer.entity.Answer;
import com.coffeebean.global.annotation.Login;
import com.coffeebean.global.security.annotations.AdminOnly;
import com.coffeebean.global.util.CustomUserDetails;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

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
		String content
	) {
	}

	// 질문 작성
	@PostMapping
	public RsData<Void> writeQuestion(@RequestBody @Valid WriteQuestionReqBody writeQuestionReqBody, @Login CustomUserDetails userDetails) {
		User actor = User.builder()
				.id(userDetails.getUserId())
				.email(userDetails.getEmail())
				.build();


		questionService.writeQuestion(actor, writeQuestionReqBody.itemId(), writeQuestionReqBody.subject(),
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


	// 질문 삭제 - 유저
	@DeleteMapping("/{id}")
	public RsData<Void> deleteQuestion(
			@Login CustomUserDetails userDetails,
		@PathVariable(name = "id") Long questionId) {
		User actor = User.builder()
				.id(userDetails.getUserId())
				.email(userDetails.getEmail())
				.build();
		if (canDeleteQuestion(questionId, actor)) {
			questionService.deleteQuestion(questionId);
			return new RsData<>("200-1", "질문이 삭제되었습니다.");
		}
		return new RsData<>("403-1", "질문을 삭제할 권한이 없습니다.");
	}

	private boolean canDeleteQuestion(Long questionId, User actor) {
		// 작성자인 경우
		Question question = questionService.findQuestionById(questionId);
		return question.getAuthor().getEmail().equals(actor.getEmail());
	}

	// 질문 삭제 - 관리자
	@AdminOnly
	@DeleteMapping("/{id}/admin")
	public RsData<Void> deleteQuestion(@PathVariable(name = "id") Long questionId) {
		questionService.deleteQuestion(questionId);
		return new RsData<>("200-1", "질문이 삭제되었습니다.");
	}

	record WriteAnswerReqBody(
		@NotBlank(message = "답변 내용은 공백일 수 없습니다.")
		String content
	) {
	}

	// 질문에 대한 답변 작성
	@AdminOnly
	@PostMapping("/{id}/answers")
	public RsData<Void> writeAnswer(
			@RequestBody @Valid WriteAnswerReqBody writeAnswerReqBody,
			@PathVariable(name = "id") long questionId) {

		Question question = questionService.findQuestionById(questionId);
		answerService.writeAnswer(question, writeAnswerReqBody.content());

		return new RsData<>(
			"200-1",
			"답변이 작성되었습니다."
		);
	}

	// 질문에 대한 답변 삭제
	@AdminOnly
	@DeleteMapping("/{id}/answers")
	public RsData<Void> deleteAnswer(@PathVariable(name = "id") Long questionId) {

		questionService.deleteAnswer(questionId);

		return new RsData<>("200-1", "답변이 삭제되었습니다.");
	}
}
