"use client";

import { useEffect, useState } from "react";

export default function PaymentSuccessPage() {
  const [orderData, setOrderData] = useState<{
    items: { itemId: number; count: number }[];
    address: { city: string; street: string; zipcode: string };
    email: string;
    totalAmount: number;
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
    setOrderData(parsedOrderData); // 세션에서 불러온 데이터 그대로 사용
  }, []);

  if (!orderData) return null;

  return (
    <div className="p-8 max-w-4xl mx-auto bg-white rounded-xl shadow-lg space-y-6 pt-8">
      <h1 className="text-3xl font-bold text-center text-gray-800">
        결제 완료
      </h1>
      <p className="text-lg text-gray-700">주문자 이메일: {orderData.email}</p>
      <p className="text-lg text-gray-700">
        배송지: {orderData.address.city}, {orderData.address.street},{" "}
        {orderData.address.zipcode}
      </p>

      <div className="border-t pt-6">
        <h2 className="text-xl font-semibold text-gray-800">주문 내역</h2>
        {orderData.items.map((item, index) => (
          <p key={index} className="text-lg text-gray-600">
            상품 {item.itemId}: {item.count}개
          </p>
        ))}
      </div>

      <div className="border-t pt-6">
        <h2 className="text-xl font-semibold text-gray-800">총 결제 금액</h2>
        <p className="text-2xl font-bold text-green-600">
          {orderData.totalAmount.toLocaleString()}원
        </p>
      </div>
    </div>
  );
}
