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
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4">결제</h2>

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
