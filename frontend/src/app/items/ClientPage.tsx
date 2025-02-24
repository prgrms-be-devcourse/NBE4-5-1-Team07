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
}

// NoticeDto 객체 인터페이스 정의
interface NoticeDto {
  id: number;
  title: string;
  content: string;
  createDate: string;
  modifyDate: string;
}

export default function ItemsPage() {
  const [items, setItems] = useState<ItemDto[]>([]);
  const [notices, setNotices] = useState<NoticeDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://localhost:8080/api/v1/items")
      .then((response) => {
        if (!response.ok) {
          throw new Error("데이터를 불러오는 데 실패했습니다.");
        }
        return response.json();
      })
      .then((data) => {
        setItems(data.data.items); // 백엔드 응답 구조에 맞게 설정
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching items:", error);
        setError("상품 목록을 불러올 수 없습니다.");
        setLoading(false);
      });

    fetch("http://localhost:8080/api/v1/notices")
      .then((response) => {
        if (!response.ok) {
          throw new Error("공지사항을 불러오는 데 실패했습니다.");
        }
        return response.json();
      })
      .then((data) => {
        setNotices(data.data); // 공지사항 목록 설정
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
          <div className="pb-4">
            상품 목록입니다. 상품을 누르면 상세 페이지로 이동합니다.
          </div>
          <ul className="grid grid-cols-4 gap-6 px-4 w-11/12 mx-auto">
            {items.map((item) => (
              <Link href={`/items/${item.id}`} key={item.id}>
                <li className="border-2 border-blue-300 p-2 rounded-2xl  h-[200px] hover:bg-gray-100 flex flex-col items-center justify-center">
                  <div>상품번호-{item.id}.</div>
                  <div> 상품명-{item.name}</div>
                  <div> 가격-{item.price}원</div>
                  <div>재고수량-{item.stockQuantity}</div>
                </li>
              </Link>
            ))}
          </ul>
        </div>

        <div className="bg-gray-300 rounded-b-2xl py-6 flex flex-col gap-2">
          {/* 공지사항 3개만 보여주기 */}
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
