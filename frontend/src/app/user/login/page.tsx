"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

const API_BASE_URL = "http://localhost:8080"; // 백엔드 API 주소

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async () => {
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include", // ✅ 로그인 후 쿠키 자동 저장 (JWT 포함)
      });

      if (!response.ok) {
        const errorMsg = await response.text();
        console.error(`🔴 오류 발생 (${response.status}):`, errorMsg);
        throw new Error(errorMsg);
      }

      const data = await response.json();
      alert(`${data.msg}`); // ✅ 로그인 성공 메시지 출력
      router.push("/"); // ✅ 홈으로 이동
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다."
      );
      console.error("🔴 로그인 요청 중 예외 발생:", err);
    }
  };

  return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <Card className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
          {/* 헤더 */}
          <CardHeader>
            <CardTitle className="text-center text-2xl font-bold text-gray-800">
              로그인
            </CardTitle>
            <p className="text-center text-sm text-gray-500 mt-2">
              계정 정보를 입력하고 로그인하세요.
            </p>
          </CardHeader>

          {/* 컨텐츠 */}
          <CardContent>
            {error && (
                <p className="text-red-500 text-sm text-center mb-4">{error}</p>
            )}
            <div className="space-y-6">
              {/* 이메일 입력 */}
              <Input
                  type="email"
                  placeholder="이메일"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
              {/* 비밀번호 입력 */}
              <Input
                  type="password"
                  placeholder="비밀번호"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
              {/* 로그인 버튼 */}
              <Button
                  onClick={handleLogin}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition-all"
              >
                로그인
              </Button>
            </div>

            {/* 회원가입 링크 */}
            <p className="text-sm text-center mt-6 text-gray-600">
              계정이 없으신가요?{" "}
              <Link href="/user/signup" className="text-blue-500 font-medium hover:underline">
                회원가입
              </Link>
            </p>

            {/* 구분선 */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-2 text-gray-500">또는</span>
              </div>
            </div>

            {/* 비회원 주문 조회 섹션 */}
            <div className="text-center space-y-4">
              <p className="text-gray-700 font-medium text-base">
                비회원으로 주문하셨나요?
              </p>
              <button
                  onClick={() => router.push('/guest')}
                  className="bg-gray-800 text-white px-6 py-3 rounded-md hover:bg-gray-700 transition-all focus:outline-none focus:ring focus:ring-gray-400"
              >
                비회원 주문 조회
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
  );
}
