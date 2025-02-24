"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

export default function Cart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  // 장바구니 데이터 가져오기
  useEffect(() => {
    fetch("http://localhost:8080/api/v1/carts", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (data.code === "200-1" && data.data) {
          setCartItems(data.data.items);
        }
      })
      .catch((error) => console.error("장바구니 조회 실패", error));
  }, []);

  // 장바구니 갱신
  const refreshCart = () => {
    fetch("http://localhost:8080/api/v1/carts", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (data.code === "200-1" && data.data) {
          setCartItems(data.data.items);
        }
      });
  };

  // 상품 수량 변경
  const handleQuantityChange = async (id: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    await fetch(`http://localhost:8080/api/v1/carts/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity: newQuantity }),
      credentials: "include",
    });
    refreshCart();
  };

  // 상품 삭제
  const handleRemove = async (id: number) => {
    await fetch(`http://localhost:8080/api/v1/carts/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    refreshCart();
  };

  // 장바구니 전체 삭제
  const clearCart = async () => {
    if (confirm("정말 삭제하시겠습니까?")) {
      await fetch("http://localhost:8080/api/v1/carts", {
        method: "DELETE",
        credentials: "include",
      });
      setCartItems([]);
      setSelectedItems([]);
    }
  };

  // 총 가격 계산
  const totalPrice = cartItems
    .filter((item) => selectedItems.includes(item.id))
    .reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">장바구니</h1>
        <button onClick={clearCart} className="text-red-500 hover:text-red-700">
          전체 삭제
        </button>
      </div>

      {cartItems.length === 0 ? (
        <p className="text-gray-500">장바구니가 비어 있습니다.</p>
      ) : (
        <ul className="space-y-4">
          {cartItems.map((item) => (
            <li
              key={item.id}
              className="flex items-center p-4 border rounded-lg shadow-md gap-4"
            >
              <input
                type="checkbox"
                checked={selectedItems.includes(item.id)}
                onChange={() =>
                  setSelectedItems((prev) =>
                    prev.includes(item.id)
                      ? prev.filter((i) => i !== item.id)
                      : [...prev, item.id]
                  )
                }
                className="w-5 h-5"
              />
              <div className="flex-1">
                <p className="font-semibold">{item.name}</p>
                <p className="text-gray-500">{item.price.toLocaleString()}원</p>
              </div>
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

      {cartItems.length > 0 && (
        <div className="mt-6 p-4 border-t text-right font-semibold text-lg">
          총 가격:{" "}
          <span className="text-blue-600">{totalPrice.toLocaleString()}원</span>
          <Link href="/orders/complete">
            <button
              className={`ml-4 px-4 py-2 rounded ${
                selectedItems.length > 0
                  ? "bg-blue-500 hover:bg-blue-600 text-white"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
              disabled={selectedItems.length === 0}
            >
              결제하기
            </button>
          </Link>
        </div>
      )}
    </div>
  );
}
