"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation"; // useRouter 추가
import { error } from "console";

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
  const router = useRouter(); // useRouter로 리다이렉트 처리
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

  const handleDelete = () => {
    if (window.confirm("정말로 이 질문을 삭제하시겠습니까?")) {
      fetch(`http://localhost:8080/api/v1/questions/${id}`, {
        method: "DELETE", // DELETE 메서드로 요청
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // 인증 정보 포함
      })
        .then((res) => {
          if (res.ok) {
            alert("질문이 삭제되었습니다.");
            router.back(); // 이전 페이지로 돌아가기
          } else if (res.status === 401) {
            alert("로그인이 필요합니다.");
            router.push("/user/login"); // 로그인 페이지로 이동
          } else if (res.status === 403) {
            alert("질문을 삭제할 권한이 없습니다.");
          } else {
            alert("질문을 삭제하는 데 실패했습니다.");
          }
        })
        .catch((error) => {
          console.error("Error deleting question:", error);
          alert("삭제 중 오류가 발생했습니다.");
        });
    }
  };

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

      {/* 삭제 버튼 추가 */}
      <button
        onClick={handleDelete}
        className="mt-6 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        질문 삭제
      </button>
    </div>
  );
}
