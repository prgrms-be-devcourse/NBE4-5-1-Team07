"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion"; // 애니메이션 추가

// PointHistoryDto 인터페이스
export interface PointHistoryDto {
    amount: number; // 포인트 적립 및 차감 금액
    description: string; // 포인트 적립 및 차감 사유
    createDate: string; // 포인트 적립 및 차감 시각 (ISO 8601 형식)
  }

export default function PointHistory() {

  const [pointHistories, setPointHistories] = useState<PointHistoryDto[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // API 요청
    fetch("http://localhost:8080/api/point/history", {
      method: "GET",
      credentials: "include",
      headers: {
         "Content-Type": "application/json"
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => setPointHistories(data)) // 데이터를 상태에 저장
      .catch((err) => setError(err.message)); // 에러 처리
  }, []);

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  if (pointHistories.length === 0) {
    return <div className="text-center">적립금 내역이 없습니다.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">나의 적립 내역</h1>
      <div className="space-y-4">
        {pointHistories.map((history, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            <h2 className="text-lg font-semibold text-gray-800">
              {history.description}
            </h2>
            <p className={`text-sm ${history.amount > 0 ? "text-green-500" : "text-red-500"}`}>
              {history.amount > 0 ? `+${history.amount}` : `${history.amount}`} 포인트
            </p>
            <p className="text-sm text-gray-500">
              {new Date(history.createDate).toLocaleString()}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
