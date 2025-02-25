"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

type OrderItem = {
  itemName: string;
  orderPrice: number;
  count: number;
  totalPrice: number;
};

type OrderDetail = {
  orderId: number;
  orderDate: string;
  orderItems: OrderItem[];
  totalPrice: number;
  address: string;
  orderStatus: string;
  deliveryStatus: string;
};

export default function OrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrderStatus, setSelectedOrderStatus] = useState<string>("");
  const [selectedDeliveryStatus, setSelectedDeliveryStatus] =
    useState<string>("");
  const router = useRouter();

  useEffect(() => {
    async function fetchOrderDetail() {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `http://localhost:8080/api/v1/orders/list/${id}`,
          { credentials: "include" } // 관리자 확인
        );
        if (!response.ok)
          throw new Error("주문 정보를 불러오는 데 실패했습니다.");
        const data = await response.json();
        setOrder(data.data);
        setSelectedOrderStatus(data.data.orderStatus);
        setSelectedDeliveryStatus(data.data.deliveryStatus);
      } catch (error) {
        setError("주문 정보를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    }

    if (id) fetchOrderDetail();
  }, [id]);

  // 주문 상태 변경 요청
  async function updateOrderStatus() {
    try {
      const response = await fetch(
        `http://localhost:8080/api/v1/orders/${id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ orderStatus: selectedOrderStatus }),
          credentials: "include",
        }
      );
      if (!response.ok) throw new Error("주문 상태 변경 실패");
      alert("주문 상태가 변경되었습니다.");
    } catch (error) {
      alert("오류 발생: " + error);
    }
  }

  // 배송 상태 변경 요청
  async function updateDeliveryStatus() {
    try {
      const response = await fetch(
        `http://localhost:8080/api/v1/orders/${id}/delivery-status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ deliveryStatus: selectedDeliveryStatus }),
          credentials: "include",
        }
      );
      if (!response.ok) throw new Error("배송 상태 변경 실패");
      alert("배송 상태가 변경되었습니다.");
    } catch (error) {
      alert("오류 발생: " + error);
    }
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">주문 상세 정보</h1>
      {loading && <p>불러오는 중...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {order && (
        <div className="p-6 border rounded-lg bg-white shadow-md">
          <p>
            <strong>주문번호:</strong> {order.orderId}
          </p>
          <p>
            <strong>배송 주소:</strong> {order.address}
          </p>
          <p className="py-2">
            <strong>주문 상태:</strong>
            <select
              value={selectedOrderStatus}
              onChange={(e) => setSelectedOrderStatus(e.target.value)}
              className="ml-2 border p-1 w-[200px]"
            >
              <option value="ORDER">ORDER</option>
              <option value="COMPLETED">COMPLETED</option>
              <option value="CANCELED">CANCELED</option>
            </select>
            <Button
              onClick={updateOrderStatus}
              className="ml-2 bg-blue-500 text-white p-1 rounded hover:bg-blue-700 w-[50px]"
            >
              수정
            </Button>
          </p>
          <p className="pb-2">
            <strong>배송 상태:</strong>
            <select
              value={selectedDeliveryStatus}
              onChange={(e) => setSelectedDeliveryStatus(e.target.value)}
              className="ml-2 border p-1 w-[200px]"
            >
              <option value="READY">READY</option>
              <option value="START">START</option>
              <option value="DONE">DONE</option>
              <option value="CANCELLED">CANCELLED</option>
            </select>
            <Button
              onClick={updateDeliveryStatus}
              className="ml-2 bg-blue-500 text-white p-1 rounded hover:bg-blue-700 w-[50px]"
            >
              수정
            </Button>
          </p>
          <p>
            <strong>주문 날짜:</strong>{" "}
            {new Date(order.orderDate).toLocaleString()}
          </p>

          <h2 className="text-xl font-bold mt-4">상품 목록</h2>
          <table className="w-full border-collapse border border-gray-300 mt-2">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">상품명</th>
                <th className="border p-2">수량</th>
                <th className="border p-2">개별 가격</th>
                <th className="border p-2">총 가격</th>
              </tr>
            </thead>
            <tbody>
              {order.orderItems.map((item) => (
                <tr key={item.itemName}>
                  <td className="border p-2 text-center">{item.itemName}</td>
                  <td className="border p-2 text-center">{item.count}</td>
                  <td className="border p-2 text-center">
                    {item.orderPrice}원
                  </td>
                  <td className="border p-2 text-center">
                    {item.totalPrice}원
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <h2 className="text-xl font-bold mt-4">총 주문 금액</h2>
          <p className="text-lg font-semibold">{order.totalPrice}원</p>

          <button
            onClick={() => router.push("/admin/orderManagement")}
            className="mt-4 bg-gray-500 text-white p-2 rounded hover:bg-gray-700"
          >
            주문 목록으로 돌아가기
          </button>
        </div>
      )}
    </div>
  );
}
