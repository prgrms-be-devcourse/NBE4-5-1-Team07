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
  const [products, setProducts] = useState<Product[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [street, setStreet] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [isMember, setIsMember] = useState(false); // 회원 여부 추가
  const router = useRouter();

  // localStorage에서 데이터 가져오기
  useEffect(() => {
    const storedProducts = localStorage.getItem("checkoutItems");

    if (storedProducts) {
      setProducts(JSON.parse(storedProducts));
    }
  }, []);

  // products 상태가 변경될 때마다 totalPrice 자동 계산
  useEffect(() => {
    const total = products.reduce(
      (sum, product) => sum + product.price * product.quantity,
      0
    );
    setTotalPrice(total);
  }, [products]);

  // 회원 정보 가져오기
  useEffect(() => {
    fetch("http://localhost:8080/api/my/info", {
      method: "GET",
      credentials: "include", // 쿠키 인증 정보 포함
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.code === "200-1") {
          setEmail(data.data.email);
          setCity(data.data.address.city);
          setStreet(data.data.address.street);
          setZipcode(data.data.address.zipcode);
          setIsMember(true); // 회원이면 true 설정
        }
      })
      .catch(() => {
        // 비회원이면 입력칸 유지 (isMember = false)
      });
  }, []);

  const handlePayment = () => {
    if (!email || !city || !street || !zipcode) {
      alert("모든 항목을 입력해주세요.");
      return;
    }

    alert("결제가 진행됩니다.");
    router.push("/orders/complete");
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
          disabled={isMember} // 회원이면 수정 불가
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
          placeholder="기본주소 (최대 20자)"
        />
        <input
          type="text"
          value={street}
          onChange={(e) => setStreet(e.target.value)}
          className="w-full p-2 border rounded mb-2"
          placeholder="상세주소 (최대 20자)"
        />
        <input
          type="text"
          value={zipcode}
          onChange={(e) => setZipcode(e.target.value.replace(/[^0-9]/g, ""))}
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
