"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { PencilIcon } from "@heroicons/react/24/outline";

export interface UserInfoResponse {
  name: string; // ✅ userName → name으로 변경
  email: string;
  passwordMasked: string;
  address: {
    city: string;
    street: string;
    zipcode: string;
  };
}

export default function ProfileEditPage() {
  const [data, setData] = useState<UserInfoResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetch("http://localhost:8080/api/my/info", {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((result) => {
        console.log("🔍 API 응답 데이터:", result); // ✅ API 응답 확인

        if (result) {
          setData(result.data); // ✅ `data` 객체 저장
        } else {
          console.error("❌ 응답 데이터가 없습니다:", result);
        }
      })
      .catch((err) => {
        console.error("🚨 API 요청 실패:", err);
        alert(err.message);
      });
  }, []);

  if (!data) return <div className="text-center py-10">로딩 중...</div>;

  return (
    <div className="py-10 px-6 bg-gray-50 min-h-screen">
      <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-3xl font-bold text-center mb-8">내 정보 수정</h1>

        <div className="space-y-6">
          {/* 이름 */}
          <div className="flex justify-between items-center pb-4 border-b">
            <div>
              <p className="text-gray-600 text-sm">이름</p>
              <p className="text-lg font-semibold">
                {data?.name || "이름 없음"}
              </p>
            </div>
            <button
              onClick={() => router.push("/my/home/profile/edit/name")}
              className="text-blue-600 hover:underline flex items-center gap-1"
            >
              <PencilIcon className="w-5 h-5" />
              변경
            </button>
          </div>

          {/* 이메일 (수정 불가) */}
          <div className="flex justify-between items-center pb-4 border-b">
            <div>
              <p className="text-gray-600 text-sm">이메일</p>
              <p className="text-lg font-semibold">
                {data?.email || "이메일 없음"}
              </p>
            </div>
          </div>

          {/* 비밀번호 */}
          <div className="flex justify-between items-center pb-4 border-b">
            <div>
              <p className="text-gray-600 text-sm">비밀번호</p>
              <p className="text-lg font-semibold">********</p>
            </div>
            <button
              onClick={() => router.push("/my/home/profile/edit/password")}
              className="text-blue-600 hover:underline flex items-center gap-1"
            >
              <PencilIcon className="w-5 h-5" />
              변경
            </button>
          </div>

          {/* 주소 */}
          <div className="flex justify-between items-center pb-4 border-b">
            <div>
              <p className="text-gray-600 text-sm">주소</p>
              <p className="text-lg font-semibold">
                {data?.address?.city || "주소 없음"},{" "}
                {data?.address?.street || ""}
                {data?.address?.zipcode ? ` (${data.address.zipcode})` : ""}
              </p>
            </div>
            <button
              onClick={() => router.push("/my/home/profile/edit/address")}
              className="text-blue-600 hover:underline flex items-center gap-1"
            >
              <PencilIcon className="w-5 h-5" />
              변경
            </button>
          </div>
        </div>

        {/* 마이페이지로 돌아가기 */}
        <div className="mt-10 text-center">
          <Link
            href="/my/home"
            className="text-gray-600 hover:text-gray-800 flex items-center justify-center gap-1"
          >
            <ChevronRightIcon className="w-5 h-5" />
            마이페이지로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
}
