"use client";

import Link from "next/link";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { useRouter } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

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

      // ✅ 클라이언트에서 쿠키 삭제
      document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

      // 장바구니 선택 데이터 삭제
      localStorage.removeItem("selectedCartItems");

      alert("로그아웃 되었습니다.");
      router.push("/admin/login"); // ✅ 기본 메인 페이지로 이동
    } catch (error) {
      console.error("🔴 로그아웃 중 오류 발생:", error);
      alert("로그아웃 실패");
    }
  };

  return (
    <div>
      <Menubar className="flex justify-center box-content ">
        <MenubarMenu>
          <MenubarTrigger className="hover:bg-gray-200 cursor-pointer">
            상품 관리
          </MenubarTrigger>
          <MenubarContent>
            <MenubarItem>
              <Link href="/admin/addItem">새상품 등록</Link>
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem>
              <Link href="/admin/checkItems">재고 확인</Link>
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem>
              <Link href="/admin/modifyItems">상품 목록</Link>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>

        <MenubarMenu>
          <MenubarTrigger className="hover:bg-gray-200 cursor-pointer">
            <Link href="/admin/orderManagement">주문 관리</Link>
          </MenubarTrigger>
        </MenubarMenu>

        <MenubarMenu>
          <MenubarTrigger className="hover:bg-gray-200 cursor-pointer">
            문의
          </MenubarTrigger>
          <MenubarContent>
            <MenubarItem>
              <Link href="/admin/noticeManagement">공지사항 관리</Link>
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem>
              <Link href="/admin/questionManagement">질문 관리</Link>
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem>
              <Link href="/admin/reviewByItems">상품별 리뷰</Link>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>

        <MenubarMenu>
          <MenubarTrigger className="hover:bg-gray-200 cursor-pointer">
            <Link href="/admin/login">로그인</Link>
          </MenubarTrigger>
        </MenubarMenu>

        {/* 로그아웃 메뉴 추가 */}
        <MenubarMenu>
          <MenubarTrigger
            className="hover:bg-gray-200 cursor-pointer"
            onClick={handleLogout}
          >
            로그아웃
          </MenubarTrigger>
        </MenubarMenu>
      </Menubar>

      <div className="p-4">{children}</div>
    </div>
  );
}
