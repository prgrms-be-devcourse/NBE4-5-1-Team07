package com.coffeebean.domain.item.controller;

import com.coffeebean.domain.item.entity.Item;
import com.coffeebean.domain.item.service.ItemService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

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
    public void addItem(@RequestBody @Valid AddReqBody reqBody) {
        itemService.addItem(reqBody.name(), reqBody.price(), reqBody.stockQuantity(), reqBody.description());
    }

    // 상품 전체 조회
    @GetMapping
    public List<Item> getItems() {
        return itemService.getItems();
    }

    // 상품 단건 조회
    @GetMapping("/{id}")
    public Optional<Item> getItem(@PathVariable long id) {
        return itemService.getItem(id);
    }

    // 상품 삭제
    @DeleteMapping("/{id}")
    public void deleteItem(@PathVariable long id) {
        Item item = itemService.getItem(id).get();

        itemService.deleteItem(item);

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
    public void modifyItem(@PathVariable long id, @RequestBody ModifyReqBody reqBody){
        Item item = itemService.getItem(id).get();
        itemService.modifyItem(item, reqBody.name(), reqBody.price(), reqBody.stockQuantity(), reqBody.description());

    }
}
