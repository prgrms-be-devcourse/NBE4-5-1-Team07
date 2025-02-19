package com.coffeebean.domain.user;

import com.coffeebean.domain.user.user.enitity.User;
import com.coffeebean.domain.user.user.repository.UserRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
public class UserRepositoryTest {

    @Autowired
    private UserRepository userRepository;

    @PersistenceContext
    private EntityManager entityManager;

    @Test
    @DisplayName("사용자를 이메일로 찾을 수 있다.")
    void findByEmail() {
        // Given
        User user = new User(null, "test@example.com", "password", "Tester", null, 0, null);
        userRepository.save(user);
        entityManager.flush();  // DB 반영

        // When
        Optional<User> foundUser = userRepository.findByEmail("test@example.com");

        // Then
        assertThat(foundUser).isPresent();
        assertThat(foundUser.get().getEmail()).isEqualTo("test@example.com");
    }

    @Test
    @DisplayName("이메일이 존재하지 않으면 Optional.empty()를 반환한다.")
    void findByEmail_NotFound() {
        // When
        Optional<User> foundUser = userRepository.findByEmail("notfound@example.com");

        // Then
        assertThat(foundUser).isEmpty();
    }
}
