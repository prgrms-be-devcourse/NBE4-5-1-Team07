"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { TrashIcon, PlusIcon, MinusIcon } from "@heroicons/react/24/outline";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

export default function Cart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(true); // 로그인 상태를 useState로 관리
  const router = useRouter();

  // 장바구니 데이터 가져오기
  useEffect(() => {
    if (isLoggedIn) {
      // 회원인 경우 API로 장바구니 가져오기
      fetch("http://localhost:8080/api/v1/carts", { credentials: "include" })
        .then((res) => {
          if (res.status === 401) {
            throw new Error("Unauthorized");
          }
          return res.json();
        })
        .then((data) => {
          if (data.code === "200-1" && data.data) {
            setCartItems(data.data.items);
          }
        })
        .catch((error) => {
          console.error("장바구니 조회 실패", error);
          // 401 에러가 발생하면 로컬 저장소에서 비회원 장바구니 데이터를 불러오기
          const savedCartItems = localStorage.getItem("cartItems");
          if (savedCartItems) {
            setCartItems(JSON.parse(savedCartItems));
          }
          setIsLoggedIn(false); // 로그인 실패 시 상태를 false로 설정
        });
    } else {
      // 비회원인 경우 localStorage에서 장바구니 데이터를 불러옴
      const savedCartItems = localStorage.getItem("cartItems");
      if (savedCartItems) {
        setCartItems(JSON.parse(savedCartItems));
      }
      setIsLoggedIn(false); // 로그인 실패 시 상태를 false로 설정
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
    localStorage.setItem("cartOrder", "true");

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
      <div className="p-6 max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl font-bold flex items-center gap-2"
          >
            🛍️ 내 장바구니
          </motion.h1>
          <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={clearCart}
              className="flex items-center gap-1 text-red-500 hover:text-red-700"
          >
            <TrashIcon className="h-5 w-5" />
            <span>전체 비우기</span>
          </motion.button>
        </div>

        <AnimatePresence>
          {cartItems.length === 0 ? (
              <motion.div
                  key="empty-cart"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-20 space-y-4"
              >
                <div className="text-6xl">🛒</div>
                <p className="text-gray-500 text-lg">장바구니가 비어있어요</p>
              </motion.div>
          ) : (
              <ul className="space-y-3">
                <AnimatePresence>
                  {cartItems.map((item) => (
                      <motion.li
                          key={item.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          className="p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center gap-4">
                          <motion.div
                              whileHover={{ scale: 1.05 }}
                              className="flex items-center"
                          >
                            <input
                                type="checkbox"
                                checked={selectedItems.includes(item.id)}
                                onChange={() => toggleSelectItem(item.id)}
                                className="hidden"
                                id={`checkbox-${item.id}`}
                            />
                            <label
                                htmlFor={`checkbox-${item.id}`}
                                className={`w-6 h-6 rounded-md border-2 flex items-center justify-center cursor-pointer transition-colors
                          ${selectedItems.includes(item.id)
                                    ? 'bg-blue-500 border-blue-500'
                                    : 'bg-white border-gray-300'}`}
                            >
                              {selectedItems.includes(item.id) && (
                                  <CheckCircleIcon className="h-4 w-4 text-white" />
                              )}
                            </label>
                          </motion.div>

                          <div className="flex-1">
                            <h3 className="font-semibold text-lg">{item.name}</h3>
                            <p className="text-gray-600">
                              {item.price.toLocaleString()}원
                            </p>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="flex items-center border rounded-full bg-gray-50">
                              <motion.button
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                  className="p-2 hover:bg-gray-200 rounded-l-full"
                              >
                                <MinusIcon className="h-4 w-4" />
                              </motion.button>
                              <input
                                  type="number"
                                  value={item.quantity}
                                  onChange={(e) =>
                                      handleQuantityChange(item.id, Number(e.target.value))
                                  }
                                  className="w-12 text-center bg-transparent focus:outline-none"
                                  min="1"
                              />
                              <motion.button
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                  className="p-2 hover:bg-gray-200 rounded-r-full"
                              >
                                <PlusIcon className="h-4 w-4" />
                              </motion.button>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                onClick={() => handleRemove(item.id)}
                                className="text-red-400 hover:text-red-600 p-2"
                            >
                              <TrashIcon className="h-5 w-5" />
                            </motion.button>
                          </div>
                        </div>
                      </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
          )}
        </AnimatePresence>

        {cartItems.length > 0 && (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="sticky bottom-0 bg-white border-t mt-6 p-4 shadow-lg rounded-xl"
            >
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <div className="text-gray-600">총 선택 상품 {selectedItems.length}개</div>
                  <div className="text-2xl font-bold text-blue-600">
                    {totalPrice.toLocaleString()}원
                  </div>
                </div>
                <motion.button
                    whileHover={{ scale: 1.03 }}
                    onClick={handleCheckout}
                    className={`px-6 py-3 rounded-xl text-lg font-semibold transition-all flex items-center gap-2
                ${selectedItems.length > 0
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                    disabled={selectedItems.length === 0}
                >
                  💳 결제 진행하기
                </motion.button>
              </div>
            </motion.div>
        )}
      </div>
  );
}