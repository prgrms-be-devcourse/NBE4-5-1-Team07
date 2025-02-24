package com.coffeebean.domain.order.order.dto;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;

@Getter(AccessLevel.PUBLIC)
@Setter
public class OrderCreateRequest {
	private List<OrderItemBody> items;
	private AddressBody address;
	@NotBlank(message = "이메일은 필수입니다.") @Email(message = "잘못된 이메일 형식입니다.")
	private String email;
	@JsonProperty("cartOrder")
	private Boolean cartOrder;

	@Getter(AccessLevel.PUBLIC)
	@Setter
	static class OrderItemBody {
		@NotNull(message = "상품 ID는 필수입니다.")
		private Long id;
		@Min(value = 1, message = "수량은 1개 이상입니다.")
		private int count;
	}

	@Getter(AccessLevel.PUBLIC)
	@Setter
	public static class AddressBody {
		@NotBlank(message = "배송지 주소 도시명은 필수입니다.")
		private String city;
		@NotBlank(message = "배송지 주소 상세주소는 필수입니다.")
		private String street;
		@NotBlank(message = "배송지 주소 우편번호는 필수입니다.")
		private String zipcode;
	}

	public Map<Long, Integer> getItems() {
		return items.stream().collect(Collectors.toMap(OrderItemBody::getId, OrderItemBody::getCount));
	}
}