package com.coffeebean.domain.item.entity;

import com.coffeebean.global.exception.ServiceException;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import lombok.*;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Item {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "item_id")
	private Long id;

	private String name;    // 상품명

	private int price;    // 상품 가격

	private int stockQuantity;    // 상품 수량

	@Lob
	@Column(columnDefinition = "TEXT")
	private String description;    // 상품 설명

	public void reduceStock(int count) {
		if (stockQuantity < count) {
			throw new ServiceException("400-3", "재고가 충분하지 않습니다. 상품 수량을 확인하세요.");
		}
		stockQuantity -= count;
	}
}
