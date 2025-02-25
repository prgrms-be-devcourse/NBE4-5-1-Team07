"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

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
  const [isProcessing, setIsProcessing] = useState(false); // ✅ 결제 진행 상태 추가
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

    setIsProcessing(true); // ✅ 결제 진행 중 상태 활성화

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
    } finally {
      setIsProcessing(false); // ✅ 결제 진행 상태 해제
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4">결제</h2>

      {/* 상품 목록 */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">상품 목록</h3>
        {products.map((product) => {
          const stock = stockMap[product.id] ?? 0; // 기본값 0
          const isOutOfStock = product.quantity > stock; // 초과 여부

          return (
            <div key={product.id} className="flex justify-between p-2 border-b">
              <span>{product.name}</span>
              <span>
                {product.price.toLocaleString()}원{" "}
                <span className="text-gray-500">({product.quantity}개)</span>
                {"   "}
                <span
                  className={
                    isOutOfStock
                      ? "text-red-600 font-bold text-sm ml-2"
                      : "text-gray-600 text-sm ml-2"
                  }
                >
                  {stock}개 남음
                </span>
              </span>
            </div>
          );
        })}
      </div>

      {/* 총 가격 & 적립금 */}
      <div className="flex justify-between items-center mb-6">
        <span className="text-lg font-semibold">
          총 가격: {totalPrice.toLocaleString()}원
        </span>
        {isMember && (
          <div className="text-right">
            <span className="block text-sm text-gray-600">
              보유 적립금: {totalPoints.toLocaleString()}원
            </span>
            <input
              type="text"
              value={usedPoints.toLocaleString()}
              onChange={handleUsedPoints}
              className="w-32 p-1 border rounded text-right"
              placeholder="사용할 적립금"
            />
          </div>
        )}
      </div>

      {/* 최종 결제 금액 */}
      <div className="text-lg font-semibold mb-6">
        결제 금액: {finalPrice.toLocaleString()}원
      </div>

      {/* 주문자 정보 입력 */}
      <div className="mb-4">
        <label className="block font-semibold mb-1">이메일</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded"
          disabled={isMember}
        />
      </div>

      {/* 배송지 입력 */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">배송지 정보</h3>
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="w-full p-2 border rounded mb-2"
          placeholder="기본주소"
        />
        <input
          type="text"
          value={street}
          onChange={(e) => setStreet(e.target.value)}
          className="w-full p-2 border rounded mb-2"
          placeholder="상세주소"
        />
        <input
          type="text"
          value={zipcode}
          onChange={(e) => setZipcode(e.target.value.replace(/[^0-9]/g, ""))}
          className="w-full p-2 border rounded"
          placeholder="우편번호"
        />
      </div>

      <div className="flex justify-between items-center mb-6">
        <span className="text-lg font-semibold">
          * 당일 오후 2시 이후의 주문은 다음날 배송을 시작합니다.
        </span>
      </div>

      {/* 결제 버튼 */}
      <button
        onClick={handlePayment}
        className={`w-full text-white p-3 rounded-lg transition ${
          isProcessing
            ? "bg-gray-500 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
        disabled={isProcessing} // ✅ 결제 중이면 버튼 비활성화
      >
        {isProcessing ? "결제 중..." : "결제하기"}
      </button>
    </div>
  );
}
