"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { loginSuccess } from "@/redux/auth.slice";

const API_BASE_URL = "http://localhost:8080";

export default function LoginPage() {
  // 기존 상태 및 로직 유지
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const dispatch = useDispatch();

  const handleLogin = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        dispatch(
            loginSuccess({
              username: data.username,
              isAdmin: data.role === "ADMIN", // 백엔드 응답 구조에 맞게 수정
            })
        );

        // 장바구니 선택 데이터 삭제
        localStorage.removeItem("selectedCartItems");

        alert(`${data.msg}`); // ✅ 로그인 성공 메시지 출력
        window.location.href = "/";
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다."
      );
      console.error("🔴 로그인 요청 중 예외 발생:", err);
    }
  };

  return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transition-all">
          {/* 헤더 */}
          <div className="px-8 pt-8 text-center">
            <h1 className="text-2xl font-semibold text-gray-800 mb-1">Bean Voyage</h1>
            <p className="text-gray-500 text-sm">계속하려면 로그인하세요</p>
          </div>

          {/* 본문 */}
          <div className="px-8 py-6">
            {error && (
                <div className="mb-4 p-3 bg-red-50 rounded-lg border border-red-200">
                  <p className="text-red-600 text-sm text-center">{error}</p>
                </div>
            )}

            {/* 입력 필드 */}
            <div className="space-y-4">
              <Input
                  type="email"
                  placeholder="이메일"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <Input
                  type="password"
                  placeholder="비밀번호"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* 액션 버튼 */}
            <div className="mt-6 space-y-3">
              <Button
                  onClick={handleLogin}
                  className="w-full py-3 bg-[#0071E3] hover:bg-[#0077ED] text-white rounded-xl font-medium transition-colors"
              >
                로그인
              </Button>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-white px-2 text-gray-400 text-sm">또는</span>
                </div>
              </div>

              <button
                  onClick={() => router.push("/guest")}
                  className="w-full py-3 bg-transparent hover:bg-gray-50 text-gray-600 rounded-xl border border-gray-200 font-medium transition-colors"
              >
                비회원 주문 조회
              </button>
            </div>
          </div>

          {/* 푸터 */}
          <div className="px-8 py-4 bg-gray-50 border-t border-gray-100">
            <p className="text-center text-sm text-gray-500">
              계정이 없으신가요?{" "}
              <Link
                  href="/user/signup"
                  className="text-[#0071E3] font-medium hover:underline"
              >
                회원가입
              </Link>
            </p>
          </div>
        </div>
      </div>
  );
}