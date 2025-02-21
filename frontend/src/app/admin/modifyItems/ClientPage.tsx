"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export type Item = {
  id: number;
  name: string;
  price: number;
  stockQuantity: number;
  description: string;
  imageUrl?: string;
};

export default function ModifyItemsClientPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // 백엔드 API에서 상품 목록 가져오기
  useEffect(() => {
    async function fetchItems() {
      try {
        const response = await fetch("http://localhost:8080/api/v1/items");
        if (!response.ok) {
          throw new Error(
            `상품 목록을 불러오는 데 실패했습니다. (HTTP ${response.status})`
          );
        }

        const data = await response.json();
        setItems(data.data.items);
      } catch (error) {
        console.error("상품을 불러오는 중 오류 발생:", error);
        setError("상품 목록을 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    }

    fetchItems();
  }, []);

  if (loading) {
    return <p className="p-4 text-gray-500">상품 목록을 불러오는 중...</p>;
  }

  if (error) {
    return <p className="p-4 text-red-500">{error}</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">상품 목록</h1>
      <ul className="space-y-4">
        {items.length > 0 ? (
          items.map((item) => (
            <li
              key={item.id}
              className="flex items-center justify-between bg-white p-4 border rounded-lg shadow-sm hover:bg-gray-100 transition cursor-pointer"
              onClick={() => router.push(`/admin/modifyItems/${item.id}`)}
            >
              {/* 좌측: 상품 이미지 + 상품명 */}
              <div className="flex items-center gap-4">
                {item.imageUrl && (
                  <Image
                    src="/images/columbia.jpg"
                    alt={item.name}
                    width={64}
                    height={64}
                    className="rounded"
                  />
                )}
                <span className="font-semibold text-lg">{item.name}</span>
              </div>

              {/* 우측: 가격 + 재고 */}
              <div className="text-right">
                <p className="text-gray-600">
                  💰 가격: {item.price.toLocaleString()}원
                </p>
                <p className="text-gray-600">📦 재고: {item.stockQuantity}개</p>
              </div>
            </li>
          ))
        ) : (
          <p className="text-gray-500">등록된 상품이 없습니다.</p>
        )}
      </ul>
    </div>
  );
}
