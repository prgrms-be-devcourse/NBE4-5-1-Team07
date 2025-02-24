"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";

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

export default function QuestionsPage() {
  const [questions, setQuestions] = useState<QuestionDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8080/api/v1/questions") // 백엔드 API 주소
      .then((res) => res.json())
      .then((data) => {
        setQuestions(data.data); // RsData<List<QuestionDto>> 형태로 반환된다고 가정
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching questions:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-5">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold mb-4">질문 목록</h1>
        <Link href="/questions/new">
          <Button className="border-2 border-blue-500 w-[100px] bg-white text-black hover:bg-gray-400 ">
            질문 작성
          </Button>
        </Link>
      </div>
      {questions.length === 0 ? (
        <p>질문이 없습니다.</p>
      ) : (
        <ul className="space-y-4">
          {questions.map((question) => (
            <li key={question.id} className="p-4 border rounded-lg shadow">
              <Link href={`/questions/${question.id}`} className="block">
                <h2 className="text-lg font-semibold">{question.subject}</h2>
                <p className="text-gray-600">상품번호: {question.itemId}</p>
                <p className="text-gray-600">작성자: {question.name}</p>
                <p className="text-sm text-gray-500">
                  작성일: {new Date(question.createDate).toLocaleString()}
                </p>
                <p className="mt-2">{question.content}</p>
              </Link>
              {/* {question.answer && (
                <div className="mt-4 p-3 border-l-4 border-blue-500 bg-blue-50">
                  <p className="font-semibold">답변:</p>
                  <p>{question.answer.content}</p>
                  <p className="text-xs text-gray-500">
                    작성일:{" "}
                    {new Date(question.answer.createDate).toLocaleString()}
                  </p>
                </div>
              )} */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
