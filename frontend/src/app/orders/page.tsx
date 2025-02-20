"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

// OrderDto 객체 인터페이스 정의
interface OrderDto {
    orderId: number;
    orderDate: string; // ISO 8601 형식 문자열로 가정
    itemName: string;
    orderStatus: string;
    deliveryStatus: string;
    totalPrice: number;
}

export default function OrdersPage({ params }: { params: { email: string } }) {
    const [orders, setOrders] = useState<OrderDto[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchOrders = async () => {
            // 테스트용으로 email 값을 고정
            const testEmail = "customer1@example.com";

            try {
                // `http://localhost:8080/api/user/${params.email}/orders`
                const res = await fetch(`http://localhost:8080/api/user/${testEmail}/orders`, {
                    cache: "no-store", // 항상 최신 데이터를 가져오기 위해 캐싱 비활성화
                });

                if (!res.ok) {
                    const errorData = await res.json();
                    throw new Error(errorData.message || "Unknown error occurred");
                }

                const data: OrderDto[] = await res.json();
                setOrders(data);
            } catch (err: unknown) {
                if (err instanceof Error) {
                    setError(err.message || "Failed to fetch orders");
                } else {
                    setError("An unknown error occurred");
                }
            } finally {
                setLoading(false);
            }

        };

        fetchOrders();
    }, [params.email]);

    if (loading)
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
            </div>
        );

    if (error)
        return (
            <div className="flex items-center justify-center min-h-screen text-red-500">
                <p>오류 발생: {error}</p>
            </div>
        );

    return (
        <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800 p-4">
            <h1 className="text-3xl font-bold mb-6">주문 내역</h1>
            {orders.length === 0 ? (
                <p className="text-lg text-gray-600">주문 내역이 없습니다.</p>
            ) : (
                <div className="w-full max-w-6xl overflow-x-auto">
                    <table className="table-auto border-collapse border border-gray-300 w-full">
                        <thead className="bg-blue-500 text-white">
                        <tr>
                            <th className="border border-gray-300 px-4 py-2">주문 번호</th>
                            <th className="border border-gray-300 px-4 py-2">상품명</th>
                            <th className="border border-gray-300 px-4 py-2">주문 상태</th>
                            <th className="border border-gray-300 px-4 py-2">배송 상태</th>
                            <th className="border border-gray-300 px-4 py-2">주문 날짜</th>
                            <th className="border border-gray-300 px-4 py-2">총 금액</th>
                        </tr>
                        </thead>
                        <tbody>
                        {orders.map((order, index) => (
                            <tr
                                key={order.orderId}
                                className={`${
                                    index % 2 === 0 ? "bg-gray-100" : "bg-white"
                                } hover:bg-blue-100 transition-all duration-200`}
                            >
                                <td className="border border-gray-300 px-4 py-2">
                                    <Link href={`/orders/detail/${order.orderId}`} className="text-blue-500 hover:underline">
                                        {order.orderId}
                                    </Link>
                                </td>

                                <td className="border border-gray-300 px-4 py-2">{order.itemName}</td>
                                <td className="border border-gray-300 px-4 py-2">{order.orderStatus}</td>
                                <td className="border border-gray-300 px-4 py-2">{order.deliveryStatus}</td>
                                <td className="border border-gray-300 px-4 py-2">
                                    {new Date(order.orderDate).toLocaleString("ko-KR", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </td>
                                <td className="border border-gray-300 px-4 py-2">
                                    {order.totalPrice.toLocaleString("ko-KR")} 원
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </main>
    );
}
