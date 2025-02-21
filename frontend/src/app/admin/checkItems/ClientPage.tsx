"use client";

import { useEffect, useState } from "react";

type Item = {
  id: number;
  name: string;
  stockQuantity: number;
};

// 테스트를 위한 하드 코딩
const initialItems: Item[] = [
  { id: 1, name: "에티오피아 원두", stockQuantity: 50 },
  { id: 2, name: "콜롬비아 원두", stockQuantity: 30 },
  { id: 3, name: "과테말라 원두", stockQuantity: 20 },
  { id: 4, name: "브라질 원두", stockQuantity: 15 },
];

export default function CheckItemsPage() {
  const [items, setItems] = useState<Item[]>(initialItems);

  useEffect(() => {
    async function fetchItems() {
      try {
        const response = await fetch("http://localhost:8080/api/v1/items");
        const data = await response.json();
        setItems(data.data.items);
      } catch (error) {
        console.error("상품을 불러오는 중 오류 발생:", error);
      }
    }

    fetchItems();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">재고확인</h1>
      <ul className="space-y-2">
        {items.length > 0 ? (
          items.map((items) => (
            <li key={items.id} className="p-2 border rounded-lg shadow-md">
              <span className="font-semibold">{items.name}</span> - 재고:{" "}
              {items.stockQuantity}개
            </li>
          ))
        ) : (
          <p>상품이 없습니다.</p>
        )}
      </ul>
    </div>
  );
}
