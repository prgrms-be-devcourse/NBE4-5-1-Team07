"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface NoticeDto {
  id: number;
  title: string;
  content: string;
}

export default function NoticeEdit({ id }: { id: number }) {
  const router = useRouter();
  const [notice, setNotice] = useState<NoticeDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

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
        setTitle(data.data.title);
        setContent(data.data.content);
      })
      .catch(() => setError("공지사항을 불러오는 중 오류가 발생했습니다."))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSave = () => {
    fetch(`http://localhost:8080/api/v1/notices/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        content,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("공지사항 수정에 실패했습니다.");
        }
        alert("공지사항이 수정되었습니다.");
        router.push(`/admin/noticeManagement`); // 수정 후 상세 페이지로 리디렉션
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  if (loading) return <p>로딩 중...</p>;
  if (error) return <p>{error}</p>;
  if (!notice) return <p>공지사항이 존재하지 않습니다.</p>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <button
        onClick={() => router.push("/admin/noticeManagement")}
        className="mb-4 text-blue-600"
      >
        ← 목록으로
      </button>
      <h1 className="text-2xl font-bold">공지사항 수정</h1>
      <div className="mt-4">
        <label className="block text-sm font-medium">제목</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 p-2 border border-gray-300 rounded w-full"
        />
      </div>
      <div className="mt-4">
        <label className="block text-sm font-medium">내용</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="mt-1 p-2 border border-gray-300 rounded w-full"
          rows={6}
        />
      </div>
      <div className="mt-4">
        <button
          onClick={handleSave}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          수정 저장
        </button>
      </div>
    </div>
  );
}
