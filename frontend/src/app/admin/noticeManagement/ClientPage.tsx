"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface NoticeDto {
  id: number;
  title: string;
  content: string;
  createDate: string;
  modifyDate: string;
}

export default function NoticesManagement() {
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

  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm(
      "정말로 이 공지사항을 삭제하시겠습니까?"
    );
    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `http://localhost:8080/api/v1/notices/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("공지사항 삭제에 실패했습니다.");
      }

      setNotices((prev) => prev.filter((notice) => notice.id !== id));
      alert("공지사항이 삭제되었습니다.");
    } catch (error) {
      alert("공지사항 삭제 중 오류가 발생했습니다.");
    }
  };

  if (loading) return <p>로딩 중...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="max-w-5xl mx-auto p-4">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold mb-4">공지사항</h1>
        <Link href="/admin/noticeManagement/new">
          <Button className="bg-blue-500 text-white px-4 py-2 rounded">
            공지사항 작성
          </Button>
        </Link>
      </div>
      <ul className="space-y-4">
        {notices.map((notice) => (
          <li
            key={notice.id}
            className="p-4 border rounded-lg shadow hover:bg-gray-100 transition"
          >
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">{notice.title}</h2>
              <div className="space-x-2">
                <Link href={`/admin/noticeManagement/edit/${notice.id}`}>
                  <Button className="mt-4 bg-yellow-500 text-white px-4 py-2 rounded">
                    수정
                  </Button>
                </Link>
                <Button
                  onClick={() => handleDelete(notice.id)}
                  className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
                >
                  삭제
                </Button>
              </div>
            </div>
            <p className="text-gray-600 text-sm">
              {new Date(notice.createDate).toLocaleString()}
            </p>
            <div
              className="mt-4 text-gray-700"
              dangerouslySetInnerHTML={{ __html: notice.content }}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
