package com.coffeebean.domain.item.controller;

import com.coffeebean.domain.item.dto.ItemDto;
import com.coffeebean.domain.item.dto.ItemListResponseDto;
import com.coffeebean.domain.item.entity.Item;
import com.coffeebean.domain.item.service.ItemService;
import com.coffeebean.global.dto.RsData;
import com.coffeebean.global.exception.ServiceException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/items")
public class ApiV1ItemController {

    @Autowired
    private ItemService itemService;


    // 상품 전체 조회
    @GetMapping
    public RsData<ItemListResponseDto> getItems() {

        List<ItemDto> items = itemService.getItems().stream()
                .map(ItemDto::new)
                .toList();

        return new RsData<>(
                "200-1",
                "전체 상품이 조회 되었습니다.",
                new ItemListResponseDto(items)
        );
    }

    // 상품 단건 조회
    @GetMapping("/{id}")
    public RsData<ItemDto> getItem(@PathVariable long id) {

        Item item = itemService.getItem(id).orElseThrow(
                ()-> new ServiceException("404-1", "존재하지 않는 상품입니다.")
        );

        return new RsData<>(
                "200-1",
                "%s가 조회 되었습니다.".formatted(item.getName()),
                new ItemDto(item)
        );
    }
}
