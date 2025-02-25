"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { CurrencyYenIcon } from "@heroicons/react/16/solid";
import { GiftIcon } from "lucide-react";
import { PencilIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";

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

export default function MyPage() {


  const [data, setData] = useState<MyPageResponse | null>(null); // 마이페이지 데이터 상태
  const [error, setError] = useState<string | null>(null); // 에러 메시지 상태
  const router = useRouter(); // Next.js 라우터 사용

  useEffect(() => {
    let isMounted = true;
    fetch("http://localhost:8080/api/my/home", {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`로그인이 필요합니다`);
          }
          return response.json();
        })
        .then((result) => {
          if (isMounted) setData(result);
        })
        .catch((err) => {
          if (isMounted) {
            setError(err.message);
            if (!error) {
              alert(err.message);
              router.push("/user/login");
            }
          }
        });
    return () => {
      isMounted = false;
    };
  }, [router, error]);

  if (!data) {
    return <div className="text-center">로딩 중...</div>; // 로딩 메시지 표시
  }

  return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* 환영 메시지 섹션 */}
        <div className="mb-8 space-y-2">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold">{data.userName}님, 반갑습니다!</h1>
              <p className="text-gray-600 mt-2">
                보유 포인트 : {data.totalPoints.toLocaleString()}원
              </p>
            </div>
            <button
                onClick={() => router.push('/my/profile/edit')}
                className="bg-white text-gray-700 px-4 py-2 rounded-lg
                 border border-gray-300 hover:bg-gray-50
                 transition-colors duration-200
                 flex items-center gap-2
                 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
              >
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
              내 정보 수정
            </button>
          </div>
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
            href="/my/orders/"
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
      href={`/my/orders/detail/${order.orderId}`}
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