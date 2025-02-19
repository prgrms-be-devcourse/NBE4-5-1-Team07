package com.coffeebean.domain.user.user;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Embeddable
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class Address {

	@Column(length = 200)
	private String city;

	@Column(length = 200)
	private String street;

	@Column(length = 10)
	private String zipcode;
}