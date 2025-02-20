package com.coffeebean.domain.item.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@Getter
@AllArgsConstructor
public class ItemListResponseDto {
    private List<ItemDto> items;
}
