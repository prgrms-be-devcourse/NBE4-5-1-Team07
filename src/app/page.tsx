"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useDispatch } from 'react-redux';
import { addToCart } from '@/redux/cart.slice';

// ItemDto 인터페이스 정의
interface ItemDto {
    id: number;
    name: string;
    price: number;
    stockQuantity: number;
    description: string;
    imageUrl: string;
}

// NoticeDto 인터페이스 추가
interface NoticeDto {
    id: number;
    title: string;
    content: string;
    createDate: string;
    modifyDate: string;
}

export default function Home() {
    const [items, setItems] = useState<ItemDto[]>([]); // 상품 데이터 상태
    const [loading, setLoading] = useState(true); // 로딩 상태
    const [error, setError] = useState(""); // 에러 메시지
    const dispatch = useDispatch();
    const [notices, setNotices] = useState<NoticeDto[]>([]);

    const handleAddToCart = (item: any) => {
        dispatch(addToCart({
            id: item.id,
            name: item.name,
            quantity: 1
        }));
        alert(`${item.name}을(를) 장바구니에 담았습니다.`);
    };

    // 캐러셀 상태
    const [currentIndex, setCurrentIndex] = useState(0); // 현재 슬라이드 인덱스

    // 상품 목록 불러오기
    useEffect(() => {
        setLoading(true);
        fetch("http://localhost:8080/api/v1/items?page=0&size=20&sortBy=id&direction=asc")
            .then((response) => {
                if (!response.ok) {
                    throw new Error("상품 목록을 불러오는 데 실패했습니다.");
                }
                return response.json();
            })
            .then((data) => {
                setItems(data.data.content); // 백엔드 응답 구조에 맞게 설정
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching items:", error);
                setError("상품 목록을 불러올 수 없습니다.");
                setLoading(false);
            });
    }, []);

    // 슬라이드 이동 핸들러
    const handlePrev = () => {
        setCurrentIndex((prev) => Math.max(prev - 1, 0));
    };

    const handleNext = () => {
        setCurrentIndex((prev) =>
            Math.min(prev + 1, Math.ceil(items.length / 4) - 1)
        );
    };

    // 공지사항 불러오기 (기존 방식 유지)
    useEffect(() => {
        fetch("http://localhost:8080/api/v1/notices")
            .then((response) => {
                if (!response.ok) {
                    throw new Error("공지사항을 불러오는 데 실패했습니다.");
                }
                return response.json();
            })
            .then((data) => {
                setNotices(data.data); // API 응답 구조에 맞게 수정
            })
            .catch((error) => {
                console.error("Error fetching notices:", error);
            });
    }, []);

    // 공지사항 날짜 표시 포맷팅 함수
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return `${date.getFullYear()}. 
          ${(date.getMonth() + 1).toString().padStart(2, '0')}. 
          ${date.getDate().toString().padStart(2, '0')}`;
    };

    return (
        <div className="container mx-auto px-4 py-8">
            {/* 이벤트 배너 (메인 타이틀 대체) */}
            <Link href="/items" className="block mb-8">
                <div className="p-4 bg-gradient-to-r from-[#0077b6] to-[#03045e] text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer group">
                    <div className="flex flex-col items-center space-y-2">
                        {/* 이모지 & 타이틀 */}
                        <div className="flex items-center gap-2 animate-bounce">
                            <span className="text-2xl">🎁</span>
                            <h2 className="text-xl font-bold">Bean Voyage Festa</h2>
                            <span className="text-2xl">☕</span>
                        </div>

                        {/* 서브 타이틀 */}
                        <p className="text-sm text-center opacity-90 group-hover:opacity-100 transition-opacity">
                            프리미엄 원두 구매 후 포토 리뷰 시 추가 적립 + 커피 기프트박스 증정
                        </p>

                        {/* 액션 버튼 (사이즈 문제 해결) */}
                        <Button
                            className="mt-2 px-6 py-3 text-sm bg-white/20 hover:bg-white/30 backdrop-blur-sm text-[#ffd700] hover:text-[#ffdf80] font-semibold transition-colors"
                            variant="ghost"
                        >
                            지금 구매하기 →
                        </Button>
                    </div>
                </div>
            </Link>
            {/* 로딩 및 에러 처리 */}

            {loading ? (
                <p className="text-center text-gray-500">상품을 불러오는 중입니다...</p>
            ) : error ? (
                <p className="text-center text-red-500">{error}</p>
            ) : (
                <>
                    {/* 개선된 캐러셀 */}
                    <div className="relative overflow-hidden group">
                        {/* 슬라이드 컨테이너 */}
                        <div
                            className="flex transition-transform duration-500 ease-in-out"
                            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                        >
                            {items.map((item) => (
                                <div
                                    key={item.id}
                                    className="w-full flex-shrink-0 p-4"
                                    style={{ width: '25%' }}
                                >
                                    <div className="border rounded-lg p-4 hover:shadow-xl transition-all duration-300 bg-white">
                                        <img
                                            src={item.imageUrl}
                                            alt={item.name}
                                            className="w-full h-48 object-cover rounded-md mb-4"
                                        />
                                        <h3 className="font-bold text-lg">{item.name}</h3>
                                        <p className="text-gray-600 mt-2 line-clamp-2">
                                            {item.description}
                                        </p>
                                        <div className="mt-4 flex justify-between items-center">
                                            <p className="text-blue-600 font-bold">
                                                ₩{item.price.toLocaleString()}
                                            </p>
                                            {item.stockQuantity === 0 && (
                                                <span className="text-red-500 text-sm">품절</span>
                                            )}
                                        </div>
                                        <div className="mt-4 flex gap-2">
                                            <Link href={`/items/${item.id}`} className="flex-1">
                                                <Button variant="outline" className="w-full">
                                                    상세보기
                                                </Button>
                                            </Link>
                                            <Button
                                                variant="secondary"
                                                onClick={() => handleAddToCart(item)}
                                                disabled={item.stockQuantity === 0}
                                            >
                                                장바구니
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* 캐러셀 컨트롤 버튼 */}
                        <button
                            onClick={handlePrev}
                            disabled={currentIndex === 0}
                            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm p-3 rounded-full shadow-xl hover:bg-white transition-all disabled:opacity-0"
                        >
                            <ChevronLeft className="h-6 w-6" />
                        </button>
                        <button
                            onClick={handleNext}
                            disabled={currentIndex >= Math.ceil(items.length / 4) - 1}
                            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm p-3 rounded-full shadow-xl hover:bg-white transition-all disabled:opacity-0"
                        >
                            <ChevronRight className="h-6 w-6" />
                        </button>
                    </div>

                    {/* 추가된 공지사항 섹션 */}
                    <div className="mt-12 bg-gray-100 rounded-2xl p-6 shadow-lg">
                        <div className="flex flex-col gap-4">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-2xl font-bold text-gray-800">📢 최신 공지사항</h2>
                                <Link href="/notices">
                                    <Button
                                        variant="outline"
                                        className="bg-blue-100 hover:bg-blue-200 text-blue-600"
                                    >
                                        전체보기
                                    </Button>
                                </Link>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {notices.slice(0, 3).map((notice) => (
                                    <article
                                        key={notice.id}
                                        className="bg-white p-6 rounded-xl hover:shadow-md transition-shadow"
                                    >
                                        <Link href={`/notices/${notice.id}`} className="block">
                                            <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                                {notice.title}
                                            </h3>
                                            <time className="text-sm text-gray-500 block mb-3">
                                                {formatDate(notice.createDate)}
                                            </time>
                                            <div
                                                className="text-gray-600 line-clamp-2 text-sm"
                                                dangerouslySetInnerHTML={{ __html: notice.content }}
                                            />
                                        </Link>
                                    </article>
                                ))}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}