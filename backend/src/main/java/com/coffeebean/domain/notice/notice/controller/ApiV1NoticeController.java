package com.coffeebean.domain.notice.notice.controller;

import com.coffeebean.domain.item.controller.ApiV1ItemController;
import com.coffeebean.domain.item.entity.Item;
import com.coffeebean.domain.notice.notice.dto.NoticeDto;
import com.coffeebean.domain.notice.notice.entity.Notice;
import com.coffeebean.domain.notice.notice.service.NoticeService;
import com.coffeebean.domain.question.question.entity.Question;
import com.coffeebean.domain.question.question.service.QuestionService;
import com.coffeebean.domain.user.user.enitity.User;
import com.coffeebean.domain.user.user.service.UserService;
import com.coffeebean.global.dto.RsData;
import com.coffeebean.global.exception.ServiceException;
import com.coffeebean.global.security.annotations.AdminOnly;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.Comparator;
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
		String content
	) {
	}

	// 공지사항 작성
	@AdminOnly
	@PostMapping
	public RsData<Void> writeNotice(@RequestBody @Valid WriteNoticeReqBody writeNoticeReqBody) {

		noticeService.writeNotice(writeNoticeReqBody.title(), writeNoticeReqBody.content());

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
				.sorted(Comparator.comparing(NoticeDto::getCreateDate).reversed()) // 역순 정렬
				.toList();

		return new RsData<>(
			"200-1",
			"공지사항 목록 조회가 완료되었습니다.",
			noticeList
		);
	}

	// 공지사항 목록 전체 조회 - 페이징
	@GetMapping("/list")
	public RsData<Page<NoticeDto>> getNotices(Pageable pageable) {
		Page<NoticeDto> noticePage = noticeService.getNotices(pageable);
		return new RsData<>(
				"200-1",
				"공지사항 목록 조회가 완료되었습니다.",
				noticePage
		);
	}

	// 공지사항 단건 조회
	@GetMapping("/{id}")
	public RsData<NoticeDto> findById(@PathVariable long id) {
		Notice notice = noticeService.findByNoticeId(id);

		return new RsData<>(
				"200-1",
				"공지사항 단건 조회가 완료되었습니다.",
				new NoticeDto(notice)
		);
	}

	// 공지사항 삭제
	@AdminOnly
	@Transactional
	@DeleteMapping("/{id}")
	public RsData<Void> deleteNotice(@PathVariable(name = "id") Long noticeId) {

		noticeService.deleteNotice(noticeId);
		return new RsData<>("200-1", "공지사항이 삭제되었습니다.");
	}

	record ModifyReqBody(
			String title,
			String content
	) {
	}
	// 공지사항 수정
	@AdminOnly
	@PutMapping("/{id}")
	@Transactional
	public RsData<Void> modifyNotice(@PathVariable long id, @RequestBody ModifyReqBody reqBody) {
		Notice notice = noticeService.findByNoticeId(id);

		Notice modifyNotice = noticeService.modifyNotice(notice, reqBody.title(), reqBody.content());

		return new RsData<>(
				"200-1",
				"'%d'번 공지사항이 수정 되었습니다.".formatted(modifyNotice.getId())
		);

	}

}
