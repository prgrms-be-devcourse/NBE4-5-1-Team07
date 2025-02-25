"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FiMail, FiCheckCircle } from "react-icons/fi";

export default function GuestPage() {
    const router = useRouter();
    const [step, setStep] = useState<1 | 2>(1);
    const [email, setEmail] = useState("");
    const [code, setCode] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // 이메일 전송 핸들러
    const handleSendEmail = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch("http://localhost:8080/api/v1/non-user/verify", {
                method: "POST",
                credentials: "include", // 쿠키 포함
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(email),
            });

            if (!response.ok) throw new Error("이메일 전송 실패");

            // ✅ 세션 스토리지에 이메일 저장
            if (typeof window !== "undefined") {
                console.log("Saving to sessionStorage:", email);
                sessionStorage.setItem("nonMemberEmail", email);
            }

            // 인증 단계로 이동
            setStep(2);
        } catch (err) {
            setError(err instanceof Error ? err.message : "알 수 없는 에러 발생");
        } finally {
            setLoading(false);
        }
    };

    // 인증 코드 확인 핸들러
    const handleVerifyCode = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            // ✅ 세션 스토리지에서 이메일 가져오기
            const storedEmail = sessionStorage.getItem("nonMemberEmail");
            if (!storedEmail) throw new Error("이메일 정보가 없습니다.");

            const response = await fetch("http://localhost:8080/api/v1/non-user/verify/true", {
                method: "POST",
                credentials: "include", // 쿠키 포함
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email: storedEmail, code }), // 이메일과 인증 코드 전송
            });

            if (!response.ok) throw new Error("인증에 실패하였습니다.");

            router.push("/guest/orders");
        } catch (err) {
            setError(err instanceof Error ? err.message : "알 수 없는 에러 발생");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-8 space-y-6">
                {/* 헤더 */}
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center justify-center gap-2">
                        <FiMail className="text-blue-500" />
                        비회원 주문 조회
                    </h1>
                    <p className="text-sm text-gray-500 mt-2">
                        이메일 인증 후 주문 내역을 확인할 수 있습니다.
                    </p>
                </div>

                {/* Step 1: 이메일 입력 */}
                {step === 1 && (
                    <form onSubmit={handleSendEmail} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                이메일 주소
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-3 px-4 rounded-md ${
                                loading ? "bg-blue-300" : "bg-blue-600 hover:bg-blue-700"
                            } text-white font-semibold transition-all`}
                        >
                            {loading ? "전송 중..." : "인증번호 받기"}
                        </button>
                    </form>
                )}

                {/* Step 2: 인증 코드 입력 */}
                {step === 2 && (
                    <form onSubmit={handleVerifyCode} className="space-y-6">
                        <div>
                            <label htmlFor="code" className="block text-sm font-medium text-gray-700">
                                인증 코드
                            </label>
                            <input
                                id="code"
                                name="code"
                                type="text"
                                required
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-3 px-4 rounded-md ${
                                loading ? "bg-green-300" : "bg-green-600 hover:bg-green-700"
                            } text-white font-semibold transition-all`}
                        >
                            {loading ? "인증 중..." : "인증 확인"}
                        </button>
                    </form>
                )}

                {/* 에러 메시지 */}
                {error && (
                    <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                        {error}
                    </div>
                )}

                {/* 애니메이션 효과 */}
                {step === 2 && (
                    <div className="flex items-center justify-center mt-6 animate-bounce">
                        <FiCheckCircle className="text-green-500 w-6 h-6" />
                        <span className="ml-2 text-green-600 font-semibold">인증 코드를 입력하세요!</span>
                    </div>
                )}
            </div>
        </div>
    );
}