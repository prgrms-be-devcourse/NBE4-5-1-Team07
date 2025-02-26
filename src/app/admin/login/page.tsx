"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <CardHeader>
          <CardTitle className="text-center text-xl font-bold">
            관리자 로그인
          </CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <p className="text-red-500 text-sm text-center mb-4">{error}</p>
          )}
          <div className="space-y-4">
            <Input
              type="text"
              placeholder="관리자 아이디"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold"
            >
              로그인
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
