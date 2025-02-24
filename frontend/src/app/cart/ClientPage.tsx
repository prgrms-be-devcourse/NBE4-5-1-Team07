"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

export default function Cart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const router = useRouter();

  const isLoggedIn = true; // 로그인 상태 확인 (실제로는 로그인 상태를 확인하는 로직을 추가해야 함)

  // 장바구니 데이터 가져오기
  useEffect(() => {
    if (isLoggedIn) {
      // 회원인 경우 API로 장바구니 가져오기
      fetch("http://localhost:8080/api/v1/carts", { credentials: "include" })
        .then((res) => res.json())
        .then((data) => {
          if (data.code === "200-1" && data.data) {
            setCartItems(data.data.items);
          }
        })
        .catch((error) => {
          console.error("장바구니 조회 실패", error);
          // API 실패 시 로컬 저장소에서 비회원 장바구니 데이터를 불러옴
          const savedCartItems = localStorage.getItem("cartItems");
          if (savedCartItems) {
            setCartItems(JSON.parse(savedCartItems));
          }
        });
    } else {
      // 비회원인 경우 localStorage에서 장바구니 데이터를 불러옴
      const savedCartItems = localStorage.getItem("cartItems");
      if (savedCartItems) {
        setCartItems(JSON.parse(savedCartItems));
      }
    }

    // localStorage에서 선택된 아이템 불러오기
    const savedSelectedItems = localStorage.getItem("selectedCartItems");
    if (savedSelectedItems) {
      setSelectedItems(JSON.parse(savedSelectedItems));
    }
  }, []);

  // 선택한 상품 업데이트 및 저장
  const toggleSelectItem = (id: number) => {
    setSelectedItems((prev) => {
      const updatedItems = prev.includes(id)
        ? prev.filter((i) => i !== id)
        : [...prev, id];

      localStorage.setItem("selectedCartItems", JSON.stringify(updatedItems));
      return updatedItems;
    });
  };

  // 결제 페이지로 이동
  const handleCheckout = () => {
    if (selectedItems.length === 0) return;

    // 선택한 상품 정보를 localStorage에 저장
    const selectedProducts = cartItems.filter((item) =>
      selectedItems.includes(item.id)
    );
    localStorage.setItem("checkoutItems", JSON.stringify(selectedProducts));

    router.push("/orders/payment");
  };

  // 장바구니 갱신
  const refreshCart = () => {
    if (isLoggedIn) {
      // 회원인 경우 API로 장바구니 갱신
      fetch("http://localhost:8080/api/v1/carts", { credentials: "include" })
        .then((res) => res.json())
        .then((data) => {
          if (data.code === "200-1" && data.data) {
            setCartItems(data.data.items);
            localStorage.setItem("cartItems", JSON.stringify(data.data.items));
          }
        });
    }
  };

  // 상품 수량 변경
  const handleQuantityChange = async (id: number, newQuantity: number) => {
    if (newQuantity < 1) return;

    if (isLoggedIn) {
      // 회원인 경우 API로 장바구니 수량 변경
      await fetch(`http://localhost:8080/api/v1/carts/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: newQuantity }),
        credentials: "include",
      });
      refreshCart();
    } else {
      // 비회원인 경우 로컬 저장소에서 수량 변경
      const updatedCartItems = cartItems.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      );
      setCartItems(updatedCartItems);
      localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
    }
  };

  // 상품 삭제
  const handleRemove = async (id: number) => {
    if (isLoggedIn) {
      // 회원인 경우 API로 상품 삭제
      await fetch(`http://localhost:8080/api/v1/carts/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      refreshCart();
    } else {
      // 비회원인 경우 로컬 저장소에서 상품 삭제
      const updatedCartItems = cartItems.filter((item) => item.id !== id);
      setCartItems(updatedCartItems);
      localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
    }
  };

  // 장바구니 전체 삭제
  const clearCart = async () => {
    if (confirm("정말 삭제하시겠습니까?")) {
      if (isLoggedIn) {
        // 회원인 경우 API로 전체 장바구니 삭제
        await fetch("http://localhost:8080/api/v1/carts", {
          method: "DELETE",
          credentials: "include",
        });
        setCartItems([]);
      } else {
        // 비회원인 경우 로컬 저장소에서 장바구니 삭제
        localStorage.removeItem("cartItems");
        localStorage.removeItem("selectedCartItems");
        setCartItems([]);
      }
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
                onChange={() => toggleSelectItem(item.id)}
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
          <button
            onClick={handleCheckout}
            className={`ml-4 px-4 py-2 rounded ${
              selectedItems.length > 0
                ? "bg-blue-500 hover:bg-blue-600 text-white"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
            disabled={selectedItems.length === 0}
          >
            결제하기
          </button>
        </div>
      )}
    </div>
  );
}
