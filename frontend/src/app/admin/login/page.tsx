"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiLock, FiUser, FiAlertCircle, FiShield } from "react-icons/fi";

const API_BASE_URL = "http://localhost:8080"; // ✅ 백엔드 주소

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async () => {
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/users/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
        credentials: "include", // ✅ 쿠키 저장 (세션 유지)
      });

      if (!response.ok) {
        const errorMsg = await response.text();
        console.error(`🔴 로그인 실패 (${response.status}):`, errorMsg);
        throw new Error(errorMsg);
      }

      alert("관리자 로그인 성공! 🎉");
      router.push("/admin"); // ✅ 로그인 후 관리자 페이지로 이동
    } catch (err) {
      setError(err instanceof Error ? err.message : "알 수 없는 오류 발생");
      console.error("🔴 요청 중 오류 발생:", err);
    }
  };

  return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 hover:shadow-3xl">

          {/* 헤더 섹션 */}
          <div className="bg-blue-600 p-6 flex items-center space-x-3">
            <FiShield className="text-white text-3xl animate-pulse" />
            <h1 className="text-2xl font-bold text-white">
              🔒 관리자 전용 시스템
            </h1>
          </div>

          <div className="p-8 space-y-6">
            {error && (
                <div className="p-3 bg-red-100 text-red-700 rounded-lg flex items-center animate-shake">
                  <FiAlertCircle className="mr-2" />
                  {error}
                </div>
            )}

            {/* 아이디 입력 필드 */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 flex items-center">
                <FiUser className="mr-2 text-blue-600" />
                관리자 아이디
              </label>
              <div className="relative">
                <input
                    type="text"
                    placeholder="admin@example.com"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-4 py-3 pl-10 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 transition-all"
                />
                <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            {/* 비밀번호 입력 필드 */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 flex items-center">
                <FiLock className="mr-2 text-blue-600" />
                비밀번호
              </label>
              <div className="relative">
                <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 pl-10 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 transition-all"
                />
                <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            {/* 로그인 버튼 */}
            <button
                onClick={handleLogin}
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-all
            transform hover:scale-[1.02] active:scale-95 flex items-center justify-center space-x-2"
            >
              <FiShield className="animate-bounce" />
              <span>관리자 로그인</span>
            </button>

            {/* 보안 알림 */}
            <div className="text-sm text-center text-gray-500 flex items-center justify-center space-x-1">
              <FiAlertCircle className="text-yellow-500" />
              <span>이 시스템은 권한이 있는 관리자만 접근할 수 있습니다</span>
            </div>
          </div>
        </div>
      </div>
  );
}