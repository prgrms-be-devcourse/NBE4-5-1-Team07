"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";

interface NoticeDto {
  id: number;
  title: string;
  content: string;
  createDate: string;
  modifyDate: string;
}

export default function Notices() {
  const [notices, setNotices] = useState<NoticeDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);

  const searchParams = useSearchParams();
  const router = useRouter();

  // 현재 페이지 (쿼리 파라미터에서 가져오거나 기본값 0)
  const currentPage = Number(searchParams.get("page")) || 0;
  const pageSize = 5; // 한 페이지에 표시할 공지 개수

  useEffect(() => {
    setLoading(true);
    fetch(
      `http://localhost:8080/api/v1/notices/list?page=${currentPage}&size=${pageSize}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.data) {
          setNotices(data.data.content); // Page 객체의 content 부분만 가져옴
          setTotalPages(data.data.totalPages); // 전체 페이지 수 저장
        } else {
          setError("데이터를 불러오지 못했습니다.");
        }
      })
      .catch(() => setError("공지사항을 불러오는 중 오류가 발생했습니다."))
      .finally(() => setLoading(false));
  }, [currentPage]); // currentPage가 변경될 때마다 호출

  // 페이지 이동 함수
  const handlePageChange = (newPage: number) => {
    router.push(`/notices?page=${newPage}`);
  };

  if (loading) return <p>로딩 중...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">공지사항</h1>
      <ul className="space-y-4">
        {notices.map((notice) => (
          <li
            key={notice.id}
            className="p-4 border rounded-lg shadow hover:bg-gray-100 transition"
          >
            <Link href={`/notices/${notice.id}`} className="block">
              <h2 className="text-xl font-semibold">{notice.title}</h2>
              <p className="text-gray-600 text-sm">
                {new Date(notice.createDate).toLocaleString()}
              </p>
              <p
                className="mt-2 text-gray-700 line-clamp-1"
                dangerouslySetInnerHTML={{ __html: notice.content }}
              />
            </Link>
          </li>
        ))}
      </ul>

      {/* 페이지네이션 UI */}
      <div className="flex justify-center mt-4 space-x-2">
        <button
          className="px-4 py-2 border rounded disabled:opacity-50"
          disabled={currentPage === 0}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          이전
        </button>
        <span className="px-4 py-2">
          {currentPage + 1} / {totalPages}
        </span>
        <button
          className="px-4 py-2 border rounded disabled:opacity-50"
          disabled={currentPage + 1 >= totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          다음
        </button>
      </div>
    </div>
  );
}
