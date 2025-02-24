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


}
