"use client";

import "./globals.css";
import { Inter } from "next/font/google";
import ClientLayout from "@/components/ui/ClientLayout";
import { Providers } from "@/redux/provider";
import localFont from "next/font/local";

const inter = Inter({ subsets: ["latin"] });

const pretendard = localFont({
  src: "./../../node_modules/pretendard/dist/web/variable/woff2/PretendardVariable.woff2",
  display: "swap",
  weight: "45 920",
  variable: "--font-pretendard",
});

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
          <ClientLayout
            fontVariable={pretendard.variable}
            fontClassName={pretendard.className}
          >
            {children}
          </ClientLayout>
        </Providers>
      </body>
    </html>
  );
}
