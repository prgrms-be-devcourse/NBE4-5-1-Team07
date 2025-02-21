"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ClientPage() {
  const [form, setForm] = useState({
    name: "",
    price: "",
    stockQuantity: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // 입력 값 변경 핸들러
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 상품 등록 요청
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // 데이터 변환 (price와 stockQuantity를 숫자로 변환)
    const formattedData = {
      name: form.name,
      price: Number(form.price),
      stockQuantity: Number(form.stockQuantity),
      description: form.description,
    };

    try {
      const response = await fetch("http://localhost:8080/api/v1/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formattedData),
      });

      if (!response.ok) {
        throw new Error("상품 등록에 실패했습니다.");
      }

      alert("상품이 성공적으로 등록되었습니다!");

      // 입력 필드 초기화 후 목록 페이지로 이동
      setForm({ name: "", price: "", stockQuantity: "", description: "" });
      router.push("/admin/modifyItems");
    } catch (error) {
      console.error("상품 등록 중 오류 발생:", error);
      setError("상품 등록 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">상품 등록</h1>
      <form
        onSubmit={handleSubmit}
        className="p-6 border rounded-lg flex flex-col gap-4 bg-white shadow-md"
      >
        <input
          name="name"
          placeholder="상품명"
          value={form.name}
          onChange={handleChange}
          className="border p-3 rounded"
          required
        />
        <input
          name="price"
          type="number"
          placeholder="가격"
          value={form.price}
          onChange={handleChange}
          className="border p-3 rounded"
          required
        />
        <input
          name="stockQuantity"
          type="number"
          placeholder="재고"
          value={form.stockQuantity}
          onChange={handleChange}
          className="border p-3 rounded"
          required
        />
        <input
          name="description"
          placeholder="설명"
          value={form.description}
          onChange={handleChange}
          className="border p-3 rounded"
          required
        />
        {error && <p className="text-red-500">{error}</p>}
        <button
          type="submit"
          className={`bg-blue-500 text-white p-3 rounded ${
            loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"
          }`}
          disabled={loading}
        >
          {loading ? "등록 중..." : "등록"}
        </button>
      </form>
    </div>
  );
}
