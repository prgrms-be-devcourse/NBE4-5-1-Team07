"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
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
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div>
      <Menubar className="flex w-full box-content">
        <MenubarMenu>
          <MenubarTrigger>상품 관리</MenubarTrigger>
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
          <MenubarTrigger>
            <Link href="/admin/OrderManagement">주문 관리</Link>
          </MenubarTrigger>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>문의</MenubarTrigger>
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
      </Menubar>

      <div className="flex w-full justify-end p-4">
        <input
          type="text"
          placeholder="상품명 검색"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border p-2 rounded"
        />
        <Button className="ml-2">검색</Button>
      </div>

      <div className="p-4">{children}</div>
    </div>
  );
}
