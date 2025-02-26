"use client";

import * as React from "react";
import { ShoppingCart, Coffee, User } from "lucide-react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

interface CoffeeShopMenuBarProps {
    isLoggedIn: boolean;
    onLogout: () => void;
}

const MenuBar: React.FC<CoffeeShopMenuBarProps> = ({ isLoggedIn, onLogout }) => {
    const cartItems = useSelector((state: RootState) => state.cart);
    const isAdmin = useSelector((state: RootState) => state.auth.isAdmin);
    const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <nav className="sticky top-0 z-50 bg-gradient-to-r from-sky-600 to-blue-800 text-white shadow-xl h-16">
            <div className="container mx-auto flex h-full items-center justify-between px-6">
                {/* 로고 */}
                <Link href="/" className="group flex items-center gap-3 hover:text-gray-200">
                    <Coffee className="h-7 w-7 transition-transform group-hover:rotate-12" />
                    <span className="text-xl font-bold tracking-wide">Bean Voyage</span>
                </Link>

                {/* 데스크탑 메뉴 */}
                <div className="flex items-center gap-8">
                    {/* 메인 메뉴 */}
                    <div className="hidden md:flex gap-6">
                        {[
                            { href: "/menu", label: "메뉴" },
                            { href: "/beans", label: "원두" },
                            { href: "/giftsets", label: "기프트 세트" },
                            { href: "/events", label: "이벤트" },
                        ].map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="relative px-2 py-1 transition-all hover:text-white
                         after:absolute after:bottom-0 after:left-0 after:h-[2px]
                         after:w-0 after:bg-white after:transition-all hover:after:w-full"
                            >
                                {item.label}
                            </Link>
                        ))}
                    </div>

                    {/* 우측 액션 영역 */}
                    <div className="flex items-center gap-4 ml-6 pl-6 border-l border-white/20">
                        {!isLoggedIn ? (
                            <>
                                <Link href="/user/login" className="btn-ghost btn-sm">
                                    로그인
                                </Link>
                                <Link href="/user/signup" className="btn-primary btn-sm">
                                    회원가입
                                </Link>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={onLogout}
                                    className="text-sm hover:text-gray-300 transition-colors"
                                >
                                    로그아웃
                                </button>

                                {/* 마이페이지 드롭다운 */}
                                <div className="relative group">
                                    <User className="h-6 w-6 cursor-pointer transition-transform group-hover:scale-110" />
                                    <div className="absolute top-full right-0 mt-2 w-48 origin-top scale-95 opacity-0
                              rounded-xl bg-gradient-to-b from-sky-700 to-blue-900 p-2 shadow-2xl
                              transition-all group-hover:scale-100 group-hover:opacity-100">
                                        <div className="space-y-1">
                                            {[
                                                { href: "/my/home", label: "내 정보", icon: "👤" },
                                                { href: "/my/orders", label: "주문 조회", icon: "📦" },
                                                { href: "/my/review", label: "리뷰 조회", icon: "⭐" },
                                            ].map((item) => (
                                                <Link
                                                    key={item.href}
                                                    href={item.href}
                                                    className="flex items-center gap-2 rounded-lg px-3 py-2
                                 text-sm hover:bg-white/10 transition-colors"
                                                >
                                                    <span>{item.icon}</span>
                                                    {item.label}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* 관리자 페이지 */}
                                {isAdmin && (
                                    <Link
                                        href="/admin"
                                        className="rounded-full bg-gradient-to-r from-amber-400 to-amber-600
                         px-4 py-1 text-sm font-bold text-blue-900 shadow-md
                         hover:shadow-lg transition-shadow"
                                    >
                                        ADMIN
                                    </Link>
                                )}
                            </>
                        )}

                        {/* 장바구니 with 수량 배지 */}
                        <div className="relative">
                            <Link href="/cart" className="relative inline-block">
                                <ShoppingCart className="h-6 w-6 cursor-pointer hover:text-gray-300 transition-transform hover:scale-110" />
                                {totalQuantity > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-red-500 text-white
                             rounded-full h-5 w-5 flex items-center justify-center
                             text-xs shadow-md animate-pulse">
                    {totalQuantity}
                  </span>
                                )}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default MenuBar;