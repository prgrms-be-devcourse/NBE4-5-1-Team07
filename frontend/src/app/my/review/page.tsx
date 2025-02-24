"use client";

import {useState, useEffect} from "react";
import {motion} from "framer-motion";
import {PencilIcon, TrashIcon} from "@heroicons/react/24/solid";

// 리뷰 내역 간단 조회 DTO
interface ReviewDetailDto {
    reviewId: number;
    content: string;
    rating: number;
    createDate: string;
}

// 작성 가능 리뷰 DTO
interface ReviewableOrderItemDto {
    orderItemId: number;
    itemName: string;
    orderDate: string;
    isWritten: boolean;
}

// 리뷰 작성 요청 DTO
interface ReviewRequest {
    content: string; // 리뷰 내용
    rating: number;  // 별점 (1~5)
}

// 기존 인터페이스에 리뷰 ID 추가 (수정용)
interface ReviewDetailDto extends ReviewRequest {
    reviewId: number;
    createDate: string;
}


export default function ReviewsPage() {
    const [activeTab, setActiveTab] = useState<"pending" | "written">("pending");
    const [pendingReviews, setPendingReviews] = useState<ReviewableOrderItemDto[]>([]);
    const [writtenReviews, setWrittenReviews] = useState<ReviewDetailDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<ReviewableOrderItemDto | null>(null);
    const [reviewContent, setReviewContent] = useState("");
    const [reviewRating, setReviewRating] = useState(1);
    const [editingReviewId, setEditingReviewId] = useState<number | null>(null);
    const [tempContent, setTempContent] = useState("");
    const [tempRating, setTempRating] = useState(1);

    // 모달 열기 함수
    const openModal = (item: ReviewableOrderItemDto) => {
        setSelectedItem(item); // 선택된 리뷰 데이터 저장
        setIsModalOpen(true); // 모달 열기
        setReviewContent(""); // 리뷰 내용 초기화
        setReviewRating(1); // 별점 초기화
    };

    // 모달 닫기 함수
    const closeModal = () => {
        setIsModalOpen(false); // 모달 닫기
        setSelectedItem(null); // 선택된 데이터 초기화
        setReviewContent(""); // 리뷰 내용 초기화
        setReviewRating(1); // 별점 초기화
    };

    // API 요청 함수
    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);

            const endpoint =
                activeTab === "pending"
                    ? "http://localhost:8080/api/reviews/pending"
                    : "http://localhost:8080/api/reviews/written";

            const response = await fetch(endpoint, {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) throw new Error("데이터를 불러오는 데 실패했습니다.");

            const data = await response.json();
            if (activeTab === "pending") {
                setPendingReviews(data);
            } else {
                setWrittenReviews(data);
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // 탭 변경 시 데이터 가져오기
    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const submitReview = async () => {
        if (!selectedItem) {
            alert("리뷰를 작성할 항목이 선택되지 않았습니다.");
            return;
        }

        if (!reviewContent.trim()) {
            alert("리뷰 내용을 입력해주세요.");
            return;
        }

        if (reviewRating < 1 || reviewRating > 5) {
            alert("별점은 1점에서 5점 사이여야 합니다.");
            return;
        }

        const reviewRequest: ReviewRequest = {
            content: reviewContent.trim(),
            rating: reviewRating,
        };

        try {
            const response = await fetch(
                `http://localhost:8080/api/reviews/${selectedItem.orderItemId}`,
                {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(reviewRequest),
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                console.error("서버 응답:", errorData);
                throw new Error("리뷰 등록에 실패했습니다.");
            }

            alert("리뷰가 성공적으로 작성되었습니다!");

            setPendingReviews((prev) =>
                prev.filter((item) => item.orderItemId !== selectedItem.orderItemId)
            );

            closeModal(); // 모달 닫기
        } catch (err) {
            console.error("리뷰 등록 중 오류 발생:", err);
            alert("리뷰 등록 중 오류가 발생했습니다.");
        }
    };

    // 수정 시작
    const startEditing = (review: ReviewDetailDto) => {
        setEditingReviewId(review.reviewId);
        setTempContent(review.content);
        setTempRating(review.rating);
    };

    // 수정 취소
    const cancelEditing = () => {
        setEditingReviewId(null);
        setTempContent("");
        setTempRating(1);
    };

    // 리뷰 수정 함수 (변경 부분)
    const updateReview = async (reviewId: number) => {
        try {
            const response = await fetch(`http://localhost:8080/api/reviews/${reviewId}`, {
                method: "PUT",
                credentials: "include",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({content: tempContent, rating: tempRating}),
            });

            if (!response.ok) throw new Error("리뷰 수정 실패");

            setWrittenReviews(prev =>
                prev.map(review =>
                    review.reviewId === reviewId
                        ? {...review, content: tempContent, rating: tempRating}
                        : review
                )
            );
            cancelEditing();
            alert("리뷰가 수정되었습니다!");
        } catch (err) {
            console.error(err);
            alert("리뷰 수정 중 오류 발생");
        }
    };

    // 리뷰 삭제 함수
    const deleteReview = async (review: ReviewDetailDto) => {
        if (!confirm("정말로 이 리뷰를 삭제하시겠습니까?")) return;

        try {
            const response = await fetch(
                `http://localhost:8080/api/reviews/${review.reviewId}`,
                {
                    method: "DELETE",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            if (!response.ok) throw new Error("리뷰 삭제 실패");

            alert("리뷰가 삭제되었습니다!");
            setWrittenReviews((prev) =>
                prev.filter((r) => r.reviewId !== review.reviewId)
            );
        } catch (err) {
            console.error(err);
            alert("리뷰 삭제 중 오류 발생");
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            {/* 탭 전환 */}
            <motion.div
                initial={{opacity: 0, y: -10}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 0.5}}
                className="flex border-b mb-8"
            >
                <button
                    className={`flex-1 py-2 text-center ${activeTab === "pending"
                        ? "border-b-2 border-blue-600 text-blue-600 font-semibold"
                        : "text-gray-500 hover:text-gray-800"
                    }`}
                    onClick={() => setActiveTab("pending")}
                >
                    작성 가능한 리뷰
                </button>
                <button
                    className={`flex-1 py-2 text-center ${activeTab === "written"
                        ? "border-b-2 border-blue-600 text-blue-600 font-semibold"
                        : "text-gray-500 hover:text-gray-800"
                    }`}
                    onClick={() => setActiveTab("written")}
                >
                    작성한 리뷰
                </button>
            </motion.div>

            {/* 로딩 상태 */}
            {loading && (
                <motion.p
                    initial={{opacity: 0}}
                    animate={{opacity: 1}}
                    transition={{duration: 0.5}}
                    className="text-center text-gray-500"
                >
                    로딩 중...
                </motion.p>
            )}

            {/* 에러 상태 */}
            {error && (
                <motion.p
                    initial={{opacity: 0}}
                    animate={{opacity: 1}}
                    transition={{duration: 0.5}}
                    className="text-center text-red-500"
                >
                    {error}
                </motion.p>
            )}

            {/* 탭 내용 */}
            {!loading && !error && (
                <>
                    {/* 작성 가능한 리뷰 */}
                    {activeTab === "pending" && (
                        <motion.div
                            initial={{opacity: 0, y: -10}}
                            animate={{opacity: 1, y: 0}}
                            transition={{duration: 0.5}}
                            className="space-y-4">

                            {/* [추가] 작성 가능한 후기 수 표시 */}
                            <div className="bg-blue-50 p-4 rounded-lg">
                                <p className="text-blue-800 font-medium">
                                    📝 작성 가능한 후기가 총 {pendingReviews.length}건 있습니다
                                </p>
                            </div>

                            {pendingReviews.map((item) => (
                                <li key={item.orderItemId}
                                    className="p-4 border rounded-lg hover:bg-gray-50 transition">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <h3 className="font-medium text-gray-900">{item.itemName}</h3>
                                            <p className="text-sm text-gray-500">{new Date(item.orderDate).toLocaleDateString()}</p>
                                        </div>
                                        <button
                                            onClick={() => openModal(item)}
                                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                                        >
                                            리뷰 작성
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </motion.div>
                    )}

                    {isModalOpen && ( // 작성 모달
                        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full z-60">
                                {/* 작성 모달 내용 */}
                                <h2 className="text-xl font-bold mb-4">{selectedItem?.itemName}</h2>
                                <textarea
                                    value={reviewContent}
                                    onChange={(e) => setReviewContent(e.target.value)}
                                    placeholder="리뷰 내용을 입력하세요"
                                    className="w-full border rounded p-2 mb-4"
                                />
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
                                    <button onClick={closeModal}
                                            className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400">
                                        취소
                                    </button>
                                    <button onClick={submitReview}
                                            className="bg-blue-500 px-4 py-2 text-white rounded hover:bg-blue-600">
                                        저장하기
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}


                    {/* 작성된 리뷰 (수정 부분) */}
                    {activeTab === "written" && (
                        <motion.div className="space-y-4">
                            {writtenReviews.map(review => (
                                <div key={review.reviewId} className="p-4 border rounded-lg hover:bg-gray-50 group">
                                    {editingReviewId === review.reviewId ? (
                                        // 수정 모드 UI
                                        <div className="space-y-4">
                  <textarea
                      value={tempContent}
                      onChange={(e) => setTempContent(e.target.value)}
                      className="w-full border rounded p-2 mb-2"
                      rows={3}
                  />
                                            <select
                                                value={tempRating}
                                                onChange={(e) => setTempRating(Number(e.target.value))}
                                                className="w-full border rounded p-2 mb-2"
                                            >
                                                {[1, 2, 3, 4, 5].map(rating => (
                                                    <option key={rating} value={rating}>{rating}점</option>
                                                ))}
                                            </select>
                                            <div className="flex justify-end space-x-2">
                                                <button
                                                    onClick={cancelEditing}
                                                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                                                >
                                                    취소
                                                </button>
                                                <button
                                                    onClick={() => updateReview(review.reviewId)}
                                                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                                                >
                                                    저장
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        // 기본 보기 모드
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <h3 className="font-medium">{review.content}</h3>
                                                <p className="text-sm text-gray-500">
                                                    ⭐ {review.rating} • {new Date(review.createDate).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => startEditing(review)}
                                                    className="p-2 text-yellow-600 hover:text-yellow-700"
                                                >
                                                    <PencilIcon className="w-5 h-5"/>
                                                </button>
                                                <button
                                                    onClick={() => deleteReview(review)}
                                                    className="p-2 text-red-600 hover:text-red-700"
                                                >
                                                    <TrashIcon className="w-5 h-5"/>
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </motion.div>
                    )}
                </>
            )}
        </div>
    );
}