"use client";

import { use, useEffect, useState} from "react";
import {motion} from "framer-motion"; // 애니메이션 추가
import {TruckIcon, ShoppingBagIcon, XCircleIcon} from "@heroicons/react/24/solid";

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


export default function OrderDetailPage({ params }: {
    params: Promise<{ orderId: string }>
}) {
    {

        const resolvedParams = use(params)
        const {orderId} = resolvedParams
        const [order, setOrder] = useState<OrderDetailDto | null>(null);
        const [loading, setLoading] = useState<boolean>(true);
        const [error, setError] = useState<string | null>(null);

        useEffect(() => {
            const fetchOrderDetails = async () => {
                try {
                    // API 호출
                    const res = await fetch(`http://localhost:8080/api/orders/${orderId}`, {
                        method: "GET",
                        credentials: "include",
                        headers: {
                            "Content-Type": "application/json",
                        },
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
            fetchOrderDetails()
        }, [orderId]) // orderId 직접 사용

        // 주문 취소 핸들러
        const handleCancelOrder = async () => {
            try {
                const cancelRes = await fetch(`http://localhost:8080/api/orders/${orderId}/cancel`, {
                    method: "PUT",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (!cancelRes.ok) {
                    throw new Error("Failed to cancel the order");
                }

                alert("주문이 성공적으로 취소되었습니다.");
                window.location.reload(); // 페이지 새로고침
            } catch (error) {
                console.error(error);
                alert("주문 취소에 실패했습니다.");
            }
        };

        // 로딩 중일 때
        if (loading) {
            return (
                <div className="flex items-center justify-center min-h-screen">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
                </div>
            );
        }

        // 에러가 발생했을 때
        if (error) {
            return (
                <div className="flex items-center justify-center min-h-screen text-red-500">
                    <p>{error}</p>
                </div>
            );
        }

        return (
            <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800 p-4">
                <motion.h1
                    className="text-3xl font-bold mb-6"
                    initial={{opacity: 0, y: -20}}
                    animate={{opacity: 1, y: 0}}
                    transition={{duration: 0.5}}
                >
                    <ShoppingBagIcon className="inline-block w-8 h-8 text-blue-500 mr-2"/>
                    주문 상세 정보
                </motion.h1>

                {order && (
                    <motion.div
                        className="w-full max-w-4xl bg-white shadow-md rounded-lg p-6"
                        initial={{opacity: 0, y: 20}}
                        animate={{opacity: 1, y: 0}}
                        transition={{duration: 0.5}}
                    >
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
                                <TruckIcon
                                    className={`inline-block w-6 h-6 mr-1 ${
                                        order.deliveryStatus === "CANCELLED"
                                            ? "text-red-500"
                                            : order.deliveryStatus === "DONE"
                                                ? "text-blue-500"
                                                : "text-yellow-500"
                                    }`}
                                />
                                <span>{order.deliveryStatus}</span>
                            </div>
                        </div>

                        {/* 주문 상품 내역 */}
                        <h3 className="text-lg font-semibold mb-4 flex items-center">
                            <ShoppingBagIcon className="w-6 h-6 text-blue-500 mr-2"/>
                            주문 상품 내역
                        </h3>
                        <div className="overflow-hidden rounded-lg shadow-lg">
                            <table className="table-auto border-collapse w-full">
                                <thead className="bg-blue-500 text-white">
                                <tr>
                                    <th className="px-6 py-3 text-left text-sm font-semibold">상품명</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold">가격</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold">수량</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold">합계</th>
                                </tr>
                                </thead>
                                <tbody>
                                {order.orderItems.map((item, index) => (
                                    <tr
                                        key={index}
                                        className={`${
                                            index % 2 === 0 ? "bg-gray-50" : "bg-white"
                                        } hover:bg-blue-100 transition-all duration-200`}
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {item.itemName}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {item.orderPrice.toLocaleString("ko-KR")} 원
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {item.count} 개
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                                            {(item.orderPrice * item.count).toLocaleString("ko-KR")} 원
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>

                        {/* 총 주문 금액 */}
                        <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg shadow-sm">
                            <h3 className="text-lg font-semibold">총 주문 금액</h3>
                            <p className="text-xl font-bold text-gray-900">
                                {order.totalPrice.toLocaleString("ko-KR")} 원
                            </p>
                        </div>

                        {/* 주문 취소 버튼 */}
                        {order.orderStatus === "ORDER" && order.deliveryStatus === "READY" && (
                            <motion.button
                                onClick={handleCancelOrder}
                                className="mt-6 w-full bg-red-500 text-white py-3 px-6 rounded-lg shadow-md hover:bg-red-600 transition-colors duration-300 flex justify-center items-center space-x-2"
                                whileHover={{scale: 1.05}}
                                whileTap={{scale: 0.95}}
                            >
                                <XCircleIcon className="w-5 h-5"/>
                                <span>주문 취소</span>
                            </motion.button>
                        )}
                    </motion.div>
                )}
            </main>
        );

    }}