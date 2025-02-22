"use client";

import { useEffect, useState } from "react";

export default function PaymentSuccessPage() {
  const [orderData, setOrderData] = useState<{
    items: { itemId: number; count: number }[];
    address: { city: string; street: string; zipcode: string };
    email: string;
    totalAmount: number | null;
  } | null>(null);

  useEffect(() => {
    // 세션 스토리지에서 주문 데이터 가져오기
    const storedOrderData = sessionStorage.getItem("orderData");
    if (!storedOrderData) {
      alert("유효하지 않은 접근입니다.");
      window.location.href = "/"; // 메인 페이지로 리디렉트
      return;
    }

    const parsedOrderData = JSON.parse(storedOrderData);
    setOrderData({
      ...parsedOrderData,
      totalAmount: null, // 초기에는 총 결제 금액을 null로 설정
    });

    // 상품 가격을 가져와서 총 결제 금액 계산
    async function fetchTotalPrice() {
      let total = 0;
      for (const item of parsedOrderData.items) {
        try {
          const response = await fetch(
            `http://localhost:80080/api/v1/items/${item.itemId}`
          );
          const data = await response.json();
          total += data.price * item.count;
        } catch (error) {
          console.error("상품 가격 조회 실패", error);
        }
      }
      setOrderData((prev) => prev && { ...prev, totalAmount: total });
    }

    fetchTotalPrice();
  }, []);

  if (!orderData) return null;

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md space-y-4">
      <h1 className="text-2xl font-bold text-center">결제 완료</h1>
      <p className="text-gray-700">주문자 이메일: {orderData.email}</p>
      <p className="text-gray-700">
        배송지: {orderData.address.city}, {orderData.address.street},{" "}
        {orderData.address.zipcode}
      </p>

      <div className="border-t pt-4">
        <h2 className="text-lg font-semibold">주문 내역</h2>
        {orderData.items.map((item, index) => (
          <p key={index} className="text-gray-600">
            상품 {item.itemId}: {item.count}개
          </p>
        ))}
      </div>

      <div className="border-t pt-4">
        <h2 className="text-lg font-semibold">총 결제 금액</h2>
        {orderData.totalAmount !== null ? (
          <p className="text-xl font-bold text-green-600">
            {orderData.totalAmount.toLocaleString()}원
          </p>
        ) : (
          <p className="text-gray-500">가격 계산 중...</p>
        )}
      </div>
    </div>
  );
}
