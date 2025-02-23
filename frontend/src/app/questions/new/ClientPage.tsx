"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function NewQuestionPage() {
  const router = useRouter();
  const [itemId, setItemId] = useState("");
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [authToken, setAuthToken] = useState(""); // 사용자 인증 토큰

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = { itemId: Number(itemId), subject, content, authToken };

    const response = await fetch("http://localhost:8080/api/v1/questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      alert("질문이 작성되었습니다.");
      router.push("/questions"); // 질문 목록으로 이동
    } else {
      const errorData = await response.json();
      alert(`오류: ${errorData.message}`);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-5">
      <h1 className="text-2xl font-bold mb-4">새 질문 작성</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold">상품 ID:</label>
          <input
            type="number"
            value={itemId}
            onChange={(e) => setItemId(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block font-semibold">제목:</label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block font-semibold">내용:</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block font-semibold">인증 토큰:</label>
          <input
            type="text"
            value={authToken}
            onChange={(e) => setAuthToken(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <Button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded"
        >
          질문 작성
        </Button>
      </form>
    </div>
  );
}
