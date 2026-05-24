import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "./LanguageContext"; // 경로 확인 필요

export const metadata: Metadata = {
  title: "용돈 관리",
  description: "아이를 위한 스마트 용돈 기록장",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        {/* 씌워주기만 하면 하위 모든 페이지에서 언어 공유 가능 */}
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}