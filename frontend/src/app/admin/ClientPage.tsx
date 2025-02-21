"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar";

export default function ClinetLayout() {
  const products = Array.from({ length: 8 }, (_, i) => ({
    id: i + 1,
    name: `상품 ${i + 1}`,
    price: (i + 1) * 1000,
  }));

  return (
    <>
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
              <Link href="/admin/modifyItems">상품 변경</Link>
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
      <div className="flex w-full justify-end">
        <div className="flex w-full max-w-sm items-center space-x-2">
          <Input
            type="items"
            placeholder="상품명"
            className="bg-white text-black"
          />
          <Button type="submit">검색</Button>
        </div>
      </div>
      <div>관리자 페이지</div>
    </>
  );
}
