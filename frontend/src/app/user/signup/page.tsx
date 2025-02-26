"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FiCheck, FiMail, FiLock, FiUser, FiMapPin, FiClock, FiAlertCircle } from "react-icons/fi";

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
    const [currentStep, setCurrentStep] = useState(1);
    const steps = ['기본 정보', '이메일 인증', '추가 정보', '완료'];

    const progressWidth = `${((currentStep - 1) / (steps.length - 1)) * 100}%`;

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
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-4 sm:p-8">
            <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-300">
                {/* 단계별 프로그레스 바 */}
                <div className="px-8 pt-8">
                    <div className="relative pt-4">
                        <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 transform -translate-y-1/2" />
                        <div
                            className="absolute top-1/2 left-0 h-1 bg-blue-600 transition-all duration-500 ease-out"
                            style={{ width: progressWidth }}
                        />
                        <div className="flex justify-between relative">
                            {steps.map((step, index) => (
                                <div
                                    key={index}
                                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                        currentStep > index + 1 ? 'bg-blue-600' : 'bg-white border-2 border-blue-600'
                                    }`}
                                >
                                    {currentStep > index + 1 ? (
                                        <FiCheck className="text-white text-sm" />
                                    ) : (
                                        <span className={`text-sm ${currentStep === index + 1 ? 'text-blue-600' : 'text-gray-400'}`}>
                      {index + 1}
                    </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="p-8 space-y-8">
                    <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                        회원가입
                    </h1>

                    {error && (
                        <div className="p-4 bg-red-100 text-red-700 rounded-lg flex items-center animate-fade-in">
                            <FiAlertCircle className="mr-2 text-xl" />
                            {error}
                        </div>
                    )}

                    <div className="space-y-6">
                        {/* 이름 입력 */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 flex items-center">
                                <FiUser className="mr-2 text-blue-600" />
                                이름
                            </label>
                            <input
                                type="text"
                                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 transition-all pl-10"
                                placeholder="홍길동"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>

                        {/* 이메일 인증 섹션 */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 flex items-center">
                                <FiMail className="mr-2 text-blue-600" />
                                이메일
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="email"
                                    className="flex-1 px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 pl-10"
                                    placeholder="example@domain.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <button
                                    onClick={handleRequestEmailVerification}
                                    className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                                        verificationRequested
                                            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                                    }`}
                                    disabled={verificationRequested}
                                >
                                    {verificationRequested ? (
                                        <div className="flex items-center">
                                            <FiClock className="mr-2 animate-pulse" />
                                            {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, "0")}
                                        </div>
                                    ) : (
                                        '인증요청'
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* 인증번호 입력 */}
                        {showVerificationInput && (
                            <div className="animate-slide-down">
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        className="flex-1 px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-green-500 pl-10"
                                        placeholder="인증번호 6자리"
                                        value={emailCode}
                                        onChange={(e) => setEmailCode(e.target.value)}
                                    />
                                    <button
                                        onClick={handleVerifyEmail}
                                        className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center"
                                    >
                                        <FiCheck className="mr-2" />
                                        확인
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* 비밀번호 입력 */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 flex items-center">
                                    <FiLock className="mr-2 text-blue-600" />
                                    비밀번호
                                </label>
                                <input
                                    type="password"
                                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 pl-10"
                                    placeholder="8자리 이상 입력"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 flex items-center">
                                    <FiLock className="mr-2 text-blue-600" />
                                    비밀번호 확인
                                </label>
                                <input
                                    type="password"
                                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 pl-10"
                                    placeholder="비밀번호 재입력"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* 주소 입력 */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                                <FiMapPin className="mr-2 text-blue-600" />
                                배송지 정보
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">도시</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500"
                                        value={city}
                                        onChange={(e) => setCity(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">거리</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500"
                                        value={street}
                                        onChange={(e) => setStreet(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">우편번호</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500"
                                        value={zipcode}
                                        onChange={(e) => setZipcode(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* 회원가입 버튼 */}
                        <button
                            onClick={handleSignup}
                            className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-transform hover:scale-[1.02] flex items-center justify-center disabled:opacity-50"
                            disabled={!emailVerified}
                        >
                            {emailVerified ? (
                                <>
                                    <FiCheck className="mr-2 animate-bounce" />
                                    회원가입 완료
                                </>
                            ) : (
                                '이메일 인증 필요'
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}