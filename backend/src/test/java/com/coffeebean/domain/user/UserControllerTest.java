package com.coffeebean.domain.user;

import com.coffeebean.domain.user.user.controller.UserController;
import com.coffeebean.domain.user.user.dto.SignupReqBody;
import com.coffeebean.domain.user.user.service.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
public class UserControllerTest {

    private MockMvc mockMvc;

    @Mock
    private UserService userService;

    @InjectMocks
    private UserController userController;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(userController).build();
    }

    @Test
    @DisplayName("회원가입 (성공)")
    void signup() throws Exception {
        // Given
        SignupReqBody signupReqBody = new SignupReqBody();
        signupReqBody.setEmail("test@example.com");
        signupReqBody.setPassword("password123");
        signupReqBody.setName("Tester");
        signupReqBody.setCity("Seoul");
        signupReqBody.setStreet("Gangnam");
        signupReqBody.setZipcode("12345");

        // 이메일 중복 없음
        when(userService.findByEmail("test@example.com")).thenReturn(Optional.empty());
        // 회원가입 성공
        doNothing().when(userService).create(any(SignupReqBody.class));

        // When & Then
        mockMvc.perform(post("/api/v1/users/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .characterEncoding("UTF-8")
                        .content(objectMapper.writeValueAsString(signupReqBody)))
                .andExpect(status().isCreated());
    }

}
