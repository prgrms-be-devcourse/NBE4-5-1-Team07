"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ChangePasswordPage() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const passwordsMatch = newPassword === confirmPassword && newPassword !== "";

  // ✅ 비밀번호 변경 후 로그아웃 함수
  const handleLogout = async () => {
    try {
      const response = await fetch(
        "http://localhost:8080/api/v1/users/logout",
        {
          method: "POST",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("로그아웃 실패");
      }

      // ✅ 클라이언트에서 쿠키 삭제
      document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

      // ✅ 장바구니 데이터 삭제
      localStorage.removeItem("selectedCartItems");

      alert("비밀번호가 변경되었습니다. 다시 로그인해주세요.");
      router.push("/user/login"); // ✅ 로그인 페이지로 이동
    } catch (error) {
      console.error("🔴 로그아웃 중 오류 발생:", error);
      alert("로그아웃 실패");
    }
  };

  // ✅ 비밀번호 변경 후 로그아웃 실행
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordsMatch) {
      alert("새 비밀번호가 일치하지 않습니다.");
      return;
    }
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:8080/api/v1/users/modify/password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: "example@exam.com",
            oldPassword,
            newPassword,
          }),
        }
      );

      const result = await response.json();
      if (response.ok) {
        await handleLogout(); // ✅ 비밀번호 변경 성공 시 로그아웃 후 로그인 페이지로 이동
      } else {
        alert("비밀번호 변경 실패: " + result.msg);
      }
    } catch (error) {
      console.error("비밀번호 변경 오류:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold text-center mb-6">비밀번호 변경</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          className="w-full px-4 py-2 border rounded-md"
          placeholder="현재 비밀번호"
          required
        />
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full px-4 py-2 border rounded-md"
          placeholder="새 비밀번호"
          required
        />
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className={`w-full px-4 py-2 border rounded-md ${
            confirmPassword && !passwordsMatch ? "border-red-500" : ""
          }`}
          placeholder="새 비밀번호 확인"
          required
        />
        {confirmPassword && !passwordsMatch && (
          <p className="text-red-500 text-sm">비밀번호가 일치하지 않습니다.</p>
        )}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-md"
          disabled={!passwordsMatch || loading}
        >
          {loading ? "변경 중..." : "비밀번호 변경"}
        </button>
      </form>
    </div>
  );
}
