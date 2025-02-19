package com.coffeebean.domain.item.controller;

import com.coffeebean.domain.item.service.ItemService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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


}
