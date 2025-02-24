"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

interface ItemDto {
  id: number;
  name: string;
  price: number;
  stockQuantity: number;
  description: string;
}

interface AnswerDto {
  content: string;
  createDate: string;
  modifyDate: string;
}

interface QuestionDto {
  id: number;
  itemId: number;
  name: string;
  subject: string;
  content: string;
  createDate: string;
  modifyDate: string;
  answer: AnswerDto | null;
}

export default function ClientPage({ id }: { id: number }) {
  const [item, setItem] = useState<ItemDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedTab, setSelectedTab] = useState<"info" | "review" | "question">("info");
  const [questions, setQuestions] = useState<QuestionDto[]>([]);

  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:8080/api/v1/items/${id}`)
        .then((response) => {
          if (!response.ok) throw new Error("상품 정보를 불러오는 데 실패했습니다.");
          return response.json();
        })
        .then((data) => {
          setItem(data.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching item:", error);
          setError("상품 정보를 불러올 수 없습니다.");
          setLoading(false);
        });
  }, [id]);

  useEffect(() => {
    if (selectedTab === "question") {
      fetch(`http://localhost:8080/api/v1/items/${id}/questions?itemId=${id}`)
          .then((response) => {
            if (!response.ok) throw new Error("질문 목록을 불러오는 데 실패했습니다.");
            return response.json();
          })
          .then((data) => setQuestions(data.data))
          .catch((error) => {
            console.error("Error fetching questions:", error);
            setError("질문 목록을 불러올 수 없습니다.");
          });
    }
  }, [id, selectedTab]);

  const handleQuantity = (type: 'increase' | 'decrease') => {
    setQuantity(prev => {
      if (type === 'increase') return Math.min(prev + 1, item?.stockQuantity || 0);
      return Math.max(prev - 1, 1);
    });
  };

  if (loading) return <div className="text-center p-6">로딩 중...</div>;
  if (error) return <div className="text-center p-6 text-red-500">{error}</div>;
  if (!item) return <div className="text-center p-6">상품 정보를 찾을 수 없습니다.</div>;

  return (
      <>
        <div className="flex flex-row gap-4 justify-center py-4">
          {/* 상품 이미지 및 기본 정보 섹션 */}
          <div className="p-2 rounded-2xl w-[50vw] h-[70vh] flex justify-center items-center">
            <Image
                src="/images/columbia.jpg"
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
            <div>가격 : {item.price}</div>
            <div>재고수량 : {item.stockQuantity}</div>

            <div className="flex items-center gap-4">
              <Button className="w-[40px] bg-gray-200 text-black hover:bg-gray-300"
                      onClick={() => handleQuantity('decrease')}>-</Button>
              <input
                  type="number"
                  value={quantity}
                  min="1"
                  max={item.stockQuantity}
                  onChange={(e) => setQuantity(Math.min(Math.max(1, parseInt(e.target.value)), item.stockQuantity))}
                  className="w-[60px] text-center border-2 border-gray-400 rounded-lg"
              />
              <Button className="w-[40px] bg-gray-200 text-black hover:bg-gray-300"
                      onClick={() => handleQuantity('increase')}>+</Button>
            </div>

            <div className="flex flex-row gap-4 justify-center">
              <Button className="border-2 border-blue-500 w-[200px] bg-white text-black hover:bg-gray-400">
                장바구니 담기
              </Button>
              <Button className="bg-blue-500 w-[200px] hover:bg-gray-500">
                바로구매 {`>`}
              </Button>
            </div>
          </div>
        </div>

        {/* 탭 인터페이스 */}
        <div className="flex justify-center space-x-4 py-4 border-b-2">
          {(["info", "review", "question"] as const).map((tab) => (
              <Button
                  key={tab}
                  onClick={() => setSelectedTab(tab)}
                  className={`${selectedTab === tab ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}
              >
                {{ info: '상품 정보', review: '리뷰', question: '상품 문의' }[tab]}
              </Button>
          ))}
        </div>

        {/* 탭 컨텐츠 */}
        <div className="p-6">
          {selectedTab === "info" && (
              <div className="text-2xl h-[50vh]">
                <h2>상품 정보</h2>
                <div dangerouslySetInnerHTML={{ __html: item.description }} />
              </div>
          )}

          {selectedTab === "review" && (
              <div className="text-2xl h-[50vh]">
                <h2>리뷰</h2>
                <p>여기에 리뷰 목록이 들어갑니다.</p>
              </div>
          )}

          {selectedTab === "question" && (
              <div className="space-y-4">
                <div className="flex justify-center pb-4">
                  <Link href="/questions/new">
                    <Button className="border-2 border-blue-500 bg-white text-black hover:bg-gray-400">
                      질문 작성
                    </Button>
                  </Link>
                </div>

                {questions.length > 0 ? (
                    <ul className="space-y-4">
                      {questions.map((question) => (
                          <li key={question.id} className="p-4 border rounded-lg shadow">
                            <Link href={`/questions/${question.id}`} className="block">
                              <h3 className="text-lg font-semibold">{question.subject}</h3>
                              <p className="text-gray-600">작성자: {question.name}</p>
                              <p className="text-sm text-gray-500">
                                작성일: {new Date(question.createDate).toLocaleString()}
                              </p>
                              <p className="mt-2">{question.content}</p>
                            </Link>

                            {question.answer ? (
                                <div className="mt-4 p-3 border-l-4 border-blue-500 bg-blue-50">
                                  <p className="font-semibold">답변:</p>
                                  <p>{question.answer.content}</p>
                                  <p className="text-xs text-gray-500">
                                    작성일: {new Date(question.answer.createDate).toLocaleString()}
                                  </p>
                                </div>
                            ) : (
                                <p className="mt-4 text-gray-500">아직 답변이 없습니다.</p>
                            )}
                          </li>
                      ))}
                    </ul>
                ) : (
                    <p className="text-center">등록된 질문이 없습니다.</p>
                )}
              </div>
          )}
        </div>
      </>
  );
}
