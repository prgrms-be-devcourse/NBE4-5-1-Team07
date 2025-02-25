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

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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

        {/* 로그아웃 메뉴 추가 */}
        <MenubarMenu>
          <MenubarTrigger className="hover:bg-gray-200 cursor-pointer">
            로그아웃
          </MenubarTrigger>
        </MenubarMenu>
      </Menubar>

      <div className="p-4">{children}</div>
    </div>
  );
}
