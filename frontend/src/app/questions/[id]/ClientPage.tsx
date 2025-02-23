"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface AnswerDto {
  content: string;
  createDate: string;
  modifyDate: string;
}

interface QuestionDto {
  id: number;
  itemId: number;
  name: string;
  subject: string;
  content: string;
  createDate: string;
  modifyDate: string;
  answer: AnswerDto | null;
}

export default function QuestionDetailPage() {
  const { id } = useParams(); // URL에서 id 가져오기
  const [question, setQuestion] = useState<QuestionDto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    fetch(`http://localhost:8080/api/v1/questions/${id}`) // 백엔드 API 호출
      .then((res) => res.json())
      .then((data) => {
        setQuestion(data.data); // RsData<QuestionDto> 형식으로 반환됨
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching question:", error);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  if (!question) {
    return (
      <div className="text-center mt-10 text-red-500">
        질문을 찾을 수 없습니다.
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-5">
      <h1 className="text-2xl font-bold">{question.subject}</h1>
      <p className="text-gray-600">작성자: {question.name}</p>
      <p className="text-sm text-gray-500">
        작성일: {new Date(question.createDate).toLocaleString()}
      </p>
      <div className="mt-4 p-4 border rounded-lg shadow">
        <p>{question.content}</p>
      </div>

      {question.answer ? (
        <div className="mt-6 p-4 border-l-4 border-green-500 bg-green-50">
          <p className="font-semibold">답변:</p>
          <p>{question.answer.content}</p>
          <p className="text-xs text-gray-500">
            작성일: {new Date(question.answer.createDate).toLocaleString()}
          </p>
        </div>
      ) : (
        <p className="mt-4 text-gray-500">아직 답변이 없습니다.</p>
      )}
    </div>
  );
}
