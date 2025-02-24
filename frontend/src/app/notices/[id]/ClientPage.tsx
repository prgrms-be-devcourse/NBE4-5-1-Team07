"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface NoticeDto {
  id: number;
  title: string;
  content: string;
  createDate: string;
  modifyDate: string;
}

export default function NoticeDetail({ id }: { id: number }) {
  const router = useRouter();
  const [notice, setNotice] = useState<NoticeDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`http://localhost:8080/api/v1/notices/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("공지사항 정보를 불러오는 데 실패했습니다.");
        }
        return response.json();
      })
      .then((data) => {
        setNotice(data.data);
      })
      .catch(() => setError("공지사항을 불러오는 중 오류가 발생했습니다."))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = () => {
    const confirmDelete = window.confirm(
      "정말로 이 공지사항을 삭제하시겠습니까?"
    );
    if (confirmDelete) {
      const authToken = "admin"; // 임시 인증 토큰

      fetch(`http://localhost:8080/api/v1/notices/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ authToken }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("공지사항 삭제에 실패했습니다.");
          }
          alert("공지사항이 삭제되었습니다.");
          router.push("/notices"); // 삭제 후 목록 페이지로 리디렉션
        })
        .catch((error) => {
          alert(error.message);
        });
    }
  };

  if (loading) return <p>로딩 중...</p>;
  if (error) return <p>{error}</p>;
  if (!notice) return <p>공지사항이 존재하지 않습니다.</p>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <button
        onClick={() => router.push("/notices")}
        className="mb-4 text-blue-600"
      >
        ← 목록으로
      </button>
      <h1 className="text-2xl font-bold">{notice.title}</h1>
      <p className="text-gray-500 text-sm">
        {new Date(notice.createDate).toLocaleString()}
      </p>
      <div
        className="mt-4 whitespace-pre-wrap"
        dangerouslySetInnerHTML={{ __html: notice.content }}
      />
      <button
        onClick={handleDelete}
        className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
      >
        삭제
      </button>
    </div>
  );
}
