package com.coffeebean.domain.notice.notice.controller;

import com.coffeebean.domain.notice.notice.dto.NoticeDto;
import com.coffeebean.domain.notice.notice.entity.Notice;
import com.coffeebean.domain.notice.notice.service.NoticeService;
import com.coffeebean.domain.question.question.entity.Question;
import com.coffeebean.domain.question.question.service.QuestionService;
import com.coffeebean.domain.user.user.enitity.User;
import com.coffeebean.domain.user.user.service.UserService;
import com.coffeebean.global.dto.RsData;
import com.coffeebean.global.exception.ServiceException;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/notices")
public class ApiV1NoticeController {

	private final QuestionService questionService;
	private final UserService userService;
	private final NoticeService noticeService;

	record WriteNoticeReqBody(
		@NotBlank(message = "공지사항 제목을 입력하세요.")
		String title,
		@NotBlank(message = "내용을 입력하세요.")
		String content,
		@NotBlank(message = "인증 정보가 없습니다.")
		String authToken
	) {
	}

	// 공지사항 작성
	@PostMapping
	public RsData<Void> writeNotice(@RequestBody @Valid WriteNoticeReqBody writeNoticeReqBody) {
		User actor = userService.getUserByAuthToken(writeNoticeReqBody.authToken());
		User realActor = userService.findByEmail(actor.getEmail())
			.orElseThrow(() -> new ServiceException("401-1", "인증 정보가 잘못되었습니다."));

		noticeService.writeNotice(realActor, writeNoticeReqBody.title(), writeNoticeReqBody.content());

		return new RsData<>(
			"200-1",
			"공지사항 작성이 완료되었습니다."
		);
	}

	// 공지사항 목록 전체 조회
	@GetMapping
	public RsData<List<NoticeDto>> getNotices() {

		List<NoticeDto> noticeList = noticeService.getNotices().stream()
			.map(NoticeDto::new)
			.toList();

		return new RsData<>(
			"200-1",
			"공지사항 목록 조회가 완료되었습니다.",
			noticeList
		);
	}



}
