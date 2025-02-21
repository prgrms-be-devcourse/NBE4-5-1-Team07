package com.coffeebean.domain.question.question.controller;

import static org.assertj.core.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.nio.charset.StandardCharsets;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.transaction.annotation.Transactional;

import com.coffeebean.domain.question.answer.entity.Answer;
import com.coffeebean.domain.question.answer.repository.AnswerRepository;
import com.coffeebean.domain.question.question.entity.Question;
import com.coffeebean.domain.question.question.repository.QuestionRepository;
import com.coffeebean.domain.user.user.service.UserService;

import jakarta.servlet.http.HttpServletResponse;

@Transactional
@SpringBootTest
@ActiveProfiles("test")
@AutoConfigureMockMvc
class ApiV1QuestionControllerTest {

	@Autowired
	private MockMvc mvc;

	@Autowired
	private UserService userService;

	@Autowired
	private HttpServletResponse httpServletResponse;

	private String userAuthToken;
	private String adminAuthToken;
	@Autowired
	private QuestionRepository questionRepository;
	@Autowired
	private AnswerRepository answerRepository;

	@BeforeEach
	void setUp() {
		userAuthToken = userService.loginUser("example@exam.com", "password", httpServletResponse).get("token");
		adminAuthToken = userService.loginAdmin("admin", "admin1234", httpServletResponse);
	}

	@Test
	@DisplayName("질문 작성")
	void writeQuestion() throws Exception {
		long itemId = 1L;
		ResultActions resultActions = mvc.perform(
				post("/api/v1/questions")
					.content("""
						{
							"itemId" : "%d",
						    "subject": "상품 입고 관련 문의입니다.",
						    "content": "이 상품 입고 언제쯤 될까요?",
						    "authToken": "%s"
						}
						""".formatted(itemId, userAuthToken).trim().stripIndent())
					.contentType(
						new MediaType(MediaType.APPLICATION_JSON, StandardCharsets.UTF_8)
					)
			)
			.andDo(print());

		resultActions
			.andExpect(status().isOk())
			.andExpect(handler().handlerType(ApiV1QuestionController.class))
			.andExpect(handler().methodName("writeQuestion"))
			.andExpect(jsonPath("$.code").value("200-1"))
			.andExpect(jsonPath("$.msg").value("질문 작성이 완료되었습니다."));

		Question question = questionRepository.findById(3L).get();
		assertThat(question.getItem().getId()).isEqualTo(itemId);
		assertThat(question.getSubject()).isEqualTo("상품 입고 관련 문의입니다.");
		assertThat(question.getContent()).isEqualTo("이 상품 입고 언제쯤 될까요?");
	}

	@Test
	@DisplayName("질문 단건 조회")
	void findById() throws Exception {
		long questionId = 1L;
		ResultActions resultActions = mvc.perform(
				get("/api/v1/questions/%d".formatted(questionId))
			)
			.andDo(print());

		resultActions
			.andExpect(status().isOk())
			.andExpect(handler().handlerType(ApiV1QuestionController.class))
			.andExpect(handler().methodName("findById"))
			.andExpect(jsonPath("$.code").value("200-1"))
			.andExpect(jsonPath("$.msg").value("질문에 대한 조회가 완료되었습니다."));
	}

	@Test
	@DisplayName("질문 전체 조회")
	void getQuestions() throws Exception {
		ResultActions resultActions = mvc
			.perform(
				get("/api/v1/questions")
			)
			.andDo(print());

		resultActions
			.andExpect(status().isOk())
			.andExpect(handler().handlerType(ApiV1QuestionController.class))
			.andExpect(handler().methodName("getQuestions"))
			.andExpect(jsonPath("$.code").value("200-1"))
			.andExpect(jsonPath("$.msg").value("질문 목록 조회가 완료되었습니다."))
			.andExpect(jsonPath("$.data[0].id").value("1"))
			.andExpect(jsonPath("$.data[0].itemId").value("3"))
			.andExpect(jsonPath("$.data[0].name").value("user1"))
			.andExpect(jsonPath("$.data[0].subject").value("입고 질문"))
			.andExpect(jsonPath("$.data[0].content").value("언제 이 상품이 입고가 될까요"))
			.andExpect(jsonPath("$.data[0].answer").isNotEmpty())
			.andExpect(jsonPath("$.data[0].answer.content").value("내일 쯤 입고될 것 같습니다."))
			.andExpect(jsonPath("$.data[1].id").value("2"))
			.andExpect(jsonPath("$.data[1].itemId").value("8"))
			.andExpect(jsonPath("$.data[1].name").value("user1"))
			.andExpect(jsonPath("$.data[1].subject").value("상품 원산지 관련 문의입니다."))
			.andExpect(jsonPath("$.data[1].content").value("상품 원산지 정보가 표시되어 있지 않은데 어디인가요?"))
			.andExpect(jsonPath("$.data[1].answer").isEmpty());
	}

