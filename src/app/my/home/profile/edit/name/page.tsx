"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ChangeNamePage() {
  const [newName, setNewName] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:8080/api/v1/users/modify/name",
        {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            email: "example@exam.com",
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
    <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold text-center mb-6">이름 변경</h1>
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
          disabled={loading}
        >
          {loading ? "변경 중..." : "이름 변경"}
        </button>
      </form>
    </div>
  );
}
