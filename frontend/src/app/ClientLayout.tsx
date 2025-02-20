"use client";

import Link from "next/link";
import Image from "next/image";

import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@/components/ui/menubar";
import ClientPage from "./notice/ClientPage";
import { Button } from "@/components/ui/button";

export default function ClinetLayout({
  children,
  //   me,
  fontVariable,
  fontClassName,
}: Readonly<{
  children: React.ReactNode;
  //   me: components["schemas"]["MemberDto"];
  fontVariable: string;
  fontClassName: string;
}>) {
  return (
    <html lang="en" className={`${fontVariable}`}>
      <body
        className={`min-h-[100dvh] flex flex-col ${fontClassName} bg-gray-100 mx-20 py-4`}
      >
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
            <MenubarMenu>
              <MenubarTrigger>
                <Link href="/user/login">로그인</Link>
              </MenubarTrigger>
            </MenubarMenu>
            <MenubarMenu>
              <MenubarTrigger>
                <Link href="/user/signup">회원가입</Link>
              </MenubarTrigger>
            </MenubarMenu>
            <MenubarMenu>
              <MenubarTrigger>
                <Link href="">로그아웃</Link>
              </MenubarTrigger>
            </MenubarMenu>
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
            <MenubarMenu>
              <MenubarTrigger>
                <Link href="/cart">장바구니</Link>
              </MenubarTrigger>
            </MenubarMenu>
          </Menubar>
        </header>
        <div className="flex-grow bg-gray-200 p-4">{children}</div>
        <footer className="bg-gray-300 rounded-b-2xl p-4 flex flex-col gap-2">
          <div>
            <div className="pl-4 flex flex-row gap-4">
              <Button className="bg-blue-300 w-[100px] ">공지사항</Button>
              <Button className="bg-blue-300 w-[100px] ">FAQ</Button>
            </div>
            <ClientPage />
          </div>
        </footer>
      </body>
    </html>
  );
}
