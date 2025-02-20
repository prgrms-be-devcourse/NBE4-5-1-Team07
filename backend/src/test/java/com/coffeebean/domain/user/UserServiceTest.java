package com.coffeebean.domain.user;

import com.coffeebean.domain.user.user.dto.SignupReqBody;
import com.coffeebean.domain.user.user.enitity.User;
import com.coffeebean.domain.user.user.repository.UserRepository;
import com.coffeebean.domain.user.user.service.UserService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserService userService;

    @Test
    @DisplayName("회원 가입 시 비밀번호가 암호화되어 저장되어야 한다.")
    void createUser_ShouldEncryptPassword() {
        // Given
        SignupReqBody request = new SignupReqBody();
        request.setEmail("test@example.com");
        request.setPassword("password123");
        request.setName("Test User");
        request.setCity("Seoul");
        request.setStreet("123 Street");
        request.setZipcode("12345");

        when(passwordEncoder.encode(request.getPassword())).thenReturn("encryptedPassword");

        // When
        userService.create(request);

        // Then
        verify(userRepository, times(1)).save(argThat(user ->
                user.getEmail().equals("test@example.com") &&
                        user.getPassword().equals("encryptedPassword")
        ));
    }


    @Test
    @DisplayName("이메일로 회원 조회 시 올바른 회원 정보를 반환해야 한다.")
    void findByEmail_ShouldReturnUserIfExists() {
        User user = new User(1L, "test@example.com", "password123", "Test User", null, 0, null);
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(user));

        Optional<User> foundUser = userService.findByEmail("test@example.com");

        assertThat(foundUser).isPresent();
        assertThat(foundUser.get().getEmail()).isEqualTo("test@example.com");
    }

    @Test
    @DisplayName("존재하지 않는 이메일 조회 시 빈 결과를 반환해야 한다.")
    void findByEmail_ShouldReturnEmptyIfNotExists() {
        when(userRepository.findByEmail("notfound@example.com")).thenReturn(Optional.empty());

        Optional<User> foundUser = userService.findByEmail("notfound@example.com");

        assertThat(foundUser).isEmpty();
    }
}
