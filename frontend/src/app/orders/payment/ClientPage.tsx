"use client";

import { useState } from "react";

export default function PaymentPage() {
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [street, setStreet] = useState("");
  const [zipcode, setZipcode] = useState("");

  // 예시 상품 데이터
  const products = [
    { id: 1, name: "상품 A", price: 10000, quantity: 2 },
    { id: 2, name: "상품 B", price: 20000, quantity: 1 },
  ];

  // 총 가격 계산
  const totalPrice = products.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handlePayment = () => {
    if (!email || !city || !street || !zipcode) {
      alert("모든 항목을 입력해주세요.");
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      alert("올바른 이메일 형식을 입력해주세요.");
      return;
    }

    if (zipcode.length !== 5) {
      alert("우편번호는 5자리 숫자로 입력해야 합니다.");
      return;
    }

    alert("결제가 진행됩니다.");
  };

  const handleCityChange = (e) => {
    if (e.target.value.length <= 20) {
      setCity(e.target.value);
    }
  };

  const handleStreetChange = (e) => {
    if (e.target.value.length <= 20) {
      setStreet(e.target.value);
    }
  };

  const handleZipcodeChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    if (value.length <= 5) {
      setZipcode(value);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4">결제 페이지</h2>

      {/* 상품 목록 */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">상품 목록</h3>
        {products.map((product) => (
          <div key={product.id} className="flex justify-between p-2 border-b">
            <span>{product.name}</span>
            <span>
              {product.price.toLocaleString()}원{" "}
              <span className="text-gray-500">({product.quantity}개)</span>
            </span>
          </div>
        ))}
      </div>

      {/* 총 가격 */}
      <div className="text-lg font-semibold mb-6">
        총 가격: {totalPrice.toLocaleString()}원
      </div>

      {/* 주문자 정보 입력 */}
      <div className="mb-4">
        <label className="block font-semibold mb-1">이메일</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="이메일 입력"
        />
      </div>

      {/* 배송지 입력 */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">배송지 정보</h3>
        <input
          type="text"
          value={city}
          onChange={handleCityChange}
          className="w-full p-2 border rounded mb-2"
          placeholder="기본주소 (최대 20자)"
        />
        <input
          type="text"
          value={street}
          onChange={handleStreetChange}
          className="w-full p-2 border rounded mb-2"
          placeholder="상세주소 (최대 20자)"
        />
        <input
          type="text"
          value={zipcode}
          onChange={handleZipcodeChange}
          className="w-full p-2 border rounded"
          placeholder="우편번호 (숫자 5자리)"
        />
      </div>

      {/* 결제 버튼 */}
      <button
        onClick={handlePayment}
        className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition"
      >
        결제하기
      </button>
    </div>
  );
}
