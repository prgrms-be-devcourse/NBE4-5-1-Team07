package com.coffeebean;

import com.coffeebean.domain.item.service.ItemService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
public class ApiV1ItemcontrollerTest {

    @Autowired
    private ItemService itemService;

    @Test
    @DisplayName("test")
    void t1() {
        System.out.println("test");
    }
}
