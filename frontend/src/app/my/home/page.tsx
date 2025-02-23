"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { CurrencyYenIcon } from "@heroicons/react/16/solid";
import { GiftIcon } from "lucide-react";
import { PencilIcon } from "@heroicons/react/24/outline";

export interface MyPageResponse {
  userName: string;
  totalPoints: number;
  orders: OrderDto[];
}

export interface OrderDto {
  orderId: number;
  orderDate: string;
  itemName: string;
  orderStatus: "ORDER" | "COMPLETED" | "CANCELLED";
  deliveryStatus: "DONE" | "READY" | "START" | "CANCELLED";
  totalPrice: number;
}

export const mockMyPageResponse: MyPageResponse = {
  userName: "홍길동",
  totalPoints: 1500,
  orders: [
    {
      orderId: 1,
      orderDate: "2025-02-21T17:26:00",
      itemName: "Item A",
      orderStatus: "COMPLETED",
      deliveryStatus: "READY",
      totalPrice: 50000,
    },
    {
      orderId: 2,
      orderDate: "2025-02-20T14:10:00",
      itemName: "Item B",
      orderStatus: "ORDER",
      deliveryStatus: "START",
      totalPrice: 120000,
    },
    {
      orderId: 3,
      orderDate: "2025-02-18T10:00:00",
      itemName: "Item C",
      orderStatus: "CANCELLED",
      deliveryStatus: "CANCELLED",
      totalPrice: 0,
    },
  ],
};

export default function MyPage() {

  // const data = mockMyPageResponse; // Mock 데이터를 사용

  const [data, setData] = useState<MyPageResponse | null>(null); // 마이페이지 데이터 상태
  const [error, setError] = useState<string | null>(null); // 에러 메시지 상태

  useEffect(() => {
    // JWT 토큰 가져오기
    // const token = localStorage.getItem("authToken"); // localStorage에서 JWT 토큰 가져오기

    // 일단 토큰 직접 저장하는 방식으로 테스트 했습니다
    const token = "eyJhbGciOiJIUzI1NiJ9.eyJpZCI6MSwiZW1haWwiOiJleGFtcGxlQGV4YW0uY29tIiwiaWF0IjoxNzQwMjkzNTQxLCJleHAiOjE3NDAzNzk5NDF9.n4g2tiP-k5iOf2K6FbaAQydXlQCzh7kwkTZTRtWZ7Po";

    if (!token) {
      setError("로그인이 필요합니다."); // 토큰이 없으면 에러 설정
      return;
    }


    // API 요청
    fetch("http://localhost:8080/api/my/home", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        credentials: "include", // 쿠키 전송 허용
        Authorization: `Bearer ${token}`, // 인증 토큰 추가
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((result) => setData(result)) // 데이터를 상태에 저장
      .catch((err) => setError(err.message)); // 에러 처리
  }, []);

  if (error) {
    return <div className="text-center text-red-500">{error}</div>; // 에러 메시지 표시
  }

  if (!data) {
    return <div className="text-center">로딩 중...</div>; // 로딩 메시지 표시
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* 환영 메시지 섹션 */}
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-bold">{data.userName}님, 반갑습니다!</h1>
        <p className="text-gray-600">보유 포인트 : {data.totalPoints.toLocaleString()}원</p>
      </div>

      {/* 적립금 섹션 */}
      <Link href="/my/point/history" className="group block mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <CurrencyYenIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">적립금</h2>
                <p className="text-2xl font-bold text-gray-800">
                  {data.totalPoints.toLocaleString()}원
                </p>
              </div>
            </div>
            <ChevronRightIcon className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
          </div>
        </div>
      </Link>

      {/* 나의 상품 후기 섹션 */ }
  <Link href="/my/review" className="group block mb-8">
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="bg-orange-100 p-3 rounded-full">
            <PencilIcon className="w-6 h-6 text-orange-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">나의 상품 후기</h2>
            <p className="text-gray-600">작성 가능한 후기를 확인해 보세요!</p>
          </div>
        </div>
        <ChevronRightIcon className="w-5 h-5 text-gray-400 group-hover:text-orange-600 transition-colors" />
      </div>
    </div>
  </Link>

      {/* 최근 주문 내역 섹션 */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">최근 주문 내역</h2>
          <Link
            href="/my/orders"
            className="text-blue-600 hover:text-blue-800 flex items-center space-x-1 transition-colors"
          >
            <span>더보기</span>
            <ChevronRightIcon className="w-4 h-4" />
          </Link>
        </div>

        {data.orders.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <GiftIcon className="w-12 h-12 mx-auto mb-2" />
            <p>최근 주문 내역이 없습니다</p>
          </div>
        ) : (
          <div className="space-y-4">
            {data.orders.map((order) => (
              <OrderItem key={order.orderId} order={order} />
            ))}
          </div>
        )}
        </div>
    </div>
  );

function OrderItem({ order }: { order: OrderDto }) {
  return (
    <Link
      href={`/orders/${order.orderId}`}
      className="block p-4 border rounded-lg hover:bg-gray-50 transition-colors group"
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
            {order.itemName}
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            {new Date(order.orderDate).toLocaleDateString()}
          </p>
        </div>

        <div className="text-right">
          <p className="font-semibold text-gray-900">
            {order.totalPrice.toLocaleString()}원
          </p>
          <div className="flex items-center space-x-2 mt-1">
            <span
              className={`px-2 py-1 rounded-full text-xs ${order.orderStatus === "COMPLETED"
                  ? "bg-green-100 text-green-800"
                  : "bg-yellow-100 text-yellow-800"
                }`}
            >
              {order.orderStatus}
            </span>
            <span
              className={`px-2 py-1 rounded-full text-xs ${order.deliveryStatus === "DONE"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-purple-100 text-purple-800"
                }`}
            >
              {order.deliveryStatus}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}}