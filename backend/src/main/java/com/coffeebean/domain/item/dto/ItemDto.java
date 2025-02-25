package com.coffeebean.domain.item.dto;

import com.coffeebean.domain.item.entity.Item;
import lombok.Getter;
import lombok.NonNull;

@Getter
public class ItemDto {

    @NonNull
    private Long id;

    private String name; // 상품명

    private int price; // 상품 가격

    private int stockQuantity; // 상품 수량

    private String description; // 상품 설명

    private String imageUrl;

    public ItemDto(Item item) {
        this.id = item.getId();
        this.name = item.getName();
        this.price = item.getPrice();
        this.stockQuantity = item.getStockQuantity();
        this.description = item.getDescription();
        this.imageUrl = item.getImageUrl();
    }
}
