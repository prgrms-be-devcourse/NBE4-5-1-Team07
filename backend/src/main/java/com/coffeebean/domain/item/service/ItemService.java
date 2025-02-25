package com.coffeebean.domain.item.service;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.coffeebean.domain.item.entity.Item;
import com.coffeebean.domain.item.repository.ItemRepository;
import com.coffeebean.global.exception.DataNotFoundException;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ItemService {

	private final ItemRepository itemRepository;

	// 상품 추가 로직
	public Item addItem(String name, int price, int stockQuantity, String description, String fileName) {

		return itemRepository.save(
			Item.builder()
				.name(name)
				.price(price)
				.stockQuantity(stockQuantity)
				.description(description)
				.imageUrl("http://localhost:8080/" + fileName)
				.build()
		);
	}

	// 전체 조회
	public List<Item> getItems() {
		return itemRepository.findAll();
	}

	// 페이징
	public Page<Item> getItems(Pageable pageable) {
		return itemRepository.findAll(pageable);
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

	public void updateStockQuantity(Item item, int newStockQuntity) {
		item.setStockQuantity(newStockQuntity);
		itemRepository.save(item);
	}

	@Transactional(readOnly = true)
	public boolean isStockSufficient(Map<Long, Integer> items) {
		for (Long itemId : items.keySet()) {
			int count = items.get(itemId);
			int quantity = itemRepository.findById(itemId)
				.orElseThrow(() -> new DataNotFoundException("존재하지 않는 상품이 포함되었습니다."))
				.getStockQuantity();

			if (quantity < count) {
				return false;
			}
		}
		return true;
	}
}
