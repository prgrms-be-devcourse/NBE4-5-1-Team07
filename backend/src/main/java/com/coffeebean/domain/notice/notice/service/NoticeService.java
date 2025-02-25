package com.coffeebean.domain.notice.notice.service;

import com.coffeebean.domain.notice.notice.dto.NoticeDto;
import com.coffeebean.domain.notice.notice.entity.Notice;
import com.coffeebean.domain.notice.notice.repository.NoticeRepository;
import com.coffeebean.global.exception.DataNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.domain.Pageable;

import java.util.List;

@RequiredArgsConstructor
@Service
public class NoticeService {
    private final NoticeRepository noticeRepository;

    // 공지사항 작성
    @Transactional
    public void writeNotice(String title, String content) {

        Notice notice = Notice.builder()
                .title(title)
                .content(content)
                .build();

        noticeRepository.save(notice);
    }

    // 공지사항 목록 조회
    @Transactional(readOnly = true)
    public List<Notice> getNotices() {
        return noticeRepository.findAll();
    }

    // 공지사항 Id로 조회
    @Transactional(readOnly = true)
    public Notice findByNoticeId(long id) {
        return noticeRepository.findById(id)
                .orElseThrow(() -> new DataNotFoundException("존재하지 않는 공지사항입니다."));
    }

    // 공지사항 삭제
    @Transactional
    public void deleteNotice(Long noticeId) {
        noticeRepository.deleteById(noticeId);
    }

    // 공지사항 수정
    @Transactional
    public Notice modifyNotice(Notice notice, String title, String content) {
        notice.setTitle(title);
        notice.setContent(content);
        return noticeRepository.save(notice);
    }

    // 공지사항 페이징 조회
    @Transactional(readOnly = true)
    public Page<NoticeDto> getNotices(Pageable pageable) {
        return noticeRepository.findAllByOrderByCreateDateDesc(pageable)
                .map(NoticeDto::new); // Entity → DTO 변환
    }
}
