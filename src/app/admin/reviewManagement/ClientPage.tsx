"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface ReviewDto {
  reviewId: number;
  content: string;
  rating: number;
  createDate: string;
}

export default function ReviewByItems() {
  const [reviews, setReviews] = useState<ReviewDto[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://localhost:8080/api/v1/items/reviews")
      .then((response) => {
        if (!response.ok) {
          throw new Error("리뷰를 불러오는 데 실패했습니다.");
        }
        return response.json();
      })
      .then((data) => {
        setReviews(data.data); // 백엔드에서 가져온 리뷰 데이터 설정
      })
      .catch((error) => {
        console.error("Error fetching reviews:", error);
        setError("리뷰를 불러올 수 없습니다.");
      });
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">리뷰 목록</h1>
      <div className="mt-4">
        {error && <p className="text-red-500">{error}</p>}
        {reviews.length > 0 ? (
          <ul>
            {reviews.map((review) => (
              <li
                key={review.reviewId}
                className="p-4 border rounded-lg shadow-md bg-white mb-4"
              >
                <p className="text-lg font-semibold">"{review.content}"</p>
                <p className="text-yellow-500">⭐ {review.rating} / 5</p>
                <p className="text-sm text-gray-500">
                  작성일: {new Date(review.createDate).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p>등록된 리뷰가 없습니다.</p>
        )}
      </div>
    </div>
  );
}
