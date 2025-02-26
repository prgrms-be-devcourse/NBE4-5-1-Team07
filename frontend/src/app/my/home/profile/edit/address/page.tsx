"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PencilIcon } from "@heroicons/react/24/outline"; // 연필 아이콘 추가

export default function ChangeAddressPage() {
  const [city, setCity] = useState("");
  const [street, setStreet] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [email, setEmail] = useState<string | null>(null); // 이메일 상태 추가
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // 현재 로그인된 유저 정보 불러오기
    fetch("http://localhost:8080/api/my/info", {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.data?.email) {
          setEmail(result.data.email);
        }
        if (result.data?.address) {
          setCity(result.data.address.city);
          setStreet(result.data.address.street);
          setZipcode(result.data.address.zipcode);
        }
      })
      .catch((error) => console.error("주소 불러오기 실패:", error));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      alert("로그인 정보를 불러오지 못했습니다.");
      return;
    }
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:8080/api/v1/users/modify/address",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email, // 현재 로그인된 이메일 포함
            city,
            street,
            zipcode,
          }),
        }
      );

      const result = await response.json();
      if (response.ok) {
        alert(result.msg);
        router.push("/my/home/profile/edit");
      } else {
        alert("주소 변경 실패: " + result.msg);
      }
    } catch (error) {
      console.error("주소 변경 오류:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
      {/* 아이콘과 제목을 함께 배치 */}
      <h1 className="text-2xl font-bold text-center mb-6 flex justify-center items-center gap-2">
        <PencilIcon className="w-6 h-6 text-gray-600" /> 주소 변경
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="w-full px-4 py-2 border rounded-md"
          placeholder="도시"
          required
        />
        <input
          type="text"
          value={street}
          onChange={(e) => setStreet(e.target.value)}
          className="w-full px-4 py-2 border rounded-md"
          placeholder="거리"
          required
        />
        <input
          type="text"
          value={zipcode}
          onChange={(e) => setZipcode(e.target.value)}
          className="w-full px-4 py-2 border rounded-md"
          placeholder="우편번호"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-md"
          disabled={loading || !email}
        >
          {loading ? "변경 중..." : "주소 변경"}
        </button>
      </form>
    </div>
  );
}
