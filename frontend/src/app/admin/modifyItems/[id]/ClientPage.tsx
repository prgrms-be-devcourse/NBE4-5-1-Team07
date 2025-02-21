"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

type Item = {
  id: number;
  name: string;
  price: number;
  stockQuantity: number;
  description: string;
  imageUrl?: string;
};

const initialItems: Item[] = [
  {
    id: 1,
    name: "상품 1",
    price: 1000,
    stockQuantity: 10,
    description: "설명 1",
    imageUrl: "/images/columbia.jpg",
  },
  {
    id: 2,
    name: "상품 2",
    price: 2000,
    stockQuantity: 20,
    description: "설명 2",
    imageUrl: "/images/columbia.jpg",
  },
  {
    id: 3,
    name: "상품 3",
    price: 3000,
    stockQuantity: 30,
    description: "설명 3",
    imageUrl: "/images/columbia.jpg",
  },
];

export default function ModifyItemClientPage({ itemId }: { itemId: string }) {
  const router = useRouter();
  const [item, setItem] = useState<Item | null>(null);
  const [editData, setEditData] = useState<Partial<Item>>({});

  useEffect(() => {
    const foundItem = initialItems.find((item) => item.id === Number(itemId));
    if (foundItem) setItem(foundItem);
  }, [itemId]);

  if (!item) return <p className="p-4">상품을 찾을 수 없습니다.</p>;

  const handleInputChange = (field: keyof Item, value: string | number) => {
    setEditData((prev) => ({
      ...prev,
      [field]:
        typeof value === "string" && field !== "name" && field !== "description"
          ? parseInt(value, 10) || 0
          : value,
    }));
  };

  const handleUpdate = () => {
    setItem((prev) => (prev ? { ...prev, ...editData } : prev));
    alert(`${item.name}이(가) 수정되었습니다.`);
  };

  const handleDelete = () => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    alert(`${item.name}이(가) 삭제되었습니다.`);
    router.push("/admin/modifyItems");
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">상품 변경</h1>
      <div className="border rounded p-4">
        {item.imageUrl && (
          <Image
            src={item.imageUrl}
            alt={item.name}
            width={128}
            height={128}
            className="rounded mb-4"
          />
        )}
        <div>
          <label className="block font-semibold">상품명</label>
          <input
            type="text"
            defaultValue={item.name}
            className="border p-1 w-full"
            onChange={(e) => handleInputChange("name", e.target.value)}
          />
        </div>
        <div>
          <label className="block font-semibold">가격</label>
          <input
            type="number"
            defaultValue={item.price}
            className="border p-1 w-full"
            onChange={(e) => handleInputChange("price", e.target.value)}
          />
        </div>
        <div>
          <label className="block font-semibold">재고</label>
          <input
            type="number"
            defaultValue={item.stockQuantity}
            className="border p-1 w-full"
            onChange={(e) => handleInputChange("stockQuantity", e.target.value)}
          />
        </div>
        <div>
          <label className="block font-semibold">설명</label>
          <textarea
            defaultValue={item.description}
            className="border p-1 w-full"
            onChange={(e) => handleInputChange("description", e.target.value)}
          />
        </div>
        <div className="flex gap-2 mt-4">
          <button
            onClick={handleUpdate}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            수정
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 text-white rounded"
          >
            삭제
          </button>
        </div>
      </div>
    </div>
  );
}
