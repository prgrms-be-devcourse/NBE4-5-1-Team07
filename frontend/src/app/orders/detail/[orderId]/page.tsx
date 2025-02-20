"use client";

import React, { useEffect, useState } from "react";

// OrderDetailDto 인터페이스 정의
interface OrderItemDto {
    itemName: string;
    orderPrice: number;
    count: number;
    totalPrice: number;
}

interface OrderDetailDto {
    orderId: number;
    orderDate: string; // ISO 8601 형식 문자열
    orderItems: OrderItemDto[];
    totalPrice: number;
    address: string; // 배송 주소 (city + street + zipcode)
    orderStatus: string;
    deliveryStatus: string;
}

export default function OrderDetailPage({ params }: { params: Promise<{ orderId: string }> }) {
    const [order, setOrder] = useState<OrderDetailDto | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // params를 비동기로 처리
    const { orderId } = React.use(params);

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                // API 호출
                const res = await fetch(`http://localhost:8080/api/orders/${orderId}`, {
                    cache: "no-store",
                });

                if (!res.ok) {
                    throw new Error("Failed to fetch order details");
                }

                const data = await res.json();
                setOrder(data); // 상태 업데이트
            } catch (err) {
                console.error(err);
                setError("주문 정보를 가져오는 데 실패했습니다.");
            } finally {
                setLoading(false); // 로딩 상태 해제
            }
        };

        fetchOrderDetails(); // API 호출 함수 실행
    }, [orderId]); // 의존성 배열에 `orderId` 추가

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen text-red-500">
                <p>{error}</p>
            </div>
        );
    }

    // 주문 취소 핸들러
    const handleCancelOrder = async () => {
        try {
            const cancelRes = await fetch(`http://localhost:8080/api/orders/${orderId}/cancel`, {
                method: "PUT",
            });

            if (!cancelRes.ok) {
                throw new Error("Failed to cancel the order");
            }

            alert("주문이 성공적으로 취소되었습니다.");
            // 상태를 업데이트하거나 페이지를 새로고침할 수 있음
            window.location.reload();
        } catch (error) {
            console.error(error);
            alert("주문 취소에 실패했습니다.");
        }
    };

    return (
        <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800 p-4">
            <h1 className="text-3xl font-bold mb-6">주문 상세 정보</h1>
            {order && (
                <div className="w-full max-w-4xl bg-white shadow-md rounded-lg p-6">
                    {/* 주문 정보 카드 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div className="p-4 bg-gray-50 rounded-lg shadow-sm">
                            <h2 className="text-lg font-semibold mb-2">주문 번호</h2>
                            <p className="text-gray-700">{order.orderId}</p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg shadow-sm">
                            <h2 className="text-lg font-semibold mb-2">주문 날짜</h2>
                            <p className="text-gray-700">
                                {new Date(order.orderDate).toLocaleString("ko-KR", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                            </p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg shadow-sm">
                            <h2 className="text-lg font-semibold mb-2">배송 주소</h2>
                            <p className="text-gray-700">{order.address}</p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg shadow-sm">
                            <h2 className="text-lg font-semibold mb-2">주문 상태</h2>
                            <p
                                className={`${
                                    order.orderStatus === "CANCELED"
                                        ? "text-red-500"
                                        : "text-green-500"
                                } font-semibold`}
                            >
                                {order.orderStatus}
                            </p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg shadow-sm">
                            <h2 className="text-lg font-semibold mb-2">배송 상태</h2>
                            <p
                                className={`${
                                    order.deliveryStatus === "CANCELLED"
                                        ? "text-red-500"
                                        : "text-blue-500"
                                } font-semibold`}
                            >
                                {order.deliveryStatus}
                            </p>
                        </div>
                    </div>

                    {/* 주문 상품 내역 */}
                    <h3 className="text-lg font-semibold mb-4">주문 상품 내역</h3>
                    <table className="table-auto border-collapse border border-gray-300 w-full mb-6">
                        <thead className="bg-blue-500 text-white">
                        <tr>
                            <th className="border border-gray-300 px-4 py-2">상품명</th>
                            <th className="border border-gray-300 px-4 py-2">가격</th>
                            <th className="border border-gray-300 px-4 py-2">수량</th>
                            <th className="border border-gray-300 px-4 py-2">합계</th>
                        </tr>
                        </thead>
                        <tbody>
                        {order.orderItems.map((item, index) => (
                            <tr
                                key={index}
                                className={`${
                                    index % 2 === 0 ? "bg-gray-100" : "bg-white"
                                } hover:bg-blue-100 transition-all duration-200`}
                            >
                                <td className="border border-gray-300 px-4 py-2">{item.itemName}</td>
                                <td className="border border-gray-300 px-4 py-2">
                                    {item.orderPrice.toLocaleString("ko-KR")} 원
                                </td>
                                <td className="border border-gray-300 px-4 py-2">{item.count}</td>
                                <td className="border border-gray-300 px-4 py-2">
                                    {item.totalPrice.toLocaleString("ko-KR")} 원
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>

                    {/* 총 금액 및 주문 취소 버튼 */}
                    <div className="flex justify-between items-center">
                        <p className="text-lg font-semibold">
                            총 금액: {order.totalPrice.toLocaleString("ko-KR")} 원
                        </p>

                        {/* 주문 취소 버튼 */}
                        {order.orderStatus === "ORDER" && order.deliveryStatus === "READY" && (
                            <button
                                onClick={handleCancelOrder}
                                className="px-6 py-3 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 transition-all duration-200"
                            >
                                주문 취소
                            </button>
                        )}
                    </div>
                </div>
            )}
        </main>
    );
}
