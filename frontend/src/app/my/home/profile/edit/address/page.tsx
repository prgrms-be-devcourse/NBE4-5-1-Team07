"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ChangeAddressPage() {
  const [city, setCity] = useState("");
  const [street, setStreet] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // 기존 주소를 API로 불러오기 (예제 API)
    fetch("http://localhost:8080/api/my/info", {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((result) => {
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
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:8080/api/v1/users/modify/address",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: "example@exam.com",
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
    <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold text-center mb-6">주소 변경</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="w-full px-4 py-2 border rounded-md"
          placeholder={city || "도시"}
          onFocus={() => setCity("")}
          required
        />
        <input
          type="text"
          value={street}
          onChange={(e) => setStreet(e.target.value)}
          className="w-full px-4 py-2 border rounded-md"
          placeholder={street || "거리"}
          onFocus={() => setStreet("")}
          required
        />
        <input
          type="text"
          value={zipcode}
          onChange={(e) => setZipcode(e.target.value)}
          className="w-full px-4 py-2 border rounded-md"
          placeholder={zipcode || "우편번호"}
          onFocus={() => setZipcode("")}
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-md"
          disabled={loading}
        >
          {loading ? "변경 중..." : "주소 변경"}
        </button>
      </form>
    </div>
  );
}
