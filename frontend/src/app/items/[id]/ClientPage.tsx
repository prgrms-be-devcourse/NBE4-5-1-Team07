"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useEffect, useState } from "react";

// ItemDto 인터페이스 정의
interface ItemDto {
  id: number;
  name: string;
  price: number;
  stockQuantity: number;
  description: string;
}

export default function ClientPage({ id }: { id: number }) {
  const [item, setItem] = useState<ItemDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1); // 수량 상태 관리

  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:8080/api/v1/items/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("상품 정보를 불러오는 데 실패했습니다.");
        }
        return response.json();
      })
      .then((data) => {
        setItem(data.data); // 백엔드 응답 구조에 맞게 설정
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching item:", error);
        setError("상품 정보를 불러올 수 없습니다.");
        setLoading(false);
      });
  }, [id]); // id가 변경될 때마다 실행

  const increaseQuantity = () => {
    if (quantity < (item?.stockQuantity || 0)) {
      setQuantity(quantity + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = parseInt(e.target.value, 10);
    if (newQuantity >= 1 && newQuantity <= (item?.stockQuantity || 0)) {
      setQuantity(newQuantity);
    }
  };

  if (loading) return <div className="text-center p-6">로딩 중...</div>;
  if (error) return <div className="text-center p-6 text-red-500">{error}</div>;
  if (!item)
    return <div className="text-center p-6">상품 정보를 찾을 수 없습니다.</div>;

  return (
    <>
      <div className="flex flex-row gap-4 justify-center py-4">
        <div className="p-2 rounded-2xl w-[50vw] h-[70vh] flex justify-center items-center">
          <Image
            src="/images/columbia.jpg" // public 폴더 기준 경로
            alt="커피빈 로고"
            width={500}
            height={300}
          />
        </div>
        <div className="border-l-2 border-blue-300 p-6 w-[50vw] h-[70vh] flex flex-col justify-around gap-4 font-bold text-2xl">
          <div>
            {item.name} <br />
            리뷰 몇개
          </div>
          <hr className="border-2 border-black" />
          <div>가격 : {item.price} </div>
          <div>재고수량 : {item.stockQuantity}</div>

          {/* 수량 선택 UI */}
          <div className="flex items-center gap-4">
            <Button
              className="w-[40px] bg-gray-200 text-black hover:bg-gray-300"
              onClick={decreaseQuantity}
            >
              -
            </Button>
            <input
              type="number"
              value={quantity}
              min="1"
              max={item.stockQuantity}
              onChange={handleQuantityChange}
              className="w-[60px] text-center border-2 border-gray-400 rounded-lg"
            />
            <Button
              className="w-[40px] bg-gray-200 text-black hover:bg-gray-300"
              onClick={increaseQuantity}
            >
              +
            </Button>
          </div>

          <div className="flex flex-row gap-4 justify-center">
            <div>
              <Button className="border-2 border-blue-500 w-[200px] bg-white text-black hover:bg-gray-400 ">
                장바구니 담기
              </Button>
            </div>
            <div>
              <Button className="bg-blue-500 w-[200px] hover:bg-gray-500 ">
                바로구매 {`>`}
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-row gap-4 justify-center py-4">
        <div className="p-6 rounded-2xl w-[50vw] h-[50vh] flex justify-center font-bold text-2xl ">
          상품 정보 : {item.description}
        </div>
        <div className="p-6 w-[50vw] h-[50vh] flex justify-center gap-4 font-bold text-2xl ">
          <div>리뷰</div>
        </div>
      </div>
    </>
  );
}
