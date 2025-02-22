package com.coffeebean.domain.user.user.repository;

import com.coffeebean.domain.user.user.enitity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

    Long id(Long id);
}
