"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Lang = "ko" | "ja";

interface LanguageContextType {
  lang: Lang;
  toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>("ko"); // 디폴트는 한국어

  // 💾 브라우저에 저장된 기존 언어 설정이 있다면 불러오기
  useEffect(() => {
    const savedLang = localStorage.getItem("app_lang") as Lang;
    if (savedLang === "ko" || savedLang === "ja") {
      setLang(savedLang);
    }
  }, []);

  // 🔄 언어 토글 함수 (바꿀 때마다 로컬스토리지에 저장)
  const toggleLanguage = () => {
    setLang((prev) => {
      const nextLang = prev === "ko" ? "ja" : "ko";
      localStorage.setItem("app_lang", nextLang);
      return nextLang;
    });
  };

  return (
    <LanguageContext.Provider value={{ lang, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

// 💡 다른 컴포넌트에서 쉽게 꺼내 쓰기 위한 커스텀 훅
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}