package com.coffeebean.domain.item.service;

import com.coffeebean.domain.item.entity.Item;
import com.coffeebean.domain.item.repository.ItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ItemService {

    private final ItemRepository itemRepository;

    public Item addItem(String name, int price, int stockQuantity, String description) {
        return ItemRepository.save(
                Item.builder()
                        .name(name)
                        .price(price)
                        .stockQuantity(stockQuantity)
                        .description(description)
                        .build()
        );
    }
}
