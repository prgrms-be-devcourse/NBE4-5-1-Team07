package com.coffeebean.domain.item.controller;

import com.coffeebean.domain.item.dto.ItemDto;
import com.coffeebean.domain.item.entity.Item;
import com.coffeebean.domain.item.service.ItemService;
import com.coffeebean.global.dto.RsData;
import com.coffeebean.global.exception.ServiceException;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/items")
public class ApiV1ItemController {

    @Autowired
    private ItemService itemService;


    record AddReqBody(
            String name,
            int price,
            int stockQuantity,
            String description
    ) {
    }

    // 상품 등록
    @PostMapping
    public RsData<Item> addItem(@RequestBody @Valid AddReqBody reqBody) {
        Item item = itemService.addItem(reqBody.name(), reqBody.price(), reqBody.stockQuantity(), reqBody.description());

        return new RsData<>(
                "200-1",
                "'%s' 상품이 정상적으로 등록되었습니니다.".formatted(item.getName()),
                item
        );
    }

    // 상품 전체 조회
    @GetMapping
    public RsData<List<ItemDto>> getItems() {

        List<ItemDto> items = itemService.getItems().stream()
                .map(ItemDto::new)
                .toList();

        return new RsData<>(
                "200-1",
                "전체 상품이 조회 되었습니다.",
                items
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

    // 상품 삭제
    @DeleteMapping("/{id}")
    @Transactional
    public RsData<Void> deleteItem(@PathVariable long id) {
        Item item = itemService.getItem(id).orElseThrow(
                ()-> new ServiceException("404-1", "존재하지 않는 상품입니다.")
        );

        itemService.deleteItem(item);

        return new RsData<>(
                "200-1",
                "%d번 상품 삭제가 완료되었습니다.".formatted(id)
                );

    }

    record ModifyReqBody(
            String name,
            int price,
            int stockQuantity,
            String description
    ) {
    }

    // 상품 수정
    @PutMapping("/{id}")
    @Transactional
    public RsData<Void> modifyItem(@PathVariable long id, @RequestBody ModifyReqBody reqBody) {
        Item item = itemService.getItem(id).orElseThrow(
                ()-> new ServiceException("404-1", "존재하지 않는 상품입니다.")
        );

        Item modifyItem= itemService.modifyItem(item, reqBody.name(), reqBody.price(), reqBody.stockQuantity(), reqBody.description());

        return new RsData<>(
                "200-1",
                "'%S' 상품이 수정완료 되었습니다.".formatted(modifyItem.getName())
        );

    }
}
