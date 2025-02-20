"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import ClientPage from "../notice/ClientPage";

export default function ClinetLayout() {
  const products = Array.from({ length: 8 }, (_, i) => ({
    id: i + 1,
    name: `상품 ${i + 1}`,
    price: (i + 1) * 1000,
  }));

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="p-4">
          <div className="pb-4">
            상품 목록입니다. 상품을 누르면 상세 페이지로 이동합니다.
          </div>
          <ul className="grid grid-cols-4 gap-6 px-4 w-11/12 mx-auto">
            {products.map((product) => (
              <Link href={`/items/${product.id}`} key={product.id}>
                <li className="border-2 border-blue-300 p-2 rounded-2xl  h-[200px] hover:bg-gray-100 flex items-center justify-center">
                  {product.id}. {product.name} - {product.price}원
                </li>
              </Link>
            ))}
          </ul>
        </div>
        <div className="bg-gray-300 rounded-b-2xl py-6 flex flex-col gap-2">
          <div className="pl-4 flex flex-row gap-4">
            <Link href="/notice">
              <Button className="bg-blue-300 w-[100px] ">공지사항</Button>
            </Link>
            <Button className="bg-blue-300 w-[100px] ">FAQ</Button>
          </div>
          <ClientPage />
        </div>
      </div>
    </>
  );
}
