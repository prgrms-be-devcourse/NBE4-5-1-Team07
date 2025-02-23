"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

export default function ClientLayout() {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    { id: 1, name: "상품 A", price: 10000, quantity: 1 },
    { id: 2, name: "상품 B", price: 20000, quantity: 2 },
    { id: 3, name: "상품 C", price: 30000, quantity: 1 },
  ]);

  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  // 개별 상품 선택/해제 핸들러
  const toggleSelection = (id: number) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  // 장바구니 전체 삭제 (확인 창 추가)
  const clearCart = () => {
    const confirmed = window.confirm("정말 삭제하시겠습니까?");
    if (confirmed) {
      setCartItems([]);
      setSelectedItems([]);
    }
  };

  // 수량 변경 핸들러
  const handleQuantityChange = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    setCartItems(
      cartItems.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  // 아이템 삭제 핸들러
  const handleRemove = (id: number) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
    setSelectedItems(selectedItems.filter((itemId) => itemId !== id));
  };

  // 선택된 상품들의 총 가격 계산
  const totalPrice = cartItems
    .filter((item) => selectedItems.includes(item.id))
    .reduce((sum, item) => sum + item.price * item.quantity, 0);

  // 결제하기 버튼 클릭 시 세션 스토리지에 데이터 저장
  const handleCheckout = () => {
    const selectedProducts = cartItems.filter((item) =>
      selectedItems.includes(item.id)
    );
    if (selectedProducts.length === 0) {
      alert("선택된 상품이 없습니다.");
      return;
    }

    const orderData = {
      items: selectedProducts.map((item) => ({
        itemId: item.id,
        count: item.quantity,
      })),
      address: {
        city: "서울",
        street: "강남대로 123",
        zipcode: "12345",
      },
      email: "user@example.com",
      totalAmount: totalPrice, // 총 가격을 세션 스토리지에 저장
    };

    sessionStorage.setItem("orderData", JSON.stringify(orderData));
  };

  return (
    <div className="p-4">
      {/* 장바구니 헤더 */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">장바구니</h1>
        <button onClick={clearCart} className="text-red-500 hover:text-red-700">
          전체 삭제
        </button>
      </div>

      {/* 장바구니 아이템 리스트 */}
      {cartItems.length === 0 ? (
        <p className="text-gray-500">장바구니가 비어 있습니다.</p>
      ) : (
        <ul className="space-y-4">
          {cartItems.map((item) => (
            <li
              key={item.id}
              className="flex items-center p-4 border rounded-lg shadow-md gap-4"
            >
              {/* 체크박스 */}
              <input
                type="checkbox"
                checked={selectedItems.includes(item.id)}
                onChange={() => toggleSelection(item.id)}
                className="w-5 h-5"
              />
              {/* 상품 정보 */}
              <div className="flex-1">
                <p className="font-semibold">{item.name}</p>
                <p className="text-gray-500">{item.price.toLocaleString()}원</p>
              </div>
              {/* 수량 조절 */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() =>
                    handleQuantityChange(item.id, item.quantity - 1)
                  }
                  className="px-2 py-1 border rounded bg-gray-200 hover:bg-gray-300"
                >
                  ▼
                </button>
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) =>
                    handleQuantityChange(item.id, Number(e.target.value))
                  }
                  className="w-12 text-center border rounded"
                  min="1"
                />
                <button
                  onClick={() =>
                    handleQuantityChange(item.id, item.quantity + 1)
                  }
                  className="px-2 py-1 border rounded bg-gray-200 hover:bg-gray-300"
                >
                  ▲
                </button>
              </div>
              {/* 삭제 버튼 */}
              <button
                onClick={() => handleRemove(item.id)}
                className="text-red-500 hover:text-red-700 ml-4"
              >
                삭제
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* 합산 가격 & 결제하기 버튼 */}
      {cartItems.length > 0 && (
        <div className="mt-6 p-4 border-t text-right font-semibold text-lg">
          총 가격:{" "}
          <span className="text-blue-600">{totalPrice.toLocaleString()}원</span>
          <Link href="/orders/complete">
            <button
              onClick={handleCheckout}
              disabled={selectedItems.length === 0}
              className={`ml-4 px-4 py-2 rounded ${
                selectedItems.length > 0
                  ? "bg-blue-500 hover:bg-blue-600 text-white"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              결제하기
            </button>
          </Link>
        </div>
      )}
    </div>
  );
}
