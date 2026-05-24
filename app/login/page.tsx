"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useLanguage } from "../LanguageContext"; // 💡 훅 가져오기

// 🌐 로그인용 다국어 사전
const translations = {
  ko: {
    title: "용돈 관리",
    subtitle: "나만의 스마트 용돈 기록장 🐷",
    placeholderId: "이메일 또는 아이디",
    placeholderPw: "비밀번호",
    btnLogin: "로그인",
    btnLoading: "로그인 중... 🐷",
    noAccount: "아직 계정이 없으신가요?",
    btnSignup: "회원가입",
    errorAuth: "아이디 또는 비밀번호를 다시 확인해 주세요 😢",
    langBtn: "🇯🇵 日本語"
  },
  ja: {
    title: "おこづかい管理",
    subtitle: "スマートなおこづかい帳 🐷",
    placeholderId: "メールアドレスまたはID",
    placeholderPw: "パスワード",
    btnLogin: "ログイン",
    btnLoading: "ログイン中... 🐷",
    noAccount: "アカウントをお持ちでないですか？",
    btnSignup: "新規登録",
    errorAuth: "IDまたはパスワードをもう一度ご確認ください 😢",
    langBtn: "🇰🇷 한국어"
  }
};

function PiggyBankIllustration() {
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
      <text x="166" y="58" textAnchor="middle" fill="#E65100" fontSize="14" fontWeight="bold" fontFamily="sans-serif">₩</text>
      <circle cx="48" cy="56" r="4" fill="#FFC107" />
      <circle cx="190" cy="80" r="3" fill="#FF7043" />
      <circle cx="52" cy="148" r="3" fill="#FFC107" />
    </svg>
  );
}

const inputStyle = {
  background: "#ffffff",
  border: "2px solid #FFE0B2",
  color: "#2D2015",
  fontFamily: "var(--font-body)",
  fontWeight: 600,
  boxShadow: "0 2px 8px rgba(255, 112, 67, 0.08)",
} as React.CSSProperties;

function InputField({
  icon,
  type = "text",
  placeholder,
  value,
  onChange,
}: {
  icon: string;
  type?: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div className="relative">
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg select-none">{icon}</span>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
        className="w-full pl-11 pr-4 py-4 rounded-2xl text-base outline-none transition-all duration-200"
        style={{
          ...inputStyle,
          border: focused ? "2px solid #FF7043" : "2px solid #FFE0B2",
          boxShadow: focused
            ? "0 0 0 4px rgba(255, 112, 67, 0.12)"
            : "0 2px 8px rgba(255, 112, 67, 0.08)",
        }}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
    </div>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  // 💡 전역 언어 상태 연결
  const { lang, toggleLanguage } = useLanguage();
  const t = translations[lang];

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const emailFormatId = email.includes("@") ? email : `${email}@internal.com`;

    const { error: authError } = await supabase.auth.signInWithPassword({
      email: emailFormatId,
      password: password,
    });

    if (authError) {
      setError(t.errorAuth);
      setIsLoading(false);
      return;
    }

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
        <h1
          className="text-3xl font-extrabold text-center mb-1 tracking-tight"
          style={{ fontFamily: "var(--font-display)", color: "#E65100" }}
        >
          {t.title}
        </h1>
        <p className="text-sm mb-6 text-center font-semibold" style={{ color: "#FF8A65" }}>
          {t.subtitle}
        </p>

        <div
          className="w-48 h-40 mb-8 rounded-3xl flex items-center justify-center"
          style={{
            background: "linear-gradient(135deg, #FFF3E0 0%, #FFE0B2 100%)",
            boxShadow: "0 8px 32px rgba(255, 112, 67, 0.15)",
          }}
        >
          <PiggyBankIllustration />
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
          <InputField icon="👤" placeholder={t.placeholderId} value={email} onChange={setEmail} />
          <InputField icon="🔒" type="password" placeholder={t.placeholderPw} value={password} onChange={setPassword} />

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 rounded-2xl text-lg font-bold text-white mt-2 transition-all duration-200 active:scale-95"
            style={{
              background: isLoading ? "#FFAB91" : "linear-gradient(135deg, #FF7043 0%, #FF5722 100%)",
              fontFamily: "var(--font-display)",
              boxShadow: isLoading ? "none" : "0 6px 20px rgba(255, 87, 34, 0.35)",
              cursor: isLoading ? "not-allowed" : "pointer",
            }}
          >
            {isLoading ? t.btnLoading : t.btnLogin}
          </button>
        </form>

        <div className="mt-6 flex items-center gap-2">
          <span className="text-sm" style={{ color: "#BCAAA4" }}>{t.noAccount}</span>
          <button
            onClick={() => router.push("/signup")}
            className="text-sm font-bold underline underline-offset-2"
            style={{ color: "#FF7043" }}
          >
            {t.btnSignup}
          </button>
        </div>
      </div>
    </main>
  );
}