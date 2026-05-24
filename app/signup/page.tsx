"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useLanguage } from "../LanguageContext"; // 💡 훅 가져오기

type Role = "parent" | "child" | null;

// 🌐 회원가입용 다국어 사전
const translations = {
  ko: {
    title: "회원가입",
    subtitle: "가족 용돈 관리 시작하기",
    labelId: "ID",
    placeholderId: "이메일 주소 또는 아이디",
    labelPw: "Password",
    placeholderPw: "비밀번호 (6자 이상)",
    labelConfirmPw: "Password 확인",
    placeholderConfirmPw: "비밀번호 재입력",
    labelName: "이름",
    placeholderName: "이름을 입력해주세요",
    labelGroup: "그룹이름",
    placeholderGroup: "예) 김씨 가족",
    labelRole: "역할",
    roleParent: "부모",
    roleChild: "아이",
    btnBack: "돌아가기",
    btnSubmit: "등록하기",
    btnLoading: "처리 중...",
    successTitle: "가입 완료!",
    successDesc: "님, 용돈 관리를 시작해봐요",
    btnGoLogin: "로그인하러 가기",
    errorPwMatch: "비밀번호가 일치하지 않아요 🔑",
    errorPwLength: "비밀번호는 6자 이상이어야 해요",
    errorRole: "역할을 선택해주세요",
    errorSignupFail: "회원가입에 실패했습니다. 다시 시도해 주세요.",
    langBtn: "🇯🇵 日本語"
  },
  ja: {
    title: "新規登録",
    subtitle: "家族のおこづかい管理を始める",
    labelId: "ユーザーID",
    placeholderId: "メールアドレスまたはID",
    labelPw: "パスワード",
    placeholderPw: "パスワード (6文字以上)",
    labelConfirmPw: "パスワードの確認",
    placeholderConfirmPw: "パスワードの再入力",
    labelName: "お名前",
    placeholderName: "名前を入力してください",
    labelGroup: "グループ名",
    placeholderGroup: "例) 田中家のおこづかい",
    labelRole: "役割",
    roleParent: "保護者",
    roleChild: "子ども",
    btnBack: "戻る",
    btnSubmit: "登録する",
    btnLoading: "処理中...",
    successTitle: "登録完了！",
    successDesc: "さん、おこづかい管理を始めましょう",
    btnGoLogin: "ログイン画面へ",
    errorPwMatch: "パスワードが一致しません 🔑",
    errorPwLength: "パスワードは6文字以上で入力してください",
    errorRole: "役割を選択してください",
    errorSignupFail: "登録に失敗しました。もう一度お試しください。",
    langBtn: "🇰🇷 한국어"
  }
};

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

