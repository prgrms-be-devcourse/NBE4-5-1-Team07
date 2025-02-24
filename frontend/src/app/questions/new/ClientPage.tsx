"use client";

import { useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";

export default function QuestionForm() {
  const searchParams = useSearchParams();
  const itemId = searchParams.get("itemId");
  const router = useRouter();

  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!subject.trim() || !content.trim()) {
      setError("제목과 내용을 입력하세요.");
      return;
    }

    const requestBody = {
      itemId: Number(itemId), // 상품 ID
      subject,
      content,
    };

    try {
      const res = await fetch("http://localhost:8080/api/v1/questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // 인증 정보 포함
        body: JSON.stringify(requestBody),
      });

      const result = await res.json();
      if (res.ok && result.code === "200-1") {
        alert("질문이 성공적으로 등록되었습니다.");
        router.back(); // 이전 페이지로 이동
      } else {
        throw new Error(result.message || "질문 등록에 실패했습니다.");
      }
    } catch (error) {
      setError("질문 등록 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-xl font-bold mb-4">질문 작성</h1>
      {error && <p className="text-red-500">{error}</p>}

      <div className="mb-4 p-2 bg-gray-100 rounded">
        <p className="text-gray-700">
          <span className="font-semibold">상품 번호:</span> {itemId}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="질문 제목"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <textarea
          placeholder="질문 내용을 입력하세요."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full p-2 border rounded h-32"
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          질문 등록
        </button>
      </form>
    </div>
  );
}
