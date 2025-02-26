"use client";

import React, {useState, useEffect} from "react";
import {motion} from "framer-motion";
import {PencilIcon, TrashIcon} from "@heroicons/react/24/solid";
import { Slider, Box } from '@mui/material';

// 리뷰 내역 간단 조회 DTO
interface ReviewDetailDto {
    reviewId: number;
    content: string;
    rating: number;
    createDate: string;
    imageUrl: string;
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
    originalFileName?: File;  // 파일 업로드 필드 추가
}

// 기존 인터페이스에 리뷰 ID 추가 (수정용)
interface ReviewDetailDto extends ReviewRequest {
    reviewId: number;
    createDate: string;
}

// ItemDto 객체 인터페이스 정의
interface ItemDto {
    id: number;
    name: string;
    price: number;
    stockQuantity: number;
    description: string;
    imageUrl: string;
}

// API 응답 타입 정의
interface PaginatedResponse<T> {
    content: T[];
    pageable: {
        pageNumber: number;
        pageSize: number;
    };
    totalPages: number;
    totalElements: number;
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
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [tempFile, setTempFile] = useState<File | null>(null); // 새 파일 상태 추가
    const [value, setValue] = React.useState(3);
    const [items, setItems] = useState<ItemDto[]>([]);
    // 페이지네이션 및 정렬 상태
    const [page, setPage] = useState(0);
    const [size] = useState(8);
    const [totalPages, setTotalPages] = useState(1);
    const [sortBy, setSortBy] = useState("id"); // 기본 정렬: 상품번호순
    const [direction, setDirection] = useState("asc"); // 오름차순

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

