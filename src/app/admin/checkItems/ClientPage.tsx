"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

// ItemDto 객체 인터페이스 정의
interface ItemDto {
  id: number;
  name: string;
  price: number;
  stockQuantity: number;
  description: string;
}

// API 응답 타입 정의
interface PaginatedResponse<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
  };
  totalPages: number;
  totalElements: number;
}

export default function CheckItemsPage() {
  const [items, setItems] = useState<ItemDto[]>([]); // 초기값 변경
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [updatedStocks, setUpdatedStocks] = useState<Record<number, number>>(
    {}
  );

  // 페이지네이션 및 정렬 상태
  const [page, setPage] = useState(0);
  const [size] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState("id"); // 기본 정렬: 상품번호순
  const [direction, setDirection] = useState("asc"); // 오름차순

  // 상품 목록 불러오기 (페이지 & 정렬 반영)
  useEffect(() => {
    setLoading(true);
    fetch(
      `http://localhost:8080/api/v1/items?page=${page}&size=${size}&sortBy=${sortBy}&direction=${direction}`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("데이터를 불러오는 데 실패했습니다.");
        }
        return response.json();
      })
      .then((data: { data: PaginatedResponse<ItemDto> }) => {
        setItems(data.data.content);
        setTotalPages(data.data.totalPages);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching items:", error);
        setError("상품 목록을 불러올 수 없습니다.");
        setLoading(false);
      });
  }, [page, size, sortBy, direction]); // 정렬 기준이 변경되면 다시 불러오기

  // 입력값 변경 핸들러
  const handleStockChange = (id: number, value: number) => {
    setUpdatedStocks((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  // 정렬 기준 변경 핸들러
  const handleSortChange = (newSortBy: string) => {
    if (sortBy === newSortBy) {
      // 이미 선택된 정렬 기준이면 방향만 변경
      setDirection(direction === "asc" ? "desc" : "asc");
    } else {
      // 새로운 정렬 기준이면 오름차순으로 설정
      setSortBy(newSortBy);
      setDirection("asc");
    }
  };

  // 재고 수정 버튼 클릭 시
  const updateStock = async (itemId: number) => {
    const newStock = updatedStocks[itemId];
    if (newStock === undefined) {
      alert("수정할 재고 수량을 입력해주세요.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8080/api/v1/items/${itemId}/stock`,
        {
          method: "PATCH", // PUT->PATCH로 변경
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ stockQuantity: newStock }),
          credentials: "include",
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

  if (loading) {
    return <p className="p-4 text-gray-500">상품 목록을 불러오는 중...</p>;
  }

  if (error) {
    return <p className="p-4 text-red-500">{error}</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">재고 관리</h1>
      {/* 정렬 버튼 */}
      <div className="flex gap-4 mb-4">
        <Button
          onClick={() => handleSortChange("id")}
          className={`px-4 py-2 ${
            sortBy === "id" ? "bg-indigo-400" : "bg-gray-400"
          }`}
        >
          상품번호순 {sortBy === "id" ? (direction === "asc" ? "▲" : "▼") : ""}
        </Button>
        <Button
          onClick={() => handleSortChange("price")}
          className={`px-4 py-2 ${
            sortBy === "price" ? "bg-indigo-400" : "bg-gray-400"
          }`}
        >
          가격순 {sortBy === "price" ? (direction === "asc" ? "▲" : "▼") : ""}
        </Button>
        <Button
          onClick={() => handleSortChange("name")}
          className={`px-4 py-2 ${
            sortBy === "name" ? "bg-indigo-400" : "bg-gray-400"
          }`}
        >
          이름순 {sortBy === "name" ? (direction === "asc" ? "▲" : "▼") : ""}
        </Button>
      </div>
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

      {/* 페이징 컨트롤 UI */}
      <div className="flex justify-center mt-6 gap-4">
        <Button
          onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
          disabled={page === 0}
          className="bg-gray-400 px-4 py-2 rounded-md"
        >
          이전
        </Button>
        <span className="px-4 py-2">
          {page + 1} / {totalPages}
        </span>
        <Button
          onClick={() =>
            setPage((prev) => (prev < totalPages - 1 ? prev + 1 : prev))
          }
          disabled={page >= totalPages - 1}
          className="bg-gray-400 px-4 py-2 rounded-md"
        >
          다음
        </Button>
      </div>
    </div>
  );
}
