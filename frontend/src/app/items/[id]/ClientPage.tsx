"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function ClientPage({}: {}) {
  return (
    <>
      <div className="flex flex-row gap-4 justify-center py-4">
        <div
          className=" p-2 
        rounded-2xl w-[50vw] h-[70vh] flex justify-center items-center"
        >
          <Image
            src="/images/columbia.jpg" // public 폴더 기준 경로
            alt="커피빈 로고"
            width={500}
            height={300}
          />
        </div>
        <div
          className="border-l-2 border-blue-300 p-6
         w-[50vw] h-[70vh] flex flex-col justify-around gap-4
        font-bold text-2xl "
        >
          <div>
            Columbia Coffee <br />
            리뷰 몇개
          </div>
          <hr className="border-2 border-black" />
          <div>가격 : 14,000원 </div>
          <div>수량 : 1개</div>

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
        <div
          className=" p-6 
        rounded-2xl w-[50vw] h-[50vh] flex justify-center font-bold text-2xl "
        >
          상품 정보
        </div>
        <div
          className=" p-6
         w-[50vw] h-[50vh] flex justify-center gap-4
        font-bold text-2xl "
        >
          <div>리뷰</div>
        </div>
      </div>
    </>
  );
}
