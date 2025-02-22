"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

// ReviewableOrderItemDto 타입 정의
interface ReviewableOrderItemDto {
    orderItemId: number; // 주문 아이템 ID
    itemName: string;    // 상품명
    orderDate: string;   // 주문 날짜 (ISO 문자열)
}

// 작성한 리뷰 DTO 타입 정의
interface ReviewDetailDto {
    reviewId: number;    // 리뷰 ID
    content: string;     // 리뷰 내용
    rating: number;      // 별점
    createDate: string;  // 작성 날짜 (ISO 문자열)
}

export default function ReviewsPage({ params }: { params: { email: string } }) {
    const email = params.email; // URL 경로에서 email 추출
    const [activeTab, setActiveTab] = useState("pending"); // 현재 활성화된 탭 ("pending" 또는 "written")
    const [pendingReviews, setPendingReviews] = useState<ReviewableOrderItemDto[]>([]); // 작성 가능한 리뷰 데이터
    const [writtenReviews, setWrittenReviews] = useState<ReviewDetailDto[]>([]); // 작성한 리뷰 데이터
    const [loading, setLoading] = useState(true); // 로딩 상태
    const [error, setError] = useState<string | null>(null); // 에러 상태

    const [isModalOpen, setIsModalOpen] = useState(false); // 모달 창 열림 상태
    const [selectedItem, setSelectedItem] = useState<ReviewableOrderItemDto | null>(null); // 선택된 아이템
    const [selectedReview, setSelectedReview] = useState<ReviewDetailDto | null>(null); // 선택된 리뷰
    const [reviewContent, setReviewContent] = useState(""); // 리뷰 내용
    const [reviewRating, setReviewRating] = useState(1);    // 별점
    const [completedReviews, setCompletedReviews] = useState<number[]>([]); // 작성 완료된 리뷰 ID 목록

    // API 요청 함수
    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);

            if (activeTab === "pending") {
                const response = await fetch(`http://localhost:8080/api/reviews/pending/${email}`);
                if (!response.ok) throw new Error("작성 가능한 리뷰를 불러오는 데 실패했습니다.");
                const data: ReviewableOrderItemDto[] = await response.json();
                setPendingReviews(data);
            } else if (activeTab === "written") {
                const response = await fetch(`http://localhost:8080/api/reviews/${email}`);
                if (!response.ok) throw new Error("작성한 리뷰를 불러오는 데 실패했습니다.");
                const data: ReviewDetailDto[] = await response.json();
                setWrittenReviews(data);
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // 리뷰 등록 요청 함수
    const submitReview = async () => {
        if (!selectedItem) return;

        try {
            const response = await fetch(`http://localhost:8080/api/reviews/${selectedItem.orderItemId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    content: reviewContent,
                    rating: reviewRating,
                }),
            });

            if (!response.ok) throw new Error("리뷰 등록에 실패했습니다.");
            alert("리뷰가 성공적으로 작성되었습니다!");

            // 작성 완료 상태 업데이트
            setCompletedReviews((prev) => [...prev, selectedItem.orderItemId]);

            // 모달 닫기 및 데이터 초기화
            setIsModalOpen(false);
            setReviewContent("");
            setReviewRating(1);
        } catch (err) {
            alert("리뷰 등록 중 오류가 발생했습니다.");
        }
    };

    // 리뷰 수정 요청 함수
    const modifyReview = async () => {
        if (!selectedReview) return;

        try {
            const response = await fetch(`http://localhost:8080/api/reviews/${selectedReview.reviewId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    content: reviewContent,
                    rating: reviewRating,
                }),
            });

            if (!response.ok) throw new Error("리뷰 수정에 실패했습니다.");
            alert("리뷰가 성공적으로 수정되었습니다!");

            // 수정된 데이터 반영
            setWrittenReviews((prev) =>
                prev.map((review) =>
                    review.reviewId === selectedReview.reviewId
                        ? { ...review, content: reviewContent, rating: reviewRating }
                        : review
                )
            );

            // 모달 닫기 및 초기화
            setIsModalOpen(false);
            setSelectedReview(null);
            setReviewContent("");
            setReviewRating(1);
        } catch (err) {
            alert("리뷰 수정 중 오류가 발생했습니다.");
        }
    };

    // 리뷰 삭제 요청 함수
    const deleteReview = async (reviewId: number) => {
        try {
            const response = await fetch(`http://localhost:8080/api/reviews/${reviewId}`, {
                method: "DELETE",
            });

            if (!response.ok) throw new Error("리뷰 삭제에 실패했습니다.");
            alert("리뷰가 성공적으로 삭제되었습니다!");

            // 삭제된 데이터 반영
            setWrittenReviews((prev) => prev.filter((review) => review.reviewId !== reviewId));
        } catch (err) {
            alert("리뷰 삭제 중 오류가 발생했습니다.");
        }
    };

    // 컴포넌트가 마운트될 때 데이터 가져오기
    useEffect(() => {
        fetchData();
    }, [activeTab]);

    return (
        <div className="max-w-5xl mx-auto p-8">
            {/* 탭 메뉴 */}
            <div className="flex justify-center mb-8">
                <button
                    className={`text-lg font-bold px-8 py-4 rounded-t-lg ${
                        activeTab === "pending" ? "bg-blue-600 text-white" : "bg-gray-300 text-gray-700"
                    } transition-all duration-300`}
                    onClick={() => setActiveTab("pending")}
                >
                    작성 가능한 리뷰
                </button>
                <button
                    className={`text-lg font-bold px-8 py-4 rounded-t-lg ${
                        activeTab === "written" ? "bg-blue-600 text-white" : "bg-gray-300 text-gray-700"
                    } transition-all duration-300`}
                    onClick={() => setActiveTab("written")}
                >
                    작성한 리뷰
                </button>
            </div>

            {/* 로딩 상태 */}
            {loading && <p className="text-center text-gray-500">로딩 중...</p>}

            {/* 에러 상태 */}
            {error && <p className="text-center text-red-500">{error}</p>}

            {/* 탭 내용 */}
            {!loading && !error && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                    {activeTab === "pending" && (
                        <div>
                            {pendingReviews.length > 0 ? (
                                pendingReviews.map((item) => (
                                    <div key={item.orderItemId} className="border rounded-lg p-6 mb-6 shadow-md">
                                        <h3 className="text-xl font-semibold">{item.itemName}</h3>
                                        <p className="text-gray-600">주문 날짜: {new Date(item.orderDate).toLocaleDateString()}</p>
                                        {completedReviews.includes(item.orderItemId) ? (
                                            <button
                                                className="mt-4 bg-gray-400 text-white px-6 py-2 rounded cursor-not-allowed"
                                                disabled
                                            >
                                                작성 완료
                                            </button>
                                        ) : (
                                            <button
                                                className="mt-4 bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 transition-all"
                                                onClick={() => {
                                                    setSelectedItem(item);
                                                    setIsModalOpen(true);
                                                }}
                                            >
                                                리뷰 등록
                                            </button>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <p className="text-center text-gray-500">작성 가능한 리뷰가 없습니다.</p>
                            )}
                        </div>
                    )}

                    {activeTab === "written" && (
                        <div>
                            {writtenReviews.length > 0 ? (
                                writtenReviews.map((review) => (
                                    <div key={review.reviewId} className="border rounded-lg p-6 mb-6 shadow-md flex justify-between items-center">
                                        <div>
                                            <h3 className="text-xl font-semibold">{review.content}</h3>
                                            <p>별점:{"⭐".repeat(review.rating)}</p>
                                            <p className="text-gray-600">작성 날짜: {new Date(review.createDate).toLocaleDateString()}</p>
                                        </div>
                                        <div className="space-x-4">
                                            <button
                                                onClick={() => {
                                                    setSelectedReview(review);
                                                    setIsModalOpen(true);
                                                    setReviewContent(review.content);
                                                    setReviewRating(review.rating);
                                                }}
                                                className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition-all"
                                            >
                                                수정
                                            </button>
                                            <button
                                                onClick={() => deleteReview(review.reviewId)}
                                                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-all"
                                            >
                                                삭제
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center text-gray-500">작성한 리뷰가 없습니다.</p>
                            )}
                        </div>
                    )}
                </motion.div>
            )}

            {/* 리뷰 수정 모달 */}
            {isModalOpen && selectedReview && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                        <h2 className="text-xl font-bold mb-4">리뷰 수정</h2>
                        <textarea
                            value={reviewContent}
                            onChange={(e) => setReviewContent(e.target.value)}
                            placeholder="리뷰 내용을 입력하세요"
                            className="w-full border rounded p-2 mb-4"
                        />
                        <label className="block mb-2 font-semibold">별점</label>
                        <select
                            value={reviewRating}
                            onChange={(e) => setReviewRating(Number(e.target.value))}
                            className="w-full border rounded p-2 mb-4"
                        >
                            {[1, 2, 3, 4, 5].map((rating) => (
                                <option key={rating} value={rating}>
                                    {rating}점
                                </option>
                            ))}
                        </select>
                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={() => {
                                    setIsModalOpen(false);
                                    setSelectedReview(null);
                                }}
                                className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition-all"
                            >
                                취소
                            </button>
                            <button
                                onClick={modifyReview}
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-all"
                            >
                                저장하기
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* 리뷰 작성 모달 */}
            {isModalOpen && selectedItem && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                        <h2 className="text-xl font-bold mb-4">{selectedItem.itemName}</h2>
                        <textarea
                            value={reviewContent}
                            onChange={(e) => setReviewContent(e.target.value)}
                            placeholder="리뷰 내용을 입력하세요"
                            className="w-full border rounded p-2 mb-4"
                        />
                        <label className="block mb-2 font-semibold">별점</label>
                        <select
                            value={reviewRating}
                            onChange={(e) => setReviewRating(Number(e.target.value))}
                            className="w-full border rounded p-2 mb-4"
                        >
                            {[1, 2, 3, 4, 5].map((rating) => (
                                <option key={rating} value={rating}>
                                    {rating}점
                                </option>
                            ))}
                        </select>
                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition-all"
                            >
                                취소
                            </button>
                            <button
                                onClick={submitReview}
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-all"
                            >
                                등록하기
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

