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
    ){}

    // 상품 등록
    @PostMapping
    public void addItem(@RequestBody @Valid AddReqBody reqBody){
        itemService.addItem(reqBody.name(), reqBody.price(), reqBody.stockQuantity(), reqBody.description());
    }

    // 상품 전체 조회
    @GetMapping
    public List<Item> getItems(){
        return itemService.getItems();
    }

    @GetMapping("/{id}")
    public Optional<Item> getItem(@PathVariable long id){
        return itemService.getItem(id);
    }


}
