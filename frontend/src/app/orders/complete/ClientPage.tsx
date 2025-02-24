"use client";

import { useEffect, useState } from "react";

export default function PaymentSuccessPage() {
  const [orderData, setOrderData] = useState<{
    items: { id: number; name: string; count: number; price: number }[];
    deliveryAddress: { city: string; street: string; zipcode: string };
    email: string;
    totalPrice: number;
  } | null>(null);

  useEffect(() => {
    // sessionStorage에서 주문 데이터 가져오기
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
        배송지: {orderData.deliveryAddress.city},{" "}
        {orderData.deliveryAddress.street}, {orderData.deliveryAddress.zipcode}
      </p>

      <div className="border-t pt-6">
        <h2 className="text-xl font-semibold text-gray-800">주문 내역</h2>
        {orderData.items.map((item, index) => (
          <div key={index} className="text-lg text-gray-600">
            <p>상품명: {item.name}</p>
            <p>수량: {item.count}개</p>
            <p>가격: {item.price.toLocaleString()}원</p>
            <hr className="my-2" />
          </div>
        ))}
      </div>

      <div className="border-t pt-6">
        <h2 className="text-xl font-semibold text-gray-800">총 결제 금액</h2>
        <p className="text-2xl font-bold text-green-600">
          {orderData.totalPrice.toLocaleString()}원
        </p>
      </div>
    </div>
  );
}
