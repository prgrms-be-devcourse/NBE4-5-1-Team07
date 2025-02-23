package com.coffeebean.domain.user.user.repository;

import com.coffeebean.domain.user.pointHitstory.entity.PointHistory;
import com.coffeebean.domain.user.user.enitity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

    // 페이징 안 되고 중복 데이터 생길 수 있는데... 나중에 페이징 되기 바라면 로직 고쳐야 할 듯...
    @Query("select distinct u from User u " +
            "join fetch u.pointHistories " +
            "where u.id = :id")
    Optional<User> findByIdWithPointHistories(@Param("id") Long id);
}
