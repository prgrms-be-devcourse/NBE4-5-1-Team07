package com.coffeebean.domain.user.user.dto;

import com.coffeebean.domain.user.user.Address;
import com.coffeebean.domain.user.user.enitity.User;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserInfoResponse {
	private String name;
	private String email;
	private Address address;
	private int totalPoints;

	public UserInfoResponse(User actor) {
		this.name = actor.getName();
		this.email = actor.getEmail();
		this.address = actor.getAddress();
		this.totalPoints = actor.getTotalPoints();
	}
}
