"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@/components/ui/menubar";

export default function ClientLayout({
  children,
  fontVariable,
  fontClassName,
}: Readonly<{
  children: React.ReactNode;
  fontVariable: string;
  fontClassName: string;
}>) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();
  const pathname = usePathname(); // 현재 경로를 가져옵니다
  const isAdminPage = pathname.startsWith("/admin"); // 관리자 페이지 확인

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

  const handleLogout = async () => {
    try {
      const response = await fetch(
        "http://localhost:8080/api/v1/users/logout",
        {
          method: "POST",
          credentials: "include", // ✅ 쿠키 포함 요청
        }
      );

      if (!response.ok) {
        throw new Error("로그아웃 실패");
      }

      setIsLoggedIn(false); // 메뉴 표시를 바꾸기 위해 상태 변경

      // ✅ 클라이언트에서 쿠키 삭제
      document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

      // 장바구니 선택 데이터 삭제
      localStorage.removeItem("selectedCartItems");

      alert("로그아웃 되었습니다.");
      router.push("/"); // ✅ 기본 메인 페이지로 이동
      router.refresh();
    } catch (error) {
      console.error("🔴 로그아웃 중 오류 발생:", error);
      alert("로그아웃 실패");
    }
  };

  return (
    <html lang="en" className={`${fontVariable}`}>
      <body
        className={`min-h-[100dvh] flex flex-col ${fontClassName} bg-gray-100 mx-20 py-4`}
      >
        {/* 관리자 페이지에서는 헤더를 숨김 */}
        {!isAdminPage && (
          <header className="flex justify-between gap-3 p-4 bg-gray-300 rounded-t-2xl items-center">
            <div className="flex justify-start">
              <Link href="/">
                <Image
                  src="/images/coffeeBeanLogo.png" // public 폴더 기준 경로
                  alt="커피빈 로고"
                  width={50}
                  height={30}
                />
              </Link>
            </div>
            <Menubar>
              {!isLoggedIn && (
                <MenubarMenu>
                  <MenubarTrigger>
                    <Link href="/user/login">로그인</Link>
                  </MenubarTrigger>
                </MenubarMenu>
              )}
              {!isLoggedIn && (
                <MenubarMenu>
                  <MenubarTrigger>
                    <Link href="/user/signup">회원가입</Link>
                  </MenubarTrigger>
                </MenubarMenu>
              )}
              {isLoggedIn && (
                <MenubarMenu>
                  <MenubarTrigger onClick={handleLogout}>
                    로그아웃
                  </MenubarTrigger>
                </MenubarMenu>
              )}
              {isLoggedIn && (
                <MenubarMenu>
                  <MenubarTrigger>My Page</MenubarTrigger>
                  <MenubarContent>
                    <MenubarItem>
                      <Link href="/my/home">My Page</Link>
                    </MenubarItem>
                    <MenubarSeparator />
                    <MenubarItem>
                      <Link href="/my/orders">주문 조회</Link>
                    </MenubarItem>
                    <MenubarSeparator />
                    <MenubarItem>
                      <Link href="/my/review">리뷰 조회</Link>
                    </MenubarItem>
                  </MenubarContent>
                </MenubarMenu>
              )}
              <MenubarMenu>
                <MenubarTrigger>
                  <Link href="/cart">장바구니</Link>
                </MenubarTrigger>
              </MenubarMenu>
            </Menubar>
          </header>
        )}
        <div className="flex-grow bg-gray-200 rounded-b-2xl">{children}</div>
        <footer></footer>
      </body>
    </html>
  );
}
