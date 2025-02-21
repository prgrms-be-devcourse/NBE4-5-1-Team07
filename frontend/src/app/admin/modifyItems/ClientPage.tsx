"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image"; // ✅ next/image import

export type Item = {
  id: number;
  name: string;
  price: number;
  stockQuantity: number;
  description: string;
  imageUrl?: string;
};

const initialItems: Item[] = [
  {
    id: 1,
    name: "상품 1",
    price: 1000,
    stockQuantity: 10,
    description: "설명 1",
    imageUrl: "/images/columbia.jpg",
  },
  {
    id: 2,
    name: "상품 2",
    price: 2000,
    stockQuantity: 20,
    description: "설명 2",
    imageUrl: "/images/columbia.jpg",
  },
  {
    id: 3,
    name: "상품 3",
    price: 3000,
    stockQuantity: 30,
    description: "설명 3",
    imageUrl: "/images/columbia.jpg",
  },
];

export default function ModifyItemsClientPage() {
  const [items] = useState<Item[]>(initialItems);
  const router = useRouter();

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">상품 목록</h1>
      <ul className="space-y-4">
        {items.map((item) => (
          <li
            key={item.id}
            className="border rounded p-4 flex items-center cursor-pointer hover:bg-gray-200"
            onClick={() => router.push(`/admin/modifyItems/${item.id}`)}
          >
            {item.imageUrl && (
              <Image
                src={item.imageUrl}
                alt={item.name}
                width={64} // ✅ 가로 크기 설정
                height={64} // ✅ 세로 크기 설정
                className="rounded"
              />
            )}
            <span className="font-semibold text-lg">{item.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
