"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircleIcon, EnvelopeIcon, MapPinIcon, CurrencyYenIcon, PrinterIcon } from "@heroicons/react/24/outline";

export default function PaymentSuccessPage() {
  const [orderData, setOrderData] = useState<{
    items: { id: number; name: string; count: number; price: number }[];
    deliveryAddress: { city: string; street: string; zipcode: string };
    email: string;
    totalPrice: number;
  } | null>(null);

  useEffect(() => {
    // sessionStorage에서 주문 데이터 가져오기
    const storedOrderData = sessionStorage.getItem("orderData");
    if (!storedOrderData) {
      alert("유효하지 않은 접근입니다.");
      window.location.href = "/"; // 메인 페이지로 리디렉트
      return;
    }

    const parsedOrderData = JSON.parse(storedOrderData);
    setOrderData(parsedOrderData); // 세션에서 불러온 데이터 그대로 사용
  }, []);

  if (!orderData) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="min-h-screen bg-gradient-to-b from-green-50 to-white py-12"
        >
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* 헤더 섹션 */}
                <div className="text-center mb-12">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="inline-block mb-6"
                    >
                        <CheckCircleIcon className="h-16 w-16 text-green-600" />
                    </motion.div>
                    <h1 className="text-4xl font-bold text-gray-800 mb-2">
                        🎉 결제가 완료되었습니다!
                    </h1>
                    <p className="text-lg text-gray-600">
                        주문해주셔서 감사합니다. 배송 정보를 확인해주세요.
                    </p>
                </div>

                {/* 주문 요약 카드 */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-white rounded-2xl shadow-lg p-8 mb-8"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* 고객 정보 */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <EnvelopeIcon className="h-6 w-6 text-blue-600" />
                                <div>
                                    <h3 className="text-sm text-gray-500">이메일</h3>
                                    <p className="font-medium">{orderData.email}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <MapPinIcon className="h-6 w-6 text-blue-600 mt-1" />
                                <div>
                                    <h3 className="text-sm text-gray-500">배송지</h3>
                                    <p className="font-medium">
                                        {orderData.deliveryAddress.city}{" "}
                                        {orderData.deliveryAddress.street}
                                        <br />
                                        ({orderData.deliveryAddress.zipcode})
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* 결제 요약 */}
                        <div className="border-l pl-8">
                            <div className="flex items-center gap-3 mb-6">
                                <CurrencyYenIcon className="h-6 w-6 text-green-600" />
                                <h3 className="text-lg font-bold">결제 요약</h3>
                            </div>
                            <div className="space-y-2">
                                {orderData.items.map((item, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ x: -20 }}
                                        animate={{ x: 0 }}
                                        className="flex justify-between py-2 border-b"
                                    >
                                        <div>
                                            <p className="font-medium">{item.name}</p>
                                            <p className="text-sm text-gray-500">
                                                {item.count}개 × {item.price.toLocaleString()}원
                                            </p>
                                        </div>
                                        <p className="font-medium">
                                            {(item.price * item.count).toLocaleString()}원
                                        </p>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* 총 결제 금액 */}
                <motion.div
                    initial={{ scale: 0.95 }}
                    animate={{ scale: 1 }}
                    className="bg-green-50 p-6 rounded-2xl text-center"
                >
                    <div className="inline-block bg-white rounded-lg px-6 py-4 shadow-sm">
                        <p className="text-sm text-gray-500 mb-1">최종 결제 금액</p>
                        <p className="text-3xl font-bold text-green-600">
                            {orderData.totalPrice.toLocaleString()}원
                        </p>
                    </div>
                </motion.div>

                {/* 액션 버튼 */}
                <div className="mt-8 flex justify-center gap-4">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        onClick={() => window.print()}
                        className="flex items-center gap-2 bg-white border border-gray-300 px-6 py-3 rounded-lg"
                    >
                        <PrinterIcon className="h-5 w-5" />
                        영수증 인쇄
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        onClick={() => (window.location.href = "/")}
                        className="bg-green-600 text-white px-6 py-3 rounded-lg"
                    >
                        홈으로 이동
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
}
