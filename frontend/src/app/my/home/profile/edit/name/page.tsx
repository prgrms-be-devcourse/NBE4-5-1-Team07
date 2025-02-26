"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PencilIcon } from "@heroicons/react/24/outline"; // 연필 아이콘 추가

export default function ChangeNamePage() {
  const [newName, setNewName] = useState("");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetch("http://localhost:8080/api/my/info", {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((result) => {
        if (result?.data?.email) {
          setEmail(result.data.email);
        } else {
          console.error("이메일을 가져올 수 없습니다.");
        }
      })
      .catch((err) => {
        console.error("이메일 조회 실패:", err);
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      alert("로그인 정보를 불러오지 못했습니다.");
      return;
    }
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:8080/api/v1/users/modify/name",
        {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            email,
            newName,
          }).toString(),
        }
      );

      const result = await response.json();
      if (response.ok) {
        alert(result.msg);
        router.push("/my/home/profile/edit");
      } else {
        alert("이름 변경 실패: " + result.msg);
      }
    } catch (error) {
      console.error("이름 변경 오류:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
      {/* 아이콘과 제목을 함께 배치 */}
      <h1 className="text-2xl font-bold text-center mb-6 flex justify-center items-center gap-2">
        <PencilIcon className="w-6 h-6 text-gray-600" /> 이름 변경
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          className="w-full px-4 py-2 border rounded-md"
          placeholder="새 이름 입력"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-md"
          disabled={loading || !email}
        >
          {loading ? "변경 중..." : "이름 변경"}
        </button>
      </form>
    </div>
  );
}
