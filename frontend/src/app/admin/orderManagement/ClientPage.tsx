"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Order = {
  id: number;
  email: string;
  orderStatus: string;
  deliveryStatus: string;
};

export default function OrderListPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchOrders() {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          "http://localhost:8080/api/v1/orders/list",
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error("주문 목록을 불러오는 데 실패했습니다.");
        }

        const data = await response.json();
        setOrders(data.data.orders);
      } catch (error) {
        setError("관리자가 아닙니다.");
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">주문 목록</h1>
      {loading && <p>불러오는 중...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">주문번호</th>
            <th className="border p-2">이메일</th>
            <th className="border p-2">주문 상태</th>
            <th className="border p-2">배송 상태</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr
              key={order.id}
              className="cursor-pointer hover:bg-gray-200"
              onClick={() => router.push(`/admin/orderManagement/${order.id}`)}
            >
              <td className="border p-2 text-center">{order.id}</td>
              <td className="border p-2 text-center">{order.email}</td>
              <td className="border p-2 text-center">{order.orderStatus}</td>
              <td className="border p-2 text-center">{order.deliveryStatus}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
