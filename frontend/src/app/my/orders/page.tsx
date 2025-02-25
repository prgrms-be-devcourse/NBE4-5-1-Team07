"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion, useAnimation } from 'framer-motion';
import { ShoppingBagIcon, ClockIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";

// OrderDto 객체 인터페이스 정의
interface OrderDto {
    orderId: number;
    orderDate: string; // ISO 8601 형식 문자열로 가정
    itemName: string;
    orderStatus: string;
    deliveryStatus: string;
    totalPrice: number;
}

// 애니메이션 화살표 컴포넌트
const AnimatedArrow = () => {
    const controls = useAnimation();

    useEffect(() => {
        const sequence = async () => {
            while (true) {
                await controls.start({ x: 5, transition: { duration: 0.5 } });
                await controls.start({ x: 0, transition: { duration: 0.5 } });
            }
        };
        sequence();
    }, [controls]);

    return (
        <motion.div
            animate={controls}
            className="absolute -right-8 top-1/2 -translate-y-1/2"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
            </svg>
        </motion.div>
    );
};

export default function OrdersPage({ params }: { params: { email: string } }) {
    const [orders, setOrders] = useState<OrderDto[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await fetch("http://localhost:8080/api/my/orders", {
                    method: "GET",
                    credentials: "include",
                    headers: { "Content-Type": "application/json" },
                });

                if (!res.ok) {
                    const errorData = await res.json();
                    throw new Error(errorData.message || `HTTP error! status: ${res.status}`);
                }

                const data: OrderDto[] = await res.json();
                setOrders(data);
            } catch (err: unknown) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError("알 수 없는 오류가 발생했습니다");
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
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center min-h-screen gap-6 px-4"
            >
                {/* 오류 메시지 표시 */}
                <motion.div
                    initial={{ y: -20 }}
                    animate={{ y: 0 }}
                    className="bg-red-100 p-4 rounded-lg"
                >
                    <p className="text-red-600 font-medium">⚠️ {error}</p>
                </motion.div>

                {/* 회원용 섹션 */}
                <motion.div
                    className="text-center space-y-3 relative"
                    whileHover={{ scale: 1.02 }}
                >
                    <div className="relative inline-block">
                        <AnimatedArrow />
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => router.push('/user/login')}
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg
                hover:bg-blue-700 transition-colors w-48
                focus:outline-none focus:ring-2 focus:ring-blue-500
                relative"
                        >
                            로그인 하기
                            <motion.div
                                className="absolute inset-0 bg-blue-700 rounded-lg"
                                initial={{ opacity: 0 }}
                                whileHover={{ opacity: 0.2 }}
                            />
                        </motion.button>
                    </div>
                    <p className="text-gray-700 font-medium text-lg mt-4">
                        기존 회원이신가요?<br/>
                        <span className="text-sm text-blue-600 animate-pulse">
              ↓ 버튼을 클릭해 로그인
            </span>
                    </p>
                </motion.div>

                {/* 구분선 */}
                <motion.div
                    className="flex items-center w-64"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    <div className="flex-1 border-t border-gray-300"></div>
                    <span className="px-4 text-gray-400 text-sm">또는</span>
                    <div className="flex-1 border-t border-gray-300"></div>
                </motion.div>

                {/* 비회원용 섹션 */}
                <motion.div
                    className="text-center space-y-3"
                    whileHover={{ scale: 1.02 }}
                >
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => router.push('/guest')}  // 오타 수정 (guset → guest)
                        className="bg-gray-800 text-white px-6 py-3 rounded-lg
              hover:bg-gray-700 transition-colors w-48
              focus:outline-none focus:ring-2 focus:ring-gray-500
              relative"
                    >
                        비회원 주문 조회
                        <motion.div
                            className="absolute inset-0 bg-gray-700 rounded-lg"
                            initial={{ opacity: 0 }}
                            whileHover={{ opacity: 0.2 }}
                        />
                    </motion.button>
                    <p className="text-gray-700 font-medium text-lg">
                        비회원으로 주문하셨나요?<br/>
                        <span className="text-sm text-gray-600 animate-pulse">
              ↓ 버튼 클릭 후 이메일 인증
            </span>
                    </p>
                </motion.div>
            </motion.div>
        );

        return (
            <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800 p-4">
              <motion.h1
                className="text-3xl font-bold mb-6"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <ShoppingBagIcon className="inline-block w-8 h-8 text-blue-500 mr-2" />
                주문 내역
              </motion.h1>
        
              {orders.length === 0 ? (
                <p className="text-lg text-gray-600">주문 내역이 없습니다.</p>
              ) : (
                <div className="w-full max-w-4xl space-y-4">
                  {orders.map((order, index) => (
                    <motion.div
                      key={order.orderId}
                      className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h2 className="text-lg font-semibold text-gray-900">
                            {order.itemName}
                          </h2>
                          <p className="text-sm text-gray-500 mt-1">
                            {new Date(order.orderDate).toLocaleDateString("ko-KR", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </p>
                        </div>
                        <div className="text-right">
                          <p
                            className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                              order.orderStatus === "COMPLETED"
                                ? "bg-green-100 text-green-800"
                                : order.orderStatus === "CANCELED"
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {order.orderStatus}
                          </p>
                          <p
                            className={`inline-block px-3 py-1 rounded-full text-xs font-medium ml-2 ${
                              order.deliveryStatus === "DONE"
                                ? "bg-blue-100 text-blue-800"
                                : order.deliveryStatus === "CANCELLED"
                                ? "bg-red-100 text-red-800"
                                : order.deliveryStatus === "START"
                                ? "bg-purple-100 text-purple-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {order.deliveryStatus}
                          </p>
                        </div>
                      </div>
                      <div className="mt-4 flex justify-between items-center">
                        <p className="text-xl font-bold text-gray-900">
                          {order.totalPrice.toLocaleString("ko-KR")}원
                        </p>
                        <Link
                          href={`/my/orders/detail/${order.orderId}`}
                          className="text-blue-600 hover:text-blue-800 underline transition-colors duration-300 flex items-center space-x-1"
                        >
                          <span>자세히 보기</span>
                          <ClockIcon className="w-5 h-5" />
                        </Link>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </main>
          );
        }