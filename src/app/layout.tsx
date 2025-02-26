"use client";

import "./globals.css";
import { Inter } from "next/font/google";
import ClientLayout from "@/components/ui/ClientLayout";
import { Providers } from '@/redux/provider';

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="ko" className={inter.className}>
        <body className="min-h-screen bg-gray-50 text-gray-800">
        {/* Redux Provider로 전체 앱 래핑 */}
        <Providers>
            {/* 클라이언트 레이아웃 */}
            <ClientLayout>{children}</ClientLayout>
        </Providers>
        </body>
        </html>
    );
}