package com.zosh.request;

import com.zosh.domain.OrderType;

import com.zosh.model.Coin;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class CreateOrderRequest {
	private String coinId;
	private double quantity;
	private OrderType orderType;

	public String getCoinId() {
		return coinId;
	}

	public void setCoinId(String coinId) {
		this.coinId = coinId;
	}

	public double getQuantity() {
		return quantity;
	}

	public void setQuantity(double quantity) {
		this.quantity = quantity;
	}

	public OrderType getOrderType() {
		return orderType;
	}

	public void setOrderType(OrderType orderType) {
		this.orderType = orderType;
	}

}
