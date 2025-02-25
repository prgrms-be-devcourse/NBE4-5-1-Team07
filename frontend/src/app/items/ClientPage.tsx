"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";

// ItemDto 객체 인터페이스 정의
interface ItemDto {
  id: number;
  name: string;
  price: number;
  stockQuantity: number;
  description: string;
  imageUrl: string;
}

// NoticeDto 객체 인터페이스 정의
interface NoticeDto {
  id: number;
  title: string;
  content: string;
  createDate: string;
  modifyDate: string;
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

export default function ItemsPage() {
  const [items, setItems] = useState<ItemDto[]>([]);
  const [notices, setNotices] = useState<NoticeDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 페이지네이션 및 정렬 상태
  const [page, setPage] = useState(0);
  const [size] = useState(8);
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

  // 공지사항 불러오기
  useEffect(() => {
    fetch("http://localhost:8080/api/v1/notices")
      .then((response) => {
        if (!response.ok) {
          throw new Error("공지사항을 불러오는 데 실패했습니다.");
        }
        return response.json();
      })
      .then((data) => {
        setNotices(data.data);
      })
      .catch((error) => {
        console.error("Error fetching notices:", error);
      });
  }, []);

  if (loading) return <div className="text-center p-6">로딩 중...</div>;
  if (error) return <div className="text-center p-6 text-red-500">{error}</div>;

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="p-4">
          <div className="flex flex-row justify-between items-center pb-4">
            <div className="pb-4">
              상품 목록입니다. 상품을 누르면 상세 페이지로 이동합니다.
            </div>

            <div>
              {/* 정렬 버튼 */}
              <div className="flex gap-4 mb-4">
                <Button
                  onClick={() => handleSortChange("id")}
                  className={`px-4 py-2 ${
                    sortBy === "id" ? "bg-indigo-400" : "bg-gray-400"
                  }`}
                >
                  상품번호순{" "}
                  {sortBy === "id" ? (direction === "asc" ? "▲" : "▼") : ""}
                </Button>
                <Button
                  onClick={() => handleSortChange("price")}
                  className={`px-4 py-2 ${
                    sortBy === "price" ? "bg-indigo-400" : "bg-gray-400"
                  }`}
                >
                  가격순{" "}
                  {sortBy === "price" ? (direction === "asc" ? "▲" : "▼") : ""}
                </Button>
                <Button
                  onClick={() => handleSortChange("name")}
                  className={`px-4 py-2 ${
                    sortBy === "name" ? "bg-indigo-400" : "bg-gray-400"
                  }`}
                >
                  이름순{" "}
                  {sortBy === "name" ? (direction === "asc" ? "▲" : "▼") : ""}
                </Button>
              </div>
            </div>
          </div>

          {/* 상품 목록 */}
          <ul className="grid grid-cols-4 gap-6 px-4 w-11/12 mx-auto">
            {items.map((item) => (
              <Link href={`/items/${item.id}`} key={item.id}>
                <li className="border-2 border-gray-300 p-4 rounded-2xl h-[300px] hover:bg-gray-50 flex flex-col items-center justify-between relative">
                  {/* 상품 이미지 */}
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-48 object-cover rounded-lg mb-4 shadow-lg"
                  />

                  <div className="flex flex-col items-center text-center space-y-2 w-full">
                    <div className="text-lg font-bold text-black-900">
                      {item.name}
                    </div>
                    <div className="text-gray-600">{item.price}원</div>

                    {/* 품절 상태 */}
                    {item.stockQuantity === 0 && (
                      <div className="absolute top-2 right-2 bg-red-500 text-white text-sm font-semibold px-2 py-1 rounded-md">
                        품절
                      </div>
                    )}
                  </div>
                  <div className="absolute bottom-4 left-4 text-sm text-gray-600">
                    No. {item.id}
                  </div>
                  <div className="absolute bottom-4 right-4 text-sm text-gray-600">
                    {item.stockQuantity}개 남음
                  </div>
                </li>
              </Link>
            ))}
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

        {/* 공지사항 섹션 */}
        <div className="bg-gray-300 rounded-b-2xl py-6 flex flex-col gap-2">
          <div className="flex flex-col gap-4 w-full">
            <div className="flex flex-row">
              <div className="px-10 py-2 font-bold flex items-center justify-center">
                공지사항
              </div>
              <div className="px-2 py-2 font-bold">
                <Link href="/notices">
                  <Button className="bg-blue-400 w-[100px] font-bold">
                    전체보기
                  </Button>
                </Link>
              </div>
            </div>
            <ul className="w-[40vw] flex flex-col px-6 space-y-4">
              {notices.slice(0, 3).map((notice) => (
                <li
                  key={notice.id}
                  className="p-4 border rounded-lg shadow hover:bg-gray-100 transition"
                >
                  <Link href={`/notices/${notice.id}`} className="block">
                    <h2 className="text-xl font-semibold">{notice.title}</h2>
                    <p className="text-gray-600 text-sm">
                      {new Date(notice.createDate).toLocaleString()}
                    </p>
                    <p
                      className="mt-2 text-gray-700 line-clamp-1"
                      dangerouslySetInnerHTML={{ __html: notice.content }}
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
