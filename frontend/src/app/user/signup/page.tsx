"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const API_BASE_URL = "http://localhost:8080"; // 백엔드 서버 주소

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [emailCode, setEmailCode] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);
  const [showVerificationInput, setShowVerificationInput] = useState(false);
  const [verificationRequested, setVerificationRequested] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [street, setStreet] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [error, setError] = useState<string>("");
  const [timer, setTimer] = useState<number>(900); // 15분 (900초)
  const router = useRouter();

  useEffect(() => {
    let countdown: NodeJS.Timeout;
    if (verificationRequested && timer > 0) {
      countdown = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setVerificationRequested(false); // 시간이 지나면 버튼 활성화
      setShowVerificationInput(false);
    }
    return () => clearInterval(countdown);
  }, [verificationRequested, timer]);

  const fetchRequest = async (
    url: string,
    method: "GET" | "POST" | "PUT" | "DELETE",
    body: any = null
  ) => {
    setError("");
    try {
      console.log(`🔵 요청 보냄: ${method} ${url}`, body);
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: body ? JSON.stringify(body) : null,
        credentials: "include",
      });

      if (!response.ok) {
        const errorMsg = await response.text();
        console.error(`🔴 오류 발생 (${response.status}):`, errorMsg);
        throw new Error(errorMsg);
      }
      return await response.json();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다."
      );
      console.error("🔴 요청 중 예외 발생:", err);
    }
  };

  // 이메일 인증 요청
  const handleRequestEmailVerification = async () => {
    if (!email) {
      setError("이메일을 입력해주세요.");
      return;
    }
    console.log("📩 이메일 인증 요청 보냄:", email);

    const result = await fetchRequest(
      `${API_BASE_URL}/api/v1/users/request-verification?email=${email}`,
      "POST"
    );

    if (result) {
      alert("인증번호가 이메일로 전송되었습니다.");
      setShowVerificationInput(true);
      setVerificationRequested(true);
      setTimer(900); // 15분 제한 시작
    }
  };

  // 인증번호 확인
  const handleVerifyEmail = async () => {
    console.log("✅ 인증 확인 요청:", email, emailCode);
    const result = await fetchRequest(
      `${API_BASE_URL}/api/v1/users/verify-email`,
      "POST",
      { email, code: emailCode }
    );

    if (!result || result.code !== "200-2") {
      setError("이메일 인증에 실패했습니다. 올바른 코드를 입력하세요.");
      return;
    }

    setEmailVerified(true);
    alert("이메일 인증이 완료되었습니다.");
    setShowVerificationInput(false);
    // 타이머 및 인증 요청 제한 해제
    setTimer(0);
    setVerificationRequested(false);
  };

  // 회원가입 요청
  const handleSignup = async () => {
    if (
      !name ||
      !email ||
      !password ||
      !confirmPassword ||
      !city ||
      !street ||
      !zipcode
    ) {
      setError("모든 필드를 입력해주세요.");
      return;
    }
    if (!emailVerified) {
      setError("이메일 인증을 완료해주세요.");
      return;
    }
    if (password !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }
    if (password.length < 8) {
      setError("비밀번호는 최소 8자 이상이어야 합니다.");
      return;
    }

    console.log("🚀 회원가입 요청 전송:", {
      email,
      password,
      name,
      city,
      street,
      zipcode,
    });

    const result = await fetchRequest(
      `${API_BASE_URL}/api/v1/users/signup`,
      "POST",
      { email, password, name, city, street, zipcode }
    );

    if (result) {
      alert("회원가입이 완료되었습니다.");
      router.push("/user/login");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <CardHeader>
          <CardTitle className="text-center text-xl font-bold">
            회원가입
          </CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <p className="text-red-500 text-sm text-center mb-4">{error}</p>
          )}
          <div className="space-y-4">
            <Input
              type="text"
              placeholder="이름"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="이메일"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button
                onClick={handleRequestEmailVerification}
                className="bg-blue-600 text-white"
                disabled={verificationRequested} // 버튼 비활성화 (15분 제한)
              >
                {verificationRequested
                  ? `제한시간: ${Math.floor(timer / 60)}:${(timer % 60)
                      .toString()
                      .padStart(2, "0")}`
                  : "인증 요청"}
              </Button>
            </div>

            {/* 인증 요청 후 인증번호 입력창 표시 */}
            {showVerificationInput && (
              <div className="flex gap-2 mt-2">
                <Input
                  type="text"
                  placeholder="인증번호 입력"
                  value={emailCode}
                  onChange={(e) => setEmailCode(e.target.value)}
                />
                <Button
                  onClick={handleVerifyEmail}
                  className="bg-green-600 text-white"
                >
                  인증 확인
                </Button>
              </div>
            )}

            {emailVerified && (
              <p className="text-green-600 text-sm">인증이 완료되었습니다.</p>
            )}

            <Input
              type="password"
              placeholder="비밀번호 (8자 이상)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Input
              type="password"
              placeholder="비밀번호 확인"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <Input
              type="text"
              placeholder="도시"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
            <Input
              type="text"
              placeholder="거리"
              value={street}
              onChange={(e) => setStreet(e.target.value)}
            />
            <Input
              type="text"
              placeholder="우편번호"
              value={zipcode}
              onChange={(e) => setZipcode(e.target.value)}
            />

            <Button
              onClick={handleSignup}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold"
              disabled={!emailVerified}
            >
              회원가입
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
