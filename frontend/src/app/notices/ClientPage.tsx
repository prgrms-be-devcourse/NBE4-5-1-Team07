"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

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

  useEffect(() => {
    fetch("http://localhost:8080/api/v1/notices")
      .then((res) => res.json())
      .then((data) => {
        if (data.data) {
          setNotices(data.data);
        } else {
          setError("데이터를 불러오지 못했습니다.");
        }
      })
      .catch(() => setError("공지사항을 불러오는 중 오류가 발생했습니다."))
      .finally(() => setLoading(false));
  }, []);

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
    </div>
  );
}
