"use client";

import { useEffect, useState } from "react";

type Item = {
  id: number;
  name: string;
  stockQuantity: number;
};

// 테스트용 하드코딩 데이터
const initialItems: Item[] = [
  { id: 1, name: "에티오피아 원두", stockQuantity: 50 },
  { id: 2, name: "콜롬비아 원두", stockQuantity: 30 },
  { id: 3, name: "과테말라 원두", stockQuantity: 20 },
  { id: 4, name: "브라질 원두", stockQuantity: 15 },
];

export default function CheckItemsPage() {
  const [items, setItems] = useState<Item[]>(initialItems);
  const [updatedStocks, setUpdatedStocks] = useState<Record<number, number>>(
    {}
  );

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

  // 입력값 변경 핸들러
  const handleStockChange = (id: number, value: number) => {
    setUpdatedStocks((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  // 재고 수정 버튼 클릭 시
  const updateStock = async (itemId: number) => {
    const newStock = updatedStocks[itemId];
    if (newStock === undefined) {
      alert("수정할 재고 수량을 입력해주세요.");
      return;
    }

    try {
      // 백엔드 연동
      const response = await fetch(
        `http://localhost:8080/api/v1/items/${itemId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ stockQuantity: newStock }),
        }
      );

      if (!response.ok) {
        throw new Error(`재고 수정 실패: ${response.status}`);
      }

      setItems((prevItems) =>
        prevItems.map((item) =>
          item.id === itemId ? { ...item, stockQuantity: newStock } : item
        )
      );

      alert(
        `"${items.find((i) => i.id === itemId)?.name}"의 재고가 수정되었습니다.`
      );
    } catch (error) {
      console.error("재고 수정 중 오류 발생:", error);
      alert("재고 수정 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">재고 관리</h1>
      <ul className="space-y-4">
        {items.length > 0 ? (
          items.map((item) => (
            <li
              key={item.id}
              className="flex items-center justify-between bg-white p-4 border rounded-lg shadow-sm"
            >
              {/* 상품명 및 현재 재고 */}
              <div className="flex items-center gap-4">
                <span className="font-semibold text-lg w-48">{item.name}</span>
                <span className="text-gray-600">
                  현재 재고: {item.stockQuantity}개
                </span>
              </div>

              {/* 새 재고 입력 및 수정 버튼 */}
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min="0"
                  placeholder="새 재고 수"
                  value={updatedStocks[item.id] ?? ""}
                  onChange={(e) =>
                    handleStockChange(item.id, Number(e.target.value))
                  }
                  className="border p-2 rounded w-20 text-center"
                />
                <button
                  onClick={() => updateStock(item.id)}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  수정
                </button>
              </div>
            </li>
          ))
        ) : (
          <p className="text-gray-500">상품이 없습니다.</p>
        )}
      </ul>
    </div>
  );
}
