"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

// 🌐 1. 로그인 페이지 전용 다국어 사전 정의
const translations = {
  ko: {
    title: "용돈 관리",
    subtitle: "나만의 스마트 용돈 기록장 🐷",
    placeholderId: "아이디",
    placeholderPw: "비밀번호",
    btnLogin: "로그인",
    btnLoading: "로그인 중... 🐷",
    noAccount: "아직 계정이 없으신가요?",
    btnSignup: "회원가입",
    errorAuth: "아이디 또는 비밀번호가 올바르지 않아요 😢",
    currencySign: "₩", // 한국어일 땐 원화 기호
    langBtn: "🇯🇵 日本語"
  },
  ja: {
    title: "おこづかい管理",
    subtitle: "自分だけのスマートおこづかい帳 🐷",
    placeholderId: "ユーザーID",
    placeholderPw: "パスワード",
    btnLogin: "ログイン",
    btnLoading: "ログイン中... 🐷",
    noAccount: "アカウントをお持ちでないですか？",
    btnSignup: "新規登録",
    errorAuth: "IDまたはパスワードが正しくありません 😢",
    currencySign: "¥", // 일본어일 땐 엔화 기호
    langBtn: "🇰🇷 한국어"
  }
};

// 📸 돼지저금통 일러스트 (화폐 기호를 동적으로 받도록 수정)
function PiggyBankIllustration({ sign }: { sign: string }) {
  return (
    <svg viewBox="0 0 220 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <ellipse cx="110" cy="118" rx="72" ry="62" fill="#FFB74D" />
      <ellipse cx="102" cy="126" rx="32" ry="26" fill="#FFCC80" opacity="0.6" />
      <ellipse cx="62" cy="80" rx="16" ry="12" fill="#FF8A65" transform="rotate(-20 62 80)" />
      <ellipse cx="64" cy="81" rx="10" ry="7" fill="#FFAB91" transform="rotate(-20 64 81)" />
      <ellipse cx="162" cy="122" rx="24" ry="20" fill="#FF8A65" />
      <circle cx="156" cy="120" r="5" fill="#E64A19" />
      <circle cx="168" cy="120" r="5" fill="#E64A19" />
      <circle cx="142" cy="96" r="10" fill="white" />
      <circle cx="144" cy="96" r="6" fill="#2D2015" />
      <circle cx="147" cy="93" r="2" fill="white" />
      <rect x="95" y="56" width="30" height="6" rx="3" fill="#E65100" />
      <rect x="80" y="170" width="20" height="22" rx="10" fill="#FF8A65" />
      <rect x="108" y="174" width="20" height="20" rx="10" fill="#FF8A65" />
      <rect x="136" y="172" width="20" height="22" rx="10" fill="#FF8A65" />
      <path d="M40 110 Q24 96 32 80 Q40 64 28 54" stroke="#FF8A65" strokeWidth="5" strokeLinecap="round" fill="none" />
      <circle cx="166" cy="52" r="18" fill="#FFC107" />
      <circle cx="166" cy="52" r="14" fill="#FFD54F" />
      {/* 🪙 언어에 따라 ₩ 기호와 ¥ 기호가 바뀝니다! */}
      <text x="166" y="58" textAnchor="middle" fill="#E65100" fontSize="14" fontWeight="bold" fontFamily="sans-serif">{sign}</text>
      <circle cx="48" cy="56" r="4" fill="#FFC107" />
      <circle cx="190" cy="80" r="3" fill="#FF7043" />
      <circle cx="52" cy="148" r="3" fill="#FFC107" />
    </svg>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  // 🌐 언어 상태 추가 (기본값: 한국어)
  const [lang, setLang] = useState<'ko' | 'ja'>('ko');
  const t = translations[lang];

  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleLanguage = () => {
    setLang((prev) => (prev === 'ko' ? 'ja' : 'ko'));
  };

// app/login/page.tsx 내부의 handleLogin 함수 수정 부분

const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);
  setError(null);

  const emailFormatId = id.includes("@") ? id : `${id}@internal.com`;

  // 내장 Auth가 계정을 검증합니다.
  const { error } = await supabase.auth.signInWithPassword({
    email: emailFormatId,
    password: password,
  });

  if (error) {
    setError(t.errorAuth);
    setIsLoading(false);
    return;
  }

  // 로그인 성공 시 대시보드로 이동!
  router.push("/dashboard");
  router.refresh();
};

  return (
    <main
      className="min-h-screen w-full flex flex-col items-center justify-center relative"
      style={{
        background: "linear-gradient(160deg, #FFF8ED 0%, #FFE0B2 100%)",
        fontFamily: "var(--font-body)",
      }}
    >
      {/* 🌐 우측 상단 언어 전환 토글 버튼 */}
      <div className="absolute top-6 right-6">
        <button
          onClick={toggleLanguage}
          className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm text-xs font-bold border border-orange-100 hover:bg-white transition active:scale-95"
          style={{ color: "#E65100" }}
        >
          {t.langBtn}
        </button>
      </div>

      <div className="w-full max-w-sm px-6 py-10 flex flex-col items-center">
        {/* 헤더 타이틀 & 서브타이틀 */}
        <h1
          className="text-3xl font-extrabold text-center mb-1 tracking-tight"
          style={{ fontFamily: "var(--font-display)", color: "#E65100" }}
        >
          {t.title}
        </h1>
        <p className="text-sm mb-6 text-center font-semibold" style={{ color: "#FF8A65" }}>
          {t.subtitle}
        </p>

        {/* 일러스트 영역 */}
        <div
          className="w-48 h-40 mb-8 rounded-3xl flex items-center justify-center"
          style={{
            background: "linear-gradient(135deg, #FFF3E0 0%, #FFE0B2 100%)",
            boxShadow: "0 8px 32px rgba(255, 112, 67, 0.15)",
          }}
        >
          {/* 화폐 기호 프롭스 전달 */}
          <PiggyBankIllustration sign={t.currencySign} />
        </div>

        {error && (
          <div
            className="w-full mb-4 px-4 py-3 rounded-2xl text-sm font-semibold text-center"
            style={{ background: "#FFF0F0", color: "#D32F2F", border: "1.5px solid #FFCDD2" }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="w-full flex flex-col gap-4">
          {/* ID 입력창 */}
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg select-none">👤</span>
            <input
              type="text"
              placeholder={t.placeholderId}
              value={id}
              onChange={(e) => setId(e.target.value)}
              required
              className="w-full pl-11 pr-4 py-4 rounded-2xl text-base outline-none transition-all duration-200 focus:ring-2 focus:ring-orange-300"
              style={{
                background: "#ffffff",
                border: "2px solid #FFE0B2",
                color: "#2D2015",
                fontFamily: "var(--font-body)",
                fontWeight: 600,
                boxShadow: "0 2px 8px rgba(255, 112, 67, 0.08)",
              }}
            />
          </div>

          {/* 비밀번호 입력창 */}
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg select-none">🔒</span>
            <input
              type="password"
              placeholder={t.placeholderPw}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full pl-11 pr-4 py-4 rounded-2xl text-base outline-none transition-all duration-200 focus:ring-2 focus:ring-orange-300"
              style={{
                background: "#ffffff",
                border: "2px solid #FFE0B2",
                color: "#2D2015",
                fontFamily: "var(--font-body)",
                fontWeight: 600,
                boxShadow: "0 2px 8px rgba(255, 112, 67, 0.08)",
              }}
            />
          </div>

          {/* 로그인 제출 버튼 */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 rounded-2xl text-lg font-bold text-white mt-2 transition-all duration-200 active:scale-95 hover:-translate-y-0.5"
            style={{
              background: isLoading
                ? "#FFAB91"
                : "linear-gradient(135deg, #FF7043 0%, #FF5722 100%)",
              fontFamily: "var(--font-display)",
              boxShadow: isLoading ? "none" : "0 6px 20px rgba(255, 87, 34, 0.35)",
              cursor: isLoading ? "not-allowed" : "pointer",
            }}
          >
            {isLoading ? t.btnLoading : t.btnLogin}
          </button>
        </form>

        {/* 하단 회원가입 유도 영역 */}
        <div className="mt-6 flex items-center gap-2">
          <span className="text-sm" style={{ color: "#BCAAA4" }}>
            {t.noAccount}
          </span>
          <a
            href="/signup"
            className="text-sm font-bold underline underline-offset-2 transition-colors duration-150"
            style={{ color: "#FF7043" }}
          >
            {t.btnSignup}
          </a>
        </div>

        <div className="mt-10 flex gap-3 opacity-40 select-none">
          <span className="text-2xl">🪙</span>
          <span className="text-2xl">💰</span>
          <span className="text-2xl">🪙</span>
        </div>
      </div>
    </main>
  );
}