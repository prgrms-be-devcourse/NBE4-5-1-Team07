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
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await fetch("/api/v1/items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (response.ok) {
      setForm({ name: "", price: "", stockQuantity: "", description: "" });
      router.push("/items");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">상품 등록</h1>
      <form
        onSubmit={handleSubmit}
        className="p-4 border rounded flex flex-col gap-2"
      >
        <input
          name="name"
          placeholder="상품명"
          value={form.name}
          onChange={handleChange}
          className="border p-2"
          required
        />
        <input
          name="price"
          type="number"
          placeholder="가격"
          value={form.price}
          onChange={handleChange}
          className="border p-2"
          required
        />
        <input
          name="stockQuantity"
          type="number"
          placeholder="재고"
          value={form.stockQuantity}
          onChange={handleChange}
          className="border p-2"
          required
        />
        <input
          name="description"
          placeholder="설명"
          value={form.description}
          onChange={handleChange}
          className="border p-2"
          required
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          등록
        </button>
      </form>
    </div>
  );
}
