"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion"; // 애니메이션 추가
import { ExclamationTriangleIcon } from '@heroicons/react/24/solid';

// PointHistoryDto 인터페이스
export interface PointHistoryDto {
    amount: number; // 포인트 적립 및 차감 금액
    description: string; // 포인트 적립 및 차감 사유
    createDate: string; // 포인트 적립 및 차감 시각 (ISO 8601 형식)
  }

const ErrorDisplay = ({ message, onRetry }: {
    message: string;
    onRetry?: () => void
}) => (
    <div className="flex flex-col items-center justify-center min-h-[300px] space-y-4">
        <svg
            className="w-20 h-20 text-green-600 animate-bounce inline-block"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 3.5A9.004 9.004 0 0012 21a9 9 0 009-9 9 9 0 00-9-9 9 9 0 00-6.938 14.5z"
            />
        </svg>
        <p className="text-gray-600 text-lg font-medium">{message}</p>
        {onRetry && (
            <button
                onClick={onRetry}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
                다시 시도하기
            </button>
        )}
    </div>
);

const EmptyState = () => (
    <div className="flex flex-col items-center justify-center min-h-[300px] space-y-4">
        <img
            src="/empty-state.svg"
            alt="빈 상태 아이콘"
            className="w-32 h-32 opacity-75"
        />
        <p className="text-gray-500 text-lg">아직 적립금 내역이 없어요</p>
        <button
            onClick={() => window.location.href = '/stores'}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
        >
            첫 리뷰 작성하러 가기 →
        </button>
    </div>
);

const LoadingSpinner = () => (
    <div className="flex justify-center items-center min-h-[300px]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
    </div>
);

export default function PointHistory() {
    const [pointHistories, setPointHistories] = useState<PointHistoryDto[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [retryCount, setRetryCount] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const response = await fetch("http://localhost:8080/api/point/history", {
                    method: "GET",
                    credentials: "include",
                    headers: { "Content-Type": "application/json" }
                });

                if (!response.ok) {
                    const errorMsg = response.status === 404
                        ? "아직 적립금 내역이 없어요. 첫 리뷰를 남겨보세요! 🎉"
                        : "데이터를 불러오는데 실패했어요. 잠시 후 다시 시도해주세요.";
                    throw new Error(errorMsg);
                }

                const data = await response.json();
                setPointHistories(data);
                setError(null);
            } catch (err) {
                const errorMessage = err instanceof Error
                    ? err.message.includes('Failed to fetch')
                        ? "인터넷 연결 상태를 확인해주세요 🌐"
                        : err.message
                    : "알 수 없는 오류가 발생했어요";
                setError(errorMessage);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [retryCount]);

    const handleRetry = () => {
        setRetryCount(prev => prev + 1);
        setError(null);
    };

    if (isLoading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return <ErrorDisplay message={error} onRetry={handleRetry} />;
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
