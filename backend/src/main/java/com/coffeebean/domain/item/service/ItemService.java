package com.coffeebean.domain.item.service;

import com.coffeebean.domain.item.entity.Item;
import com.coffeebean.domain.item.repository.ItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ItemService {

    private final ItemRepository itemRepository;

    // 상품 추가 로직
    public Item addItem(String name, int price, int stockQuantity, String description) {

        return itemRepository.save(
                Item.builder()
                        .name(name)
                        .price(price)
                        .stockQuantity(stockQuantity)
                        .description(description)
                        .build()
        );
    }

    // 전체 조회
    public List<Item> getItems() {
        return itemRepository.findAll();
    }

    // 단건 조회
    public Optional<Item> getItem(long id) {
        return itemRepository.findById(id);
    }

    // 상품 삭제
    public void deleteItem(Item item) {
        itemRepository.delete(item);
    }

    // test를 위한 count
    public long count() {
        return itemRepository.count();
    }

    public Item modifyItem(Item item, String name, int price, int stockQuantity, String description) {
        item.setName(name);
        item.setPrice(price);
        item.setStockQuantity(stockQuantity);
        item.setDescription(description);
        return item;
    }
}
