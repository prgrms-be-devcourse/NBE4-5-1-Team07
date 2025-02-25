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

export default function QuestionManagement() {
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

  const handleDelete = async (questionId: number) => {
    const confirmDelete = window.confirm("정말로 이 질문을 삭제하시겠습니까?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(
        `http://localhost:8080/api/v1/questions/${questionId}/admin`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // 인증 정보 포함
        }
      );

      const result = await res.json();
      if (res.ok && result.code === "200-1") {
        alert("질문이 삭제되었습니다.");
        // 삭제된 질문을 화면에서 제거
        setQuestions((prev) =>
          prev.filter((question) => question.id !== questionId)
        );
      } else {
        throw new Error(result.message || "질문 삭제에 실패했습니다.");
      }
    } catch (error) {
      alert("질문 삭제 중 오류가 발생했습니다.");
    }
  };

  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-5">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold mb-4">질문 목록</h1>
      </div>
      {questions.length === 0 ? (
        <p>질문이 없습니다.</p>
      ) : (
        <ul className="space-y-4">
          {questions.map((question) => (
            <li key={question.id} className="p-4 border rounded-lg shadow">
              <div className="flex justify-between">
                <div>
                  <h2 className="text-lg font-semibold">{question.subject}</h2>
                  <p className="text-gray-600">상품번호: {question.itemId}</p>
                  <p className="text-gray-600">작성자: {question.name}</p>
                  <p className="text-sm text-gray-500">
                    작성일: {new Date(question.createDate).toLocaleString()}
                  </p>
                  <p className="mt-2">{question.content}</p>
                </div>
                <div className="pr-2">
                  <Button
                    onClick={() => handleDelete(question.id)}
                    className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600"
                  >
                    삭제
                  </Button>
                </div>
              </div>

              {question.answer ? (
                <div className="mt-4 p-3 border-l-4 border-blue-500 bg-blue-50 flex flex-row justify-between">
                  <div className="pr-4">
                    <p className="font-semibold">답변:</p>
                    <p>{question.answer.content}</p>
                    <p className="text-xs text-gray-500">
                      작성일:{" "}
                      {new Date(question.answer.createDate).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex justify-end">
                    <Link
                      href={`/admin/questionManagement/${question.id}/edit`}
                    >
                      <Button className="border-2 border-yellow-500 w-[100px] bg-white text-black hover:bg-gray-200 ">
                        답변 수정
                      </Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="mt-4 text-gray-500 flex flex-row justify-between">
                  <div className="flex justify-center items-center">
                    아직 답변이 없습니다.
                  </div>
                  <div className="flex justify-end pr-2">
                    <Link
                      href={`/admin/questionManagement/${question.id}/answer`}
                    >
                      <Button className="border-2 border-blue-500 w-[100px] bg-white text-black hover:bg-gray-200 ">
                        답변 달기
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
