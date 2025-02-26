"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ShoppingCartIcon, CurrencyYenIcon, MapPinIcon, EnvelopeIcon, CreditCardIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";

interface Product {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

export default function PaymentPage() {
  const [cartOrder, setCartOrder] = useState<boolean>(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [street, setStreet] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [isMember, setIsMember] = useState(false);
  const [stockMap, setStockMap] = useState<{ [key: number]: number }>({});
  const [totalPoints, setTotalPoints] = useState(0);
  const [usedPoints, setUsedPoints] = useState(0);
  const [finalPrice, setFinalPrice] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const storedProducts = localStorage.getItem("checkoutItems");
    const storedCartOrder = localStorage.getItem("cartOrder");

    if (storedProducts) setProducts(JSON.parse(storedProducts));
    if (storedCartOrder === "true") setCartOrder(true);
  }, []);

  useEffect(() => {
    const total = products.reduce(
      (sum, product) => sum + product.price * product.quantity,
      0
    );
    setTotalPrice(total);
  }, [products]);

  useEffect(() => {
    fetch("http://localhost:8080/api/my/info", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (data.code === "200-1") {
          setEmail(data.data.email);
          setCity(data.data.address.city);
          setStreet(data.data.address.street);
          setZipcode(data.data.address.zipcode);
          setTotalPoints(data.data.totalPoints);
          setIsMember(true);
        }
      })
      .catch(() => {});
  }, []);

  // 각 상품의 재고량 조회
  useEffect(() => {
    const fetchStock = async () => {
      const stockData: { [key: number]: number } = {};
      await Promise.all(
        products.map(async (product) => {
          try {
            const res = await fetch(
              `http://localhost:8080/api/v1/items/${product.id}`
            );
            const data = await res.json();
            if (res.ok) {
              stockData[product.id] = data.data.stockQuantity;
            } else {
              stockData[product.id] = 0; // 오류 발생 시 기본값 0 설정
            }
          } catch (error) {
            stockData[product.id] = 0;
          }
        })
      );
      setStockMap(stockData);
    };

    if (products.length > 0) {
      fetchStock();
    }
  }, [products]);

  useEffect(() => {
    setFinalPrice(totalPrice - usedPoints);
  }, [totalPrice, usedPoints]);

  const handleUsedPoints = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = Number(e.target.value.replace(/[^0-9]/g, ""));
    value = Math.min(value, totalPoints, totalPrice);
    setUsedPoints(value);
  };

  const handlePayment = async () => {
    if (!email || !city || !street || !zipcode) {
      alert("모든 항목을 입력해주세요.");
      return;
    }

    const orderData = {
      cartOrder,
      email,
      address: { city, street, zipcode },
      items: products.map(({ id, quantity }) => ({ id, count: quantity })),
      point: usedPoints,
    };

    try {
      const response = await fetch("http://localhost:8080/api/v1/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(orderData),
      });

      const result = await response.json();
      if (response.ok) {
        alert("결제가 완료되었습니다.");
        localStorage.removeItem("selectedCartItems");
        sessionStorage.setItem("orderData", JSON.stringify(result.data));
        router.push(`/orders/complete`);
      } else {
        alert(result.msg || "결제 실패");
      }
    } catch {
      alert("결제 처리 중 오류가 발생했습니다.");
    }
  };

  return (
      <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow-xl"
      >
        <h1 className="text-3xl font-bold flex items-center gap-3 mb-8 text-blue-600">
          <CreditCardIcon className="h-8 w-8" />
          결제 진행
        </h1>

        {/* 상품 목록 섹션 */}
        <motion.div
            initial={{ x: -20 }}
            animate={{ x: 0 }}
            className="mb-8 bg-gray-50 p-6 rounded-xl"
        >
          <h3 className="text-xl font-semibold flex items-center gap-2 mb-4">
            <ShoppingCartIcon className="h-6 w-6" />
            주문 상품
          </h3>
          <div className="space-y-4">
            {products.map((product) => {
              const stock = stockMap[product.id] ?? 0;
              const isOutOfStock = product.quantity > stock;

              return (
                  <div
                      key={product.id}
                      className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
                  >
                    <span className="font-medium">{product.name}</span>
                    <div className="flex items-center gap-4">
                  <span className="text-gray-600">
                    {product.price.toLocaleString()}원
                  </span>
                      <div className="flex items-center gap-2">
                    <span className="text-sm bg-gray-100 px-2 py-1 rounded">
                      {product.quantity}개
                    </span>
                        <div
                            className={`flex items-center gap-1 text-sm ${
                                isOutOfStock ? "text-red-600" : "text-gray-500"
                            }`}
                        >
                          <ExclamationTriangleIcon className="h-4 w-4" />
                          <span>{stock}개 남음</span>
                        </div>
                      </div>
                    </div>
                  </div>
              );
            })}
          </div>
        </motion.div>

        {/* 가격 정보 섹션 */}
        <motion.div
            initial={{ x: 20 }}
            animate={{ x: 0 }}
            className="mb-8 bg-blue-50 p-6 rounded-xl"
        >
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
            <span className="flex items-center gap-2">
              <CurrencyYenIcon className="h-5 w-5" />
              총 상품 금액
            </span>
              <span className="text-lg font-semibold">
              {totalPrice.toLocaleString()}원
            </span>
            </div>

            {isMember && (
                <div className="flex flex-col gap-2">
                  <label className="flex items-center gap-2">
                    <span className="text-sm">적립금 사용</span>
                    <span className="text-xs text-gray-500">
                  (보유: {totalPoints.toLocaleString()}원)
                </span>
                  </label>
                  <div className="relative">
                    <input
                        type="text"
                        value={usedPoints.toLocaleString()}
                        onChange={handleUsedPoints}
                        className="w-full pl-8 pr-4 py-2 border rounded-lg bg-white"
                        placeholder="사용할 금액 입력"
                    />
                    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400">
                  ₩
                </span>
                  </div>
                </div>
            )}

            <div className="border-t pt-4">
              <div className="flex justify-between items-center">
                <span className="font-bold">최종 결제 금액</span>
                <span className="text-2xl font-bold text-blue-600">
                {finalPrice.toLocaleString()}원
              </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 주문 정보 입력 섹션 */}
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-8 bg-gray-50 p-6 rounded-xl"
        >
          <h3 className="text-xl font-semibold flex items-center gap-2 mb-4">
            <MapPinIcon className="h-6 w-6" />
            배송 정보
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">이메일</label>
              <div className="relative">
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-8 pr-4 py-2 border rounded-lg"
                    disabled={isMember}
                />
                <EnvelopeIcon className="h-4 w-4 absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">기본주소</label>
                <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg"
                    placeholder="시/도"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">상세주소</label>
                <input
                    type="text"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg"
                    placeholder="상세 주소"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">우편번호</label>
                <input
                    type="text"
                    value={zipcode}
                    onChange={(e) => setZipcode(e.target.value.replace(/[^0-9]/g, ""))}
                    className="w-full px-4 py-2 border rounded-lg"
                    placeholder="우편번호"
                    maxLength={5}
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* 결제 버튼 */}
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handlePayment}
            className="w-full bg-blue-600 text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors"
        >
          <CreditCardIcon className="h-6 w-6" />
          {finalPrice.toLocaleString()}원 결제하기
        </motion.button>
      </motion.div>
  );
}