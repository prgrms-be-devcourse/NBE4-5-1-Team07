package com.coffeebean.domain.notice.notice.repository;

import com.coffeebean.domain.notice.notice.entity.Notice;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NoticeRepository extends JpaRepository<Notice, Long> {
    default Page<Notice> findAllByOrderByCreateDateDesc(Pageable pageable) {
        Pageable sortedPageable = PageRequest.of(
                pageable.getPageNumber(),
                pageable.getPageSize(),
                Sort.by(Sort.Direction.DESC, "createDate") // 최신순 정렬 추가
        );
        return findAll(sortedPageable);
    }
}
