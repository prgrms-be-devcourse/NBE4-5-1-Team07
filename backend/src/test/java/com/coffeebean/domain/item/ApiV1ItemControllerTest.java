package com.coffeebean.domain.item;

import com.coffeebean.domain.item.entity.Item;
import com.coffeebean.domain.item.service.ItemService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
public class ApiV1ItemControllerTest {

    @Autowired
    private ItemService itemService;

    @Test
    @DisplayName("커피 등록 및 조회")
    void addItem() {
        itemService.addItem("커피1", 1000, 10, "브라질 원두");
        itemService.addItem("커피2", 3000, 40, "미국 원두");
        itemService.addItem("커피3", 4000, 50, "케냐 원두");
        itemService.addItem("커피4", 6000, 12, "이탈리아 원두");
        itemService.addItem("커피5", 7000, 8, "가나 원두");

        // 저장된 아이템 목록 가져오기 (가정: getItems() 메서드가 존재)
        List<Item> items = itemService.getItems();

        assertThat(items).hasSize(5); // 아이템 개수 확인

        assertThat(items).extracting(Item::getName)
                .containsExactly("커피1", "커피2", "커피3", "커피4", "커피5");

        assertThat(items).extracting(Item::getPrice)
                .containsExactly(1000, 3000, 4000, 6000, 7000);

        assertThat(items).extracting(Item::getStockQuantity)
                .containsExactly(10, 40, 50, 12, 8);

        assertThat(items).extracting(Item::getDescription)
                .containsExactly("브라질 원두", "미국 원두", "케냐 원두", "이탈리아 원두", "가나 원두");
    }

    @Test
    @DisplayName("단건 조회")
    void getItem() {

        Item item = itemService.getItem(1).get();

        assertThat(item.getName()).isEqualTo("커피1");
    }
}