export default function SignupPage() {
  const router = useRouter();
  const supabase = createClient();

  // 🌐 언어 상태 추가
  const { lang, toggleLanguage } = useLanguage();
  const t = translations[lang];

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [groupName, setGroupName] = useState("");
  const [role, setRole] = useState<Role>(null);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError(t.errorPwMatch);
      return;
    }
    if (password.length < 6) {
      setError(t.errorPwLength);
      return;
    }
    if (!role) {
      setError(t.errorRole);
      return;
    }

    setIsLoading(true);

    // 💡 Supabase Auth 시스템 연동 및 가상 도메인 처리
    const emailFormatId = email.includes("@") ? email : `${email}@internal.com`;

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: emailFormatId,
      password: password,
    });

    // 🛠️ 안전장치 강화: authError가 있거나 user가 없을 때 처리
    if (authError || !authData?.user) {
      // authError가 없을 때를 대비해 옵셔널 체이닝(?.)과 기본 메시지 처리
      console.error("Auth Error Detail:", authError ? authError.message : "No user data returned");
      
      // 사용자 화면에 구체적인 힌트 제공
      setError(authError ? authError.message : "회원가입 승인이 거절되었습니다. Supabase 이메일 인증 설정을 확인해주세요.");
      setIsLoading(false);
      return;
    }

    // 💡 profiles 테이블에 확장 필드 연동 찔러넣기!
    const { error: dbError } = await supabase
      .from("profiles")
      .insert([
        {
          id: authData.user.id,     // 고유 UUID 연동 연결고리
          login_id: email,          // 사용자가 입력한 아이디 원래모습
          name: name,               // 유저 실명 정보
          group_name: groupName,    // 새로 추가한 그룹이름 정보
          role: role,               // parent 또는 child 역할 정보
          balance: 0,               // 잔액 초기화
        }
      ]);

    if (dbError) {
      console.error("DB Error:", dbError.message);
      setError("프로필 데이터를 생성하는 도중 문제가 생겼습니다. 😢");
      setIsLoading(false);
      return;
    }

    setIsLoading(false);
    setSuccess(true);
  };

  if (success) {
    return (
      <main
        className="min-h-screen w-full flex items-center justify-center"
        style={{ background: "linear-gradient(160deg, #FFF8ED 0%, #FFE0B2 100%)" }}
      >
        <div className="w-full max-w-sm px-6 py-16 flex flex-col items-center text-center">
          <span className="text-7xl mb-4">🎉</span>
          <h2
            className="text-2xl font-extrabold mb-2"
            style={{ fontFamily: "var(--font-display)", color: "#E65100" }}
          >
            {t.successTitle}
          </h2>
          <p className="text-sm mb-8" style={{ color: "#8D6E63" }}>
            {name}{t.successDesc}
          </p>
          <button
            onClick={() => router.push("/login")}
            className="px-10 py-4 rounded-2xl text-base font-bold text-white transition-all duration-200 active:scale-95"
            style={{
              background: "linear-gradient(135deg, #FF7043 0%, #FF5722 100%)",
              fontFamily: "var(--font-display)",
              boxShadow: "0 6px 20px rgba(255, 87, 34, 0.35)",
            }}
          >
            {t.btnGoLogin}
          </button>
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
      {/* 🌐 언어 토글 버튼 (누르면 전역 저장) */}
      <div className="absolute top-6 right-6 z-10">
        <button onClick={toggleLanguage} className="..." style={{ color: "#E65100" }}>
          {t.langBtn}
        </button>
      </div>

      <div className="w-full max-w-sm px-6 py-8 flex flex-col items-center">
        <div className="flex items-center gap-2 mb-1 w-full justify-center">
          <span className="text-3xl">🐷</span>
          <h1
            className="text-2xl font-extrabold tracking-tight"
            style={{ fontFamily: "var(--font-display)", color: "#E65100" }}
          >
            {t.title}
          </h1>
        </div>
        <p className="text-sm mb-7 text-center font-semibold" style={{ color: "#FF8A65" }}>
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

        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-3">
          <div>
            <label className="text-xs font-bold mb-1 block" style={{ color: "#FF7043" }}>{t.labelId}</label>
            <InputField icon="👤" placeholder={t.placeholderId} value={email} onChange={setEmail} />
          </div>

          <div>
            <label className="text-xs font-bold mb-1 block" style={{ color: "#FF7043" }}>{t.labelPw}</label>
            <InputField icon="🔒" type="password" placeholder={t.placeholderPw} value={password} onChange={setPassword} />
          </div>

          <div>
            <label className="text-xs font-bold mb-1 block" style={{ color: "#FF7043" }}>{t.labelConfirmPw}</label>
            <InputField icon="🔑" type="password" placeholder={t.placeholderConfirmPw} value={confirmPassword} onChange={setConfirmPassword} />
          </div>

          <div>
            <label className="text-xs font-bold mb-1 block" style={{ color: "#FF7043" }}>{t.labelName}</label>
            <InputField icon="✏️" placeholder={t.placeholderName} value={name} onChange={setName} />
          </div>

          <div>
            <label className="text-xs font-bold mb-1 block" style={{ color: "#FF7043" }}>{t.labelGroup}</label>
            <InputField icon="👨‍👩‍👧" placeholder={t.placeholderGroup} value={groupName} onChange={setGroupName} />
          </div>

          <div>
            <label className="text-xs font-bold mb-2 block" style={{ color: "#FF7043" }}>{t.labelRole}</label>
            <div className="flex gap-4">
              {(["parent", "child"] as Role[]).map((r) => {
                const label = r === "parent" ? t.roleParent : t.roleChild;
                const emoji = r === "parent" ? "👨‍👩‍👧" : "🧒";
                const selected = role === r;
                return (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className="flex-1 flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 font-bold text-sm"
                    style={{
                      background: selected
                        ? "linear-gradient(135deg, #FF7043 0%, #FF5722 100%)"
                        : "#ffffff",
                      color: selected ? "#ffffff" : "#8D6E63",
                      border: selected ? "2px solid transparent" : "2px solid #FFE0B2",
                      boxShadow: selected
                        ? "0 4px 16px rgba(255, 87, 34, 0.3)"
                        : "0 2px 8px rgba(255, 112, 67, 0.08)",
                      fontFamily: "var(--font-body)",
                    }}
                  >
                    <span className="text-xl">{emoji}</span>
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex gap-3 mt-3">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 py-4 rounded-2xl text-base font-bold text-white transition-all duration-200 active:scale-95"
              style={{
                background: isLoading ? "#FFAB91" : "linear-gradient(135deg, #FF7043 0%, #FF5722 100%)",
                fontFamily: "var(--font-display)",
                boxShadow: isLoading ? "none" : "0 6px 20px rgba(255, 87, 34, 0.35)",
                cursor: isLoading ? "not-allowed" : "pointer",
              }}
            >
              {isLoading ? t.btnLoading : t.btnSubmit}
            </button>
            <button
              type="button"
              onClick={() => router.push("/login")}
              className="flex-1 py-4 rounded-2xl text-base font-bold transition-all duration-200 active:scale-95"
              style={{
                background: "#ffffff",
                border: "2px solid #FFE0B2",
                color: "#FF7043",
                fontFamily: "var(--font-display)",
                boxShadow: "0 2px 8px rgba(255, 112, 67, 0.08)",
              }}
            >
              {t.btnBack}
            </button>
            
          </div>
        </form>
      </div>
    </main>
  );
}