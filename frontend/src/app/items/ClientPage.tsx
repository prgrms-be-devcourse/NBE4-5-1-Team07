"use client";

import Link from "next/link";

export default function ClinetLayout() {
  const products = Array.from({ length: 8 }, (_, i) => ({
    id: i + 1,
    name: `상품 ${i + 1}`,
    price: (i + 1) * 1000,
  }));

  return (
    <>
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