	@Test
	@DisplayName("질문 삭제 - 관리자, 사용자만 삭제 가능")
	void deleteQuestion() throws Exception {
		long questionId = 1L;
		ResultActions resultActions = mvc.perform(
				delete("/api/v1/questions/%d".formatted(questionId))
					.content("""
						{
						    "authToken": "%s"
						}
						""".formatted(userAuthToken).trim().stripIndent())
					.contentType(
						new MediaType(MediaType.APPLICATION_JSON, StandardCharsets.UTF_8)
					)
			)
			.andDo(print());

		resultActions
			.andExpect(status().isOk())
			.andExpect(handler().handlerType(ApiV1QuestionController.class))
			.andExpect(handler().methodName("deleteQuestion"))
			.andExpect(jsonPath("$.code").value("200-1"))
			.andExpect(jsonPath("$.msg").value("질문이 삭제되었습니다."));

		assertThat(questionRepository.findById(questionId)).isEmpty();
	}

	@Test
	@DisplayName("질문에 대한 답변 작성")
	void writeAnswer() throws Exception {
		long questionId = 2L;
		ResultActions resultActions = mvc.perform(
				post("/api/v1/questions/%d".formatted(questionId))
					.content("""
						{
						    "content": "내일 됩니다.",
						    "authToken": "%s"
						}
						""".formatted(adminAuthToken).trim().stripIndent())
					.contentType(
						new MediaType(MediaType.APPLICATION_JSON, StandardCharsets.UTF_8)
					)
			)
			.andDo(print());

		resultActions
			.andExpect(status().isOk())
			.andExpect(handler().handlerType(ApiV1QuestionController.class))
			.andExpect(handler().methodName("writeAnswer"))
			.andExpect(jsonPath("$.code").value("200-1"))
			.andExpect(jsonPath("$.msg").value("답변이 작성되었습니다."));

		Question question = questionRepository.findById(questionId).get();
		Answer answers = answerRepository.findByQuestion(question);
		assertThat(answers.getContent()).isEqualTo("내일 됩니다.");
	}

	@Test
	@DisplayName("질문에 대한 답변 작성 - User가 하면 작성 실패")
	void writeAnswerUser() throws Exception {
		long questionId = 2L;
		ResultActions resultActions = mvc.perform(
				post("/api/v1/questions/%d".formatted(questionId))
					.content("""
						{
						    "content": "내일 됩니다.",
						    "authToken": "%s"
						}
						""".formatted(userAuthToken).trim().stripIndent())
					.contentType(
						new MediaType(MediaType.APPLICATION_JSON, StandardCharsets.UTF_8)
					)
			)
			.andDo(print());

		resultActions
			.andExpect(status().isForbidden())
			.andExpect(handler().handlerType(ApiV1QuestionController.class))
			.andExpect(handler().methodName("writeAnswer"))
			.andExpect(jsonPath("$.code").value("403-1"))
			.andExpect(jsonPath("$.msg").value("답변 작성은 관리자만 가능합니다."));
	}

	@Test
	@DisplayName("질문에 대한 답변 삭제")
	void deleteAnswer() throws Exception {
		long questionId = 1L;
		ResultActions resultActions = mvc.perform(
				delete("/api/v1/questions/%d/answers".formatted(questionId))
					.content("""
						{
						    "authToken": "%s"
						}
						""".formatted(adminAuthToken).trim().stripIndent())
					.contentType(
						new MediaType(MediaType.APPLICATION_JSON, StandardCharsets.UTF_8)
					)
			)
			.andDo(print());

		resultActions
			.andExpect(status().isOk())
			.andExpect(handler().handlerType(ApiV1QuestionController.class))
			.andExpect(handler().methodName("deleteAnswer"))
			.andExpect(jsonPath("$.code").value("200-1"))
			.andExpect(jsonPath("$.msg").value("답변이 삭제되었습니다."));

		Answer savedAnswer = questionRepository.findById(questionId).get().getAnswer();
		assertThat(savedAnswer).isNull();
	}
}