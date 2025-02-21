"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import ClientPage from "../notice/ClientPage";
import { useEffect, useState } from "react";

// ItemDto 객체 인터페이스 정의
interface ItemDto {
  id: number;
  name: string;
  price: number;
  stockQuantity: number;
  description: string;
}

export default function ItemsPage() {
  const [items, setItems] = useState<ItemDto[]>([]);
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
          <div className="pl-4 flex flex-row gap-4">
            <Link href="/notice">
              <Button className="bg-blue-300 w-[100px] ">공지사항</Button>
            </Link>
            <Button className="bg-blue-300 w-[100px] ">FAQ</Button>
          </div>
          <ClientPage />
        </div>
      </div>
    </>
  );
}
