"use client";

import { useEffect, useState } from "react";

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

  // 장바구니 조회 API 연동은 쿠키로 authToken 전달 필요
  /*
  //const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // API 요청을 위한 authToken
  const authToken =
    "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJleGFtcGxlQGV4YW0uY29tIiwiaWF0IjoxNzQwMTAxODYzLCJleHAiOjE3NDAxODgyNjN9._GSZpw5wIYr9QsxLgBjRe0OsnyY6BBEbXzlxm3Inv1A";

  // 장바구니 데이터 불러오기
  useEffect(() => {
    fetch("http://localhost:8080/api/v1/carts", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${authToken}`, // 인증 토큰 추가
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.code === "200-1") {
          setCartItems(data.data.items);
        } else {
          console.error("장바구니 조회 실패:", data.msg);
        }
      })
      .catch((err) =>
        console.error("장바구니 데이터를 불러오는 중 오류 발생:", err)
      );
  }, []);
*/

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
          <button
            disabled={selectedItems.length === 0}
            className={`ml-4 px-4 py-2 rounded ${
              selectedItems.length > 0
                ? "bg-blue-500 hover:bg-blue-600 text-white"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            결제하기
          </button>
        </div>
      )}
    </div>
  );
}
