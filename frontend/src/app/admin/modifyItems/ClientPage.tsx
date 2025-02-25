"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";

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

export default function ModifyItemsClientPage() {
  const [items, setItems] = useState<ItemDto[]>([]); // 초기값 변경
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

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

  if (loading) {
    return <p className="p-4 text-gray-500">상품 목록을 불러오는 중...</p>;
  }

  if (error) {
    return <p className="p-4 text-red-500">{error}</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">상품 목록</h1>
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
              className="flex items-center justify-between bg-white p-4 border rounded-lg shadow-sm hover:bg-gray-100 transition cursor-pointer"
              onClick={() => router.push(`/admin/modifyItems/${item.id}`)}
            >
              {/* 좌측: 상품 이미지 + 상품명 */}
              <div className="flex items-center gap-4">
                {/* {item.imageUrl && (
                  <Image
                    src="/images/columbia.jpg"
                    alt={item.name}
                    width={64}
                    height={64}
                    className="rounded"
                  />
                )} */}
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
