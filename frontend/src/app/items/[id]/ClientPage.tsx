"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { StarIcon } from "@heroicons/react/24/solid";
import { motion } from "framer-motion";
import { Disclosure } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

// ItemDto 인터페이스 정의
interface ItemDto {
  id: number;
  name: string;
  price: number;
  stockQuantity: number;
  description: string;
  imageUrl: string;
}

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
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

interface ReviewDto {
  reviewId: number;
  content: string;
  rating: number;
  createDate: string;
}

export default function ClientPage({ id }: { id: number }) {
  const [item, setItem] = useState<ItemDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1); // 수량 상태 관리
  const [selectedTab, setSelectedTab] = useState<
    "info" | "review" | "question"
  >("info"); // 선택된 탭 상태
  const [questions, setQuestions] = useState<QuestionDto[]>([]);
  const router = useRouter();
  const [reviews, setReviews] = useState<ReviewDto[]>([]);

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

  useEffect(() => {
    if (selectedTab === "question") {
      fetch(`http://localhost:8080/api/v1/items/${id}/questions?itemId=${id}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("질문 목록을 불러오는 데 실패했습니다.");
          }
          return response.json();
        })
        .then((data) => {
          setQuestions(data.data);
        })
        .catch((error) => {
          console.error("Error fetching questions:", error);
          setError("질문 목록을 불러올 수 없습니다.");
        });
    }
  }, [id, selectedTab]);

  useEffect(() => {
    if (selectedTab === "review") {
      fetch(`http://localhost:8080/api/v1/items/${id}/reviews`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("리뷰를 불러오는 데 실패했습니다.");
          }
          return response.json();
        })
        .then((data) => {
          setReviews(data.data);
        })
        .catch((error) => {
          console.error("Error fetching reviews:", error);
          setError("리뷰를 불러올 수 없습니다.");
        });
    }
  }, [id, selectedTab]);

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

  const handleAddToCart = async () => {
    if (!item) return;

    const cartItem: CartItem = {
      id: item.id,
      name: item.name,
      price: item.price,
      quantity,
    };

    try {
      const response = await fetch("http://localhost:8080/api/v1/carts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: item.id,
          quantity,
        }),
        credentials: "include",
      });

      if (response.status === 401) {
        // 🛒 비회원 → localStorage에 저장
        const localCart: CartItem[] = JSON.parse(
          localStorage.getItem("cartItems") || "[]"
        );

        // 기존 상품 있는지 확인
        const existingItem = localCart.find((item) => item.id === cartItem.id);
        if (existingItem) {
          existingItem.quantity += quantity; // 수량 증가
        } else {
          localCart.push(cartItem); // 새로운 상품 추가
        }

        localStorage.setItem("cartItems", JSON.stringify(localCart));
        alert("비회원 장바구니에 추가되었습니다.");
        return;
      }

      if (!response.ok) {
        throw new Error("장바구니 추가에 실패했습니다.");
      }

      const data = await response.json();
      alert(data.message || "장바구니에 상품이 추가되었습니다!");
    } catch (error) {
      console.error("장바구니 추가 중 오류:", error);
      alert("장바구니 추가 중 오류가 발생했습니다.");
    }
  };

  const handleCheckout = () => {
    if (!item) return;

    // 결제할 상품 정보 저장
    const checkoutItems = [
      {
        id: item.id,
        name: item.name,
        price: item.price,
        quantity,
      },
    ];

    localStorage.setItem("checkoutItems", JSON.stringify(checkoutItems));
    localStorage.removeItem("cartOrder");

    // 결제 페이지로 이동
    router.push("/orders/payment");
  };

  if (loading) return <div className="text-center p-6">로딩 중...</div>;
  if (error) return <div className="text-center p-6 text-red-500">{error}</div>;
  if (!item)
    return <div className="text-center p-6">상품 정보를 찾을 수 없습니다.</div>;

  console.log(item.imageUrl);

  return (
      <>
        <div className="flex gap-8 justify-center py-8 bg-gray-50">
          {/* 이미지 섹션 */}
          <motion.div
              className="group relative p-4 bg-white rounded-2xl shadow-xl w-[600px] h-[600px] overflow-hidden"
              whileHover={{ scale: 1.02 }}
          >
            <img
                src={item.imageUrl}
                alt={item.name}
                className="object-contain w-full h-full transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </motion.div>

          {/* 상품 정보 섹션 */}
          <div className="bg-white p-8 rounded-2xl shadow-xl w-[600px] space-y-8">
            <h1 className="text-4xl font-bold text-gray-900">{item.name}</h1>

            <div className="p-4 bg-blue-50 rounded-xl animate-pulse">
            <span className="text-4xl font-bold text-blue-600">
              {item.price.toLocaleString()}원
            </span>
              <span className="ml-4 text-xl line-through text-gray-400">
              149,000원
            </span>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-lg text-gray-600">재고:</span>
                <span className="text-xl font-semibold text-green-600">
                {item.stockQuantity}개 남음
              </span>
              </div>

              <div className="flex items-center gap-4">
                <Button
                    className="w-12 h-12 hover:scale-110 transition-all bg-blue-100 text-blue-600 text-2xl"
                    onClick={decreaseQuantity}
                >
                  ➖
                </Button>
                <input
                    type="number"
                    value={quantity}
                    onChange={handleQuantityChange}
                    className="w-20 text-center border-2 border-blue-200 rounded-lg text-xl font-bold"
                />
                <Button
                    className="w-12 h-12 hover:scale-110 transition-all bg-blue-100 text-blue-600 text-2xl"
                    onClick={increaseQuantity}
                >
                  ➕
                </Button>
              </div>
            </div>

            <div className="flex gap-4">
              <Button
                  className="flex-1 h-14 bg-white border-2 border-blue-500 text-blue-600 hover:bg-blue-50
              text-xl font-bold transition-all hover:shadow-lg"
                  onClick={handleAddToCart}
              >
                🛒 장바구니 담기
              </Button>
              <Button
                  className="flex-1 h-14 bg-blue-600 hover:bg-blue-700 text-white
              text-xl font-bold transition-all hover:shadow-lg"
                  onClick={handleCheckout}
              >
                💳 바로구매
              </Button>
            </div>
          </div>
        </div>

        {/* 탭 메뉴 */}
        <div className="flex justify-center space-x-4 py-6 border-b-2 bg-white">
          {(["info", "review", "question"] as const).map((tab) => (
              <Button
                  key={tab}
                  onClick={() => setSelectedTab(tab)}
                  className={`px-8 py-3 text-lg font-semibold rounded-full transition-all ${
                      selectedTab === tab
                          ? "bg-blue-600 text-white shadow-lg"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
              >
                {{
                  info: "📦 상품정보",
                  review: "⭐ 리뷰",
                  question: "❓ 문의",
                }[tab]}
              </Button>
          ))}
        </div>

        {/* 탭 내용 */}
        <div className="p-8 bg-gray-50">
          {selectedTab === "info" && (
              <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="prose max-w-none bg-white p-8 rounded-xl shadow"
              >
                <h2 className="text-3xl font-bold mb-6">상품 상세정보</h2>
                <div dangerouslySetInnerHTML={{ __html: item.description }} />
              </motion.div>
          )}

          {selectedTab === "review" && (
              <div className="space-y-6">
                <h2 className="text-3xl font-bold">🧑💻 구매자 리뷰 ({reviews.length})</h2>
                {reviews.map((review) => (
                    <motion.div
                        key={review.reviewId}
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="bg-white p-6 rounded-xl shadow"
                    >
                      <div className="flex items-center gap-2 mb-4">
                        {[...Array(5)].map((_, i) => (
                            <StarIcon
                                key={i}
                                className={`h-6 w-6 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                            />
                        ))}
                      </div>
                      <p className="text-lg text-gray-800">"{review.content}"</p>
                      <p className="text-sm text-gray-500 mt-4">
                        {new Date(review.createDate).toLocaleDateString()}
                      </p>
                    </motion.div>
                ))}
              </div>
          )}

          {selectedTab === "question" && (
              <div className="space-y-6">
                <div className="text-right">
                  <Link href={`/questions/new?itemId=${item.id}`}>
                    <Button className="bg-white border-2 border-blue-500 text-blue-600
                hover:bg-blue-50 px-6 py-3 text-lg">
                      ✏️ 새 질문 작성
                    </Button>
                  </Link>
                </div>

                {questions.map((question) => (
                    <Disclosure key={question.id} as="div" className="bg-white rounded-xl shadow">
                      {({ open }) => (
                          <>
                            <Disclosure.Button className="flex justify-between items-center w-full px-6 py-4
                    text-lg font-semibold hover:bg-gray-50">
                              <span>{question.subject}</span>
                              <ChevronDownIcon className={`${open ? 'transform rotate-180' : ''} 
                      h-6 w-6 text-blue-600 transition-transform`} />
                            </Disclosure.Button>

                            <Disclosure.Panel className="px-6 py-4 border-t">
                              <p className="text-gray-600 mb-4">{question.content}</p>
                              {question.answer ? (
                                  <div className="bg-blue-50 p-4 rounded-lg">
                                    <div className="flex items-center gap-2 text-blue-600 mb-2">
                                      <span className="font-semibold">📢 답변:</span>
                                      <span className="text-sm">
                              {new Date(question.answer.createDate).toLocaleDateString()}
                            </span>
                                    </div>
                                    <p className="text-gray-800">{question.answer.content}</p>
                                  </div>
                              ) : (
                                  <div className="text-gray-500">⏳ 답변 대기 중입니다</div>
                              )}
                            </Disclosure.Panel>
                          </>
                      )}
                    </Disclosure>
                ))}
              </div>
          )}
        </div>
      </>
  );
}