    // 상품 목록 불러오기 (페이지 & 정렬 반영)
    useEffect(() => {
        setLoading(true);
        fetch(
            `http://localhost:8080/api/v1/items?page=${page}&size=${size}&sortBy=${sortBy}&direction=${direction}`
        )
            .then((response) => {
                if (!response.ok) {
                    throw new Error("데이터를 불러오는 데 실패했습니다.");
                }
                return response.json();
            })
            .then((data: { data: PaginatedResponse<ItemDto> }) => {
                setItems(data.data.content);
                setTotalPages(data.data.totalPages);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching items:", error);
                setError("상품 목록을 불러올 수 없습니다.");
                setLoading(false);
            });
    }, [page, size, sortBy, direction]); // 정렬 기준이 변경되면 다시 불러오기

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

            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error("요청한 데이터를 찾을 수 없습니다.");
                } else if (response.status === 500) {
                    throw new Error("서버에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.");
                } else {
                    throw new Error("데이터를 불러오는 데 실패했습니다.");
                }
            }

            // 응답 본문이 비어 있는 경우 처리
            const text = await response.text(); // 응답을 텍스트로 가져옴
            const data = text ? JSON.parse(text) : []; // 비어 있으면 빈 배열로

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
        const formData = new FormData();
        formData.append('content', reviewContent);
        formData.append('rating', reviewRating.toString());

        // 파일 추가 로직
        if (selectedFile) {
            formData.append('originalFileName', selectedFile);
        }

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

        try {
            const response = await fetch(
                `http://localhost:8080/api/reviews/${selectedItem.orderItemId}`,
                {
                    method: "POST",
                    credentials: "include",
                    body: formData,
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

    const cancelEditing = () => {
        setEditingReviewId(null);
        setTempContent("");
        setTempRating(1);
    };

    const updateReview = async (reviewId: number) => {
        try {
            const formData = new FormData();
            formData.append("content", tempContent);
            formData.append("rating", tempRating.toString());
            if (tempFile) {
                formData.append("originalFileName", tempFile); // 파일 추가
            }

            const response = await fetch(`http://localhost:8080/api/reviews/${reviewId}`, {
                method: "PUT",
                credentials: "include",
                body: formData, // FormData로 전송
            });

            if (!response.ok) throw new Error("리뷰 수정 실패");

            setWrittenReviews(prev =>
                prev.map(review =>
                    review.reviewId === reviewId
                        ? {
                            ...review,
                            content: tempContent,
                            rating: tempRating,
                            imageUrl: tempFile ? URL.createObjectURL(tempFile) : review.imageUrl
                        }
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

    const deleteReview = async (review: ReviewDetailDto) => {
        try {
            const response = await fetch(`http://localhost:8080/api/reviews/${review.reviewId}`, {
                method: "DELETE",
                credentials: "include",
            });

            if (!response.ok) throw new Error("리뷰 삭제 실패");

            setWrittenReviews(prev => prev.filter(r => r.reviewId !== review.reviewId));
            alert("리뷰가 삭제되었습니다!");
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
                                <li
                                    key={item.orderItemId}
                                    className="group p-4 border rounded-lg hover:bg-white hover:shadow-md transition-all duration-300 list-none" // Tailwind 클래스 추가
                                >
                                    <div className="flex items-center gap-4">

                                        <div
                                            className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                                            <span className="text-xs text-gray-400">상품 이미지</span>
                                        </div>

                                        {/* 텍스트 정보 영역 */}
                                        <div className="flex-1">
                                            <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                                {item.itemName}
                                            </h3>
                                            <div className="space-y-1">
                                                <p className="text-sm text-gray-500">
                                                    주문일: {new Date(item.orderDate).toLocaleDateString('ko-KR', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                                </p>
                                                <p className="text-sm text-blue-600 font-medium">
                                                    리뷰 작성
                                                    기한: {new Date(new Date(item.orderDate).getTime() + (9 * 24 * 60 * 60 * 1000)).toLocaleDateString('ko-KR', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                                </p>
                                            </div>
                                        </div>

                                        {/* 버튼 영역 */}
                                        <button
                                            onClick={() => openModal(item)}
                                            className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap self-start"
                                        >
                                            리뷰 작성
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </motion.div>
                    )}

                    {isModalOpen && (
                        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                                {/* 파일 업로드 섹션 */}
                                <div className="mb-4 space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">
                                        리뷰 이미지 첨부 (선택사항)
                                    </label>
                                    <input
                                        type="file"
                                        onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                                        accept="image/*"
                                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                    />
                                    {selectedFile && (
                                        <div className="mt-2">
                                            <img
                                                src={URL.createObjectURL(selectedFile)}
                                                alt="미리보기"
                                                className="max-h-40 w-auto object-cover rounded border"
                                            />
                                            <p className="mt-1 text-sm text-gray-500">
                                                선택된 파일: {selectedFile.name}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* 리뷰 내용 입력 */}
                                <h2 className="text-xl font-bold mb-4">{selectedItem?.itemName}</h2>
                                <textarea
                                    value={reviewContent}
                                    onChange={(e) => setReviewContent(e.target.value)}
                                    placeholder="리뷰 내용을 입력하세요"
                                    className="w-full border rounded p-2 mb-4 min-h-[100px]"
                                />

                                {/* 별점 입력 섹션 */}
                                <div className="w-full px-4 py-6 bg-gray-50 rounded-lg">
                                    <Slider
                                        value={value}
                                        min={1}
                                        max={5}
                                        step={1}
                                        onChange={(e, newValue) => setValue(newValue)}
                                        sx={{
                                            height: 12,
                                            '& .MuiSlider-thumb': {
                                                display: 'none'
                                            },
                                            '& .MuiSlider-track': {
                                                background: (theme) =>
                                                    `linear-gradient(90deg, ${theme.palette.primary.main} 0%, 
              ${theme.palette.secondary.main} 100%)`,
                                                border: 'none'
                                            }
                                        }}
                                    />
                                    <Box className="flex justify-between mt-2 text-sm text-gray-600">
                                        {[1, 2, 3, 4, 5].map((num) => (
                                            <span key={num} className={`${num <= value ? 'text-amber-600 font-bold' : ''}`}>
            {num}
          </span>
                                        ))}
                                    </Box>
                                </div>

                                {/* 버튼 그룹 */}
                                <div className="flex justify-end gap-3">
                                    <button
                                        onClick={closeModal}
                                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
                                    >
                                        취소
                                    </button>
                                    <button
                                        onClick={submitReview}
                                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                                    >
                                        리뷰 작성 완료
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}


                    {activeTab === "written" && (
                        <>
                            {/* 작성된 리뷰가 없는 경우 */}
                            {writtenReviews.length === 0 && !error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5 }}
                                    className="text-center space-y-6"
                                >
                                    <h2 className="text-xl font-bold text-gray-800">작성한 리뷰가 없습니다</h2>
                                    <p className="text-gray-600">
                                        상품을 구매하고 리뷰를 작성해 보세요! 😊
                                    </p>
                                    <button
                                        onClick={() => (window.location.href = "/")} // 메인 페이지로 이동
                                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-lg"
                                    >
                                        메인 페이지로 이동하기
                                    </button>
                                </motion.div>
                            )}

                            {/* 오류 발생 시 */}
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5 }}
                                    className="text-center space-y-6"
                                >
                                    <h2 className="text-xl font-bold text-red-600">오류가 발생했습니다</h2>
                                    <p className="text-gray-600">{error}</p>
                                    <button
                                        onClick={fetchData} // 다시 시도 버튼
                                        className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all shadow-lg"
                                    >
                                        다시 시도하기
                                    </button>
                                </motion.div>
                            )}

                            {/* 작성된 리뷰 목록 */}
                            {!loading && !error && writtenReviews.length > 0 && (
                                <motion.div className="space-y-6">
                                    {writtenReviews.map((review) => (
                                        <div key={review.reviewId}
                                             className="p-4 border rounded-lg hover:shadow-md transition">
                                            {editingReviewId === review.reviewId ? (
                                                // 수정 모드
                                                <div className="space-y-6">
                                                    {/* 이미지 업로드 */}
                                                    <div
                                                        className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            onChange={(e) => setTempFile(e.target.files?.[0] || null)}
                                                            className="hidden"
                                                            id={`fileInput-${review.reviewId}`}
                                                        />
                                                        <label
                                                            htmlFor={`fileInput-${review.reviewId}`}
                                                            className="block w-full px-4 py-2 text-sm text-center text-gray-600 bg-gray-50 rounded-md cursor-pointer hover:bg-gray-100 transition"
                                                        >
                                                            {tempFile ? "새 이미지 선택" : "이미지 변경"}
                                                        </label>
                                                        {tempFile ? (
                                                            <img
                                                                src={URL.createObjectURL(tempFile)}
                                                                alt="새 이미지 미리보기"
                                                                className="mt-4 h-48 w-full object-cover rounded-lg border"
                                                            />
                                                        ) : review.imageUrl ? (
                                                            <img
                                                                src={review.imageUrl}
                                                                alt="현재 이미지"
                                                                className="mt-4 h-48 w-full object-cover rounded-lg border"
                                                            />
                                                        ) : null}
                                                    </div>

                                                    {/* 리뷰 내용 입력 */}
                                                    <textarea
                                                        value={tempContent}
                                                        onChange={(e) => setTempContent(e.target.value)}
                                                        className="w-full p-3 border rounded-lg focus:ring-blue-500 focus:border-transparent text-sm"
                                                        rows={5}
                                                        placeholder="리뷰 내용을 작성해주세요"
                                                    />

                                                    <div className="w-full px-4 py-6 bg-gray-50 rounded-lg">
                                                        <Slider
                                                            value={value}
                                                            min={1}
                                                            max={5}
                                                            step={1}
                                                            onChange={(e, newValue) => setValue(newValue)}
                                                            sx={{
                                                                height: 12,
                                                                '& .MuiSlider-thumb': {
                                                                    display: 'none'
                                                                },
                                                                '& .MuiSlider-track': {
                                                                    background: (theme) =>
                                                                        `linear-gradient(90deg, ${theme.palette.primary.main} 0%, 
              ${theme.palette.secondary.main} 100%)`,
                                                                    border: 'none'
                                                                }
                                                            }}
                                                        />
                                                        <Box className="flex justify-between mt-2 text-sm text-gray-600">
                                                            {[1, 2, 3, 4, 5].map((num) => (
                                                                <span key={num} className={`${num <= value ? 'text-amber-600 font-bold' : ''}`}>
            {num}
          </span>
                                                            ))}
                                                        </Box>
                                                    </div>

                                                    {/* 버튼 그룹 */}
                                                    <div className="flex justify-end gap-3">
                                                        <button
                                                            onClick={cancelEditing}
                                                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                                                        >
                                                            취소하기
                                                        </button>
                                                        <button
                                                            onClick={() => updateReview(review.reviewId)}
                                                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                                        >
                                                            저장하기
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                // 보기 모드
                                                <div className="flex items-start gap-6">
                                                    {/* 이미지 영역 */}
                                                    {review.imageUrl && (
                                                        <img
                                                            src={review.imageUrl}
                                                            alt="리뷰 이미지"
                                                            className="w-[120px] h-[120px] object-cover rounded-lg border" // 기본 보기 모드에서 이미지 크기 확대
                                                        />
                                                    )}

                                                    {/* 텍스트 및 별점 영역 */}
                                                    <div className="flex flex-col flex-grow space-y-2">
                                                        <p className="text-gray-900 text-base">{review.content}</p>
                                                        <div className="flex items-center gap-2">
                                                            {/* 별점 텍스트로 표시 */}
                                                            <span
                                                                className="text-yellow-500 font-semibold">{review.rating}점</span>
                                                        </div>
                                                    </div>

                                                    {/* 수정/삭제 버튼 */}
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => startEditing(review)}
                                                            className="p-2 text-blue-600 hover:text-blue-700"
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
                </>)
            }
        </div>
    )
}

