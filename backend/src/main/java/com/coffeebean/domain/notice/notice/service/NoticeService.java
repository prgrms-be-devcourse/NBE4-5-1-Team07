package com.coffeebean.domain.notice.notice.service;

import com.coffeebean.domain.item.entity.Item;
import com.coffeebean.domain.notice.notice.entity.Notice;
import com.coffeebean.domain.notice.notice.repository.NoticeRepository;
import com.coffeebean.domain.question.question.entity.Question;
import com.coffeebean.domain.user.user.enitity.User;
import com.coffeebean.global.exception.DataNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@RequiredArgsConstructor
@Service
public class NoticeService {
    private final NoticeRepository noticeRepository;

    // 공지사항 작성
    @Transactional
    public void writeNotice(User author, String title, String content) {

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
    public void deleteNotice(Long noticeId) {
        noticeRepository.deleteById(noticeId);
    }
}
