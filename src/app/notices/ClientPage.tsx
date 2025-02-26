"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeftIcon, ChevronRightIcon, MegaphoneIcon } from "@heroicons/react/24/outline";

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

  if (loading)
    return (
        <div className="max-w-3xl mx-auto p-4 space-y-4">
          {[...Array(5)].map((_, i) => (
              <div
                  key={i}
                  className="h-20 bg-gray-100 rounded-xl animate-pulse"
              />
          ))}
        </div>
    );

  if (error)
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-3xl mx-auto p-4 bg-red-50 text-red-700 p-4 rounded-xl flex items-center gap-2"
        >
          ⚠️ {error}
        </motion.div>
    );

  return (
      <div className="max-w-3xl mx-auto p-4">
        <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold mb-8 flex items-center gap-2 text-blue-600"
        >
          <MegaphoneIcon className="h-8 w-8" />
          공지사항
        </motion.h1>

        <AnimatePresence mode="wait">
          <motion.ul
              key={currentPage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
          >
            {notices.map((notice) => (
                <motion.li
                    key={notice.id}
                    whileHover={{ scale: 1.01 }}
                    className="group"
                >
                  <Link
                      href={`/notices/${notice.id}`}
                      className="block p-6 bg-white border-l-4 border-blue-500 rounded-lg shadow-sm hover:shadow-md transition-all"
                  >
                    <div className="flex items-start gap-3">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <MegaphoneIcon className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h2 className="text-xl font-semibold group-hover:text-blue-600 transition-colors">
                          {notice.title}
                        </h2>
                        <p className="text-gray-500 text-sm mt-1">
                          {new Date(notice.createDate).toLocaleDateString("ko-KR", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                        <div
                            className="mt-2 text-gray-600 line-clamp-2 prose"
                            dangerouslySetInnerHTML={{ __html: notice.content }}
                        />
                      </div>
                    </div>
                  </Link>
                </motion.li>
            ))}
          </motion.ul>
        </AnimatePresence>

        {/* 페이지네이션 */}
        <motion.div
            className="flex items-center justify-center gap-2 mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
          <button
              className="p-2 rounded-lg border hover:bg-gray-50 disabled:opacity-30 disabled:hover:bg-white transition-colors"
              disabled={currentPage === 0}
              onClick={() => handlePageChange(currentPage - 1)}
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-1 mx-4">
            {Array.from({ length: totalPages }).map((_, idx) => (
                <button
                    key={idx}
                    onClick={() => handlePageChange(idx)}
                    className={`w-8 h-8 rounded-full ${
                        currentPage === idx
                            ? "bg-blue-500 text-white"
                            : "hover:bg-gray-100"
                    }`}
                >
                  {idx + 1}
                </button>
            ))}
          </div>

          <button
              className="p-2 rounded-lg border hover:bg-gray-50 disabled:opacity-30 disabled:hover:bg-white transition-colors"
              disabled={currentPage + 1 >= totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
          >
            <ChevronRightIcon className="h-5 w-5" />
          </button>
        </motion.div>
      </div>
  );
}