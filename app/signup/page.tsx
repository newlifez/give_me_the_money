"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

// 🌐 1. 회원가입 페이지 전용 다국어 사전 정의
const translations = {
  ko: {
    title: "회원가입",
    subtitle: "용돈 관리 시작하기",
    placeholderId: "아이디",
    placeholderPw: "비밀번호 (6자 이상)",
    placeholderConfirmPw: "비밀번호 확인",
    btnSignup: "회원가입",
    btnLoading: "가입 중...",
    hasAccount: "이미 계정이 있으신가요?",
    btnLogin: "로그인",
    successTitle: "가입 완료!",
    successDesc: "회원가입이 성공적으로 완료되었습니다. 🎉",
    btnGoLogin: "로그인하러 가기",
    errorPasswordMatch: "비밀번호가 일치하지 않아요 🔑",
    errorPasswordLength: "비밀번호는 6자 이상이어야 해요",
    errorSignupFail: "회원가입에 실패했어요. 다시 시도해주세요 😢",
    langBtn: "🇯🇵 日本語"
  },
  ja: {
    title: "新規登録",
    subtitle: "おこづかい管理を始める",
    placeholderId: "ユーザーID",
    placeholderPw: "パスワード (6文字以上)",
    placeholderConfirmPw: "パスワードの確認",
    btnSignup: "新規登録",
    btnLoading: "登録中...",
    hasAccount: "すでにアカウントをお持ちですか？",
    btnLogin: "ログイン",
    successTitle: "登録完了！",
    successDesc: "アカウントが正常に作成されました。 🎉",
    btnGoLogin: "ログイン画面へ",
    errorPasswordMatch: "パスワードが一致しません 🔑",
    errorPasswordLength: "パスワードは6文字以上で入力してください",
    errorSignupFail: "登録に失敗しました。もう一度お試しください 😢",
    langBtn: "🇰🇷 한국어"
  }
};

export default function SignupPage() {
  const router = useRouter();
  const supabase = createClient();

  // 🌐 언어 상태 추가 (기본값: 한국어)
  const [lang, setLang] = useState<'ko' | 'ja'>('ko');
  const t = translations[lang];

  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const toggleLanguage = () => {
    setLang((prev) => (prev === 'ko' ? 'ja' : 'ko'));
  };

  // app/signup/page.tsx 파일 내의 handleSignup 함수를 아래 내용으로 교체해 주세요.

const handleSignup = async (e: React.FormEvent) => {
  e.preventDefault();
  setError(null);

  if (password !== confirmPassword) {
    setError(t.errorPasswordMatch);
    return;
  }
  if (password.length < 6) {
    setError(t.errorPasswordLength);
    return;
  }

  setIsLoading(true);

  // 1️⃣ Supabase 내장 인증 시스템에 유저 등록 (비밀번호는 암호화되어 안전하게 보관됨)
  const emailFormatId = id.includes("@") ? id : `${id}@internal.com`;
  
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: emailFormatId,
    password: password,
  });

  if (authError || !authData.user) {
    console.error("Auth Signup Error:", authError?.message);
    setError(t.errorSignupFail);
    setIsLoading(false);
    return;
  }

  // 2️⃣ 회원가입 성공 직후, 내 데이터베이스인 'profiles' 테이블에 유저 정보 연동 저장!
  const { error: dbError } = await supabase
    .from("profiles")
    .insert([
      {
        id: authData.user.id,     // 고유 UUID 연동 (Supabase Auth와 profiles 테이블을 이어주는 핵심 고리!)
        login_id: id,            // 입력한 실제 아이디 (예: chiba87)
        name: id,                // 초기 이름은 아이디로 지정
        role: "user",            // 기본 역할 기본값 지정
        balance: 0               // 초기 용돈 잔액 0원/0엔 시작
        // ⚠️ password 컬럼은 보관하지 않는 것이 안전하므로 제외하거나 NULL 상태로 둡니다.
      }
    ]);

  if (dbError) {
    console.error("Database Profiles Insert Error:", dbError.message);
    setError("계정 정보 생성 중 오류가 발생했습니다. 😢");
    setIsLoading(false);
    return;
  }

  setSuccess(true);
  setIsLoading(false);
};

  // 🎉 회원가입 성공 화면 (다국어 완벽 연동)
  if (success) {
    return (
      <main
        className="min-h-screen w-full flex items-center justify-center"
        style={{ background: "linear-gradient(160deg, #FFF8ED 0%, #FFE0B2 100%)" }}
      >
        <div className="w-full max-w-sm px-6 py-10 flex flex-col items-center text-center">
          <span className="text-6xl mb-4">🎉</span>
          <h2
            className="text-2xl font-extrabold mb-2"
            style={{ fontFamily: "var(--font-display)", color: "#E65100" }}
          >
            {t.successTitle}
          </h2>
          <p className="text-sm mb-6" style={{ color: "#8D6E63" }}>
            {t.successDesc}
          </p>
          <a
            href="/login"
            className="px-8 py-3 rounded-2xl text-base font-bold text-white transition-all active:scale-95 shadow-md"
            style={{
              background: "linear-gradient(135deg, #FF7043 0%, #FF5722 100%)",
              boxShadow: "0 6px 20px rgba(255, 87, 34, 0.35)",
            }}
          >
            {t.btnGoLogin}
          </a>
        </div>
      </main>
    );
  }

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
        <span className="text-5xl mb-3">🐷</span>
        <h1
          className="text-2xl font-extrabold text-center mb-1"
          style={{ fontFamily: "var(--font-display)", color: "#E65100" }}
        >
          {t.title}
        </h1>
        <p className="text-sm mb-8 text-center font-semibold" style={{ color: "#FF8A65" }}>
          {t.subtitle}
        </p>

        {error && (
          <div
            className="w-full mb-4 px-4 py-3 rounded-2xl text-sm font-semibold text-center"
            style={{ background: "#FFF0F0", color: "#D32F2F", border: "1.5px solid #FFCDD2" }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSignup} className="w-full flex flex-col gap-4">
          {/* 아이디 입력창 */}
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg select-none">📧</span>
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

          {/* 비밀번호 확인 입력창 */}
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg select-none">🔑</span>
            <input
              type="password"
              placeholder={t.placeholderConfirmPw}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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

          {/* 회원가입 버튼 */}
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
            {isLoading ? t.btnLoading : t.btnSignup}
          </button>
        </form>

        {/* 하단 로그인 유도 */}
        <div className="mt-6 flex items-center gap-2">
          <span className="text-sm" style={{ color: "#BCAAA4" }}>
            {t.hasAccount}
          </span>
          <a
            href="/login"
            className="text-sm font-bold underline underline-offset-2 transition-colors duration-150"
            style={{ color: "#FF7043" }}
          >
            {t.btnLogin}
          </a>
        </div>
      </div>
    </main>
  );
}