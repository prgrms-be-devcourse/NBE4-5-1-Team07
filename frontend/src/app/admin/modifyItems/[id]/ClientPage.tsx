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

export default function ModifyItemClientPage({ itemId }: { itemId: string }) {
  const router = useRouter();
  const [item, setItem] = useState<Item | null>(null);
  const [editData, setEditData] = useState<Partial<Item>>({});
  const [loading, setLoading] = useState<boolean>(true);

  // 백엔드에서 상품 정보 불러오기
  useEffect(() => {
    async function fetchItem() {
      try {
        const response = await fetch(
          `http://localhost:8080/api/v1/items/${itemId}`
        );
        if (!response.ok) {
          throw new Error("상품 정보를 불러오는 데 실패했습니다.");
        }

        const data = await response.json();
        setItem(data.data); // 최신 데이터로 불러오기
      } catch (error) {
        console.error("상품을 불러오는 중 오류 발생:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchItem();
  }, [itemId]); // itemId가 변경될 때마다 최신 데이터 불러오기

  if (loading) return <p className="p-4">상품을 불러오는 중...</p>;
  if (!item) return <p className="p-4">상품을 찾을 수 없습니다.</p>;

  // 입력 필드 변경 핸들러
  const handleInputChange = (field: keyof Item, value: string | number) => {
    setEditData((prev) => ({
      ...prev,
      [field]:
        typeof value === "string" && field !== "name" && field !== "description"
          ? parseInt(value, 10) || 0
          : value,
    }));
  };

  // 상품 수정 후 목록으로 이동
  const handleUpdate = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/v1/items/${item.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...item, ...editData }),
        }
      );

      if (!response.ok) {
        throw new Error("상품 수정에 실패했습니다.");
      }

      alert(`${item.name}이(가) 수정되었습니다.`);
      router.push("/admin/modifyItems"); // 수정 후 목록으로 이동
    } catch (error) {
      console.error("상품 수정 중 오류 발생:", error);
      alert("상품 수정 중 오류가 발생했습니다.");
    }
  };

  // 상품 삭제 후 목록으로 이동
  const handleDelete = async () => {
    if (!confirm("정말 삭제하시겠습니까?")) return;

    try {
      const response = await fetch(
        `http://localhost:8080/api/v1/items/${item.id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("상품 삭제에 실패했습니다.");
      }

      alert(`${item.name}이(가) 삭제되었습니다.`);
      router.push("/admin/modifyItems"); //삭제 후 목록으로 이동
    } catch (error) {
      console.error("상품 삭제 중 오류 발생:", error);
      alert("상품 삭제 중 오류가 발생했습니다.");
    }
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
