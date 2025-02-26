"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import CoffeeShopMenuBar from "@/components/ui/menubar";

export default function ClientLayout({
                                       children,
                                       fontVariable,
                                       fontClassName,
                                     }: Readonly<{
  children: React.ReactNode;
  fontVariable: string;
  fontClassName: string;
}>) {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태
  const router = useRouter();
  const pathname = usePathname(); // 현재 경로
  const isAdminPage = pathname.startsWith("/admin"); // 관리자 페이지 여부 확인

  // 로그인 상태 확인
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/my/info", {
          method: "GET",
          credentials: "include",
        });
        const data = await res.json();

        if (res.ok && data.code === "200-1") {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        setIsLoggedIn(false);
      }
    };

    checkLoginStatus();
  }, []);

  // 로그아웃 처리
  const handleLogout = async () => {
    try {
      const response = await fetch(
          "http://localhost:8080/api/v1/users/logout",
          {
            method: "POST",
            credentials: "include", // 쿠키 포함 요청
          }
      );

      if (!response.ok) {
        throw new Error("로그아웃 실패");
      }

      setIsLoggedIn(false); // 로그아웃 후 상태 변경

      // 클라이언트에서 쿠키 삭제
      document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

      // 로컬 스토리지 데이터 삭제
      localStorage.removeItem("selectedCartItems");

      alert("로그아웃 되었습니다.");
      router.push("/"); // 메인 페이지로 이동
    } catch (error) {
      console.error("🔴 로그아웃 중 오류 발생:", error);
      alert("로그아웃 실패");
    }
  };

  return (
      <html lang="en" className={`${fontVariable}`}>
      <body
          className={`min-h-[100dvh] flex flex-col ${fontClassName} bg-gray-100`}
      >
      {/* 관리자 페이지에서는 메뉴바를 숨김 */}
      {!isAdminPage && (
          <header>
            {/* CoffeeShopMenuBar 컴포넌트 사용 */}
            <CoffeeShopMenuBar
                isLoggedIn={isLoggedIn}
                onLogout={handleLogout}
            />
          </header>
      )}
      <main className="flex-grow bg-gray-200 rounded-b-2xl">{children}</main>
      <footer className="bg-gradient-to-r from-indigo-900 to-sky-500 text-white py-6 shadow-lg border-t border-sky-400">
          <div className="container mx-auto px-4">
              <p className="text-sm md:text-base tracking-wide">
                  © {new Date().getFullYear()} Bean Voyage. All rights reserved.
                  <span className="block mt-2 text-sky-200 text-xs">
        Made with ☕ in Seoul
      </span>
              </p>
          </div>
      </footer>
      </body>
      </html>
  );
}