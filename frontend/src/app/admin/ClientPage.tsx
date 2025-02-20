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
      <div className="">
        <div className="pb-4">
          상품 목록입니다. 상품을 누르면 상세 페이지로 이동합니다.
        </div>
        <ul className="grid grid-cols-4 gap-6 px-4 w-11/12 mx-auto">
          {products.map((product) => (
            <li
              className="border-2 border-red-300 p-2 rounded-2xl  h-[200px] hover:bg-gray-100 flex items-center justify-center"
              key={product.id}
            >
              <Link href={`/items/${product.id}`}>
                {product.id}. {product.name} - {product.price}원
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
