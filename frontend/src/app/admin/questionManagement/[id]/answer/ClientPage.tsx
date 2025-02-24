"use client";

import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface WriteAnswerReqBody {
  content: string;
}

interface QuestionDto {
  id: number;
  itemId: number;
  name: string;
  subject: string;
  content: string;
  createDate: string;
  modifyDate: string;
}

export default function AnswerForm({ id }: { id: number }) {
  const [content, setContent] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [question, setQuestion] = useState<QuestionDto | null>(null);
  const router = useRouter();

  // 질문 데이터를 가져오는 useEffect
  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/v1/questions/${id}`);
        const data = await res.json();

        if (res.ok && data.data) {
          setQuestion(data.data); // 질문 데이터를 상태에 저장
        } else {
          throw new Error("질문을 가져오는 데 실패했습니다.");
        }
      } catch (error) {
        setError("질문을 가져오는 데 오류가 발생했습니다.");
      }
    };

    fetchQuestion();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      setError("답변을 입력하세요.");
      return;
    }

    const requestBody: WriteAnswerReqBody = { content };

    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:8080/api/v1/questions/${id}/answers`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
          credentials: "include", // 인증 정보 포함
        }
      );

      const result = await res.json();

      if (res.ok && result.code === "200-1") {
        alert("답변이 작성되었습니다.");
        router.push(`/admin/questionManagement`); // 질문 목록으로 이동
      } else {
        throw new Error(result.message || "답변 작성에 실패했습니다.");
      }
    } catch (error) {
      setError("답변 작성 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-5">
      <h1 className="text-2xl font-bold mb-4">답변 작성</h1>

      {error && <p className="text-red-500">{error}</p>}

      {question && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">질문 내용</h2>
          <div className="p-4 border rounded-lg shadow-sm">
            <h3 className="font-semibold">{question.subject}</h3>
            <p className="text-gray-600">상품번호: {question.itemId}</p>
            <p className="mt-2">{question.content}</p>
            <p className="mt-2">질문번호: {id}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          placeholder="답변을 입력하세요."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full p-2 border rounded h-32"
        />
        <Button
          type="submit"
          className="bg-blue-500 text-white w-full py-2 rounded hover:bg-blue-600"
          disabled={loading}
        >
          {loading ? "작성 중..." : "답변 작성"}
        </Button>
      </form>
    </div>
  );
}
