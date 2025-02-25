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

      // 장바구니 선택 데이터 삭제
      localStorage.removeItem("selectedCartItems");

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
      <Card className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <CardHeader>
          <CardTitle className="text-center text-xl font-bold">
            로그인
          </CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <p className="text-red-500 text-sm text-center mb-4">{error}</p>
          )}
          <div className="space-y-4">
            <Input
              type="email"
              placeholder="이메일"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full"
            />
            <Input
              type="password"
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full"
            />
            <Button
              onClick={handleLogin}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold"
            >
              로그인
            </Button>
          </div>
          <p className="text-sm text-center mt-4">
            계정이 없으신가요?{" "}
            <Link href="/user/signup" className="text-blue-500">
              회원가입
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
