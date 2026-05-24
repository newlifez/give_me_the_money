import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  // 1️⃣ 서버 클라이언트를 생성하여 현재 로그인한 유저 정보 안전하게 가져오기
  const supabaseServer = await createClient();
  const { data: { user } } = await supabaseServer.auth.getUser();

  // 로그인 안 되어 있으면 로그인 페이지로 즉시 튕겨내기
  if (!user) redirect("/login");

  // 이메일 주소에서 @ 앞부분만 따서 아이디처럼 보여주기
  const displayId = user.email?.split("@")[0] || "유저";

  // 2️⃣ 로그아웃을 처리해줄 서버 액션 함수 정의
  const handleSignOut = async () => {
    "use server"; // 버튼 클릭 시 서버 측에서 안전하게 실행되도록 선언
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect("/login");
  };

  return (
    <main
      className="min-h-screen w-full flex flex-col items-center justify-center p-6"
      style={{
        background: "linear-gradient(160deg, #FFF8ED 0%, #FFE0B2 100%)",
        fontFamily: "var(--font-body)",
      }}
    >
      <div 
        className="w-full max-w-sm bg-white/60 backdrop-blur-md rounded-3xl p-8 flex flex-col items-center text-center shadow-xl border border-orange-100/50"
        style={{ boxShadow: "0 10px 32px rgba(255, 112, 67, 0.08)" }}
      >
        <span className="text-6xl animate-bounce duration-1000">🐷</span>
        
        <h1 
          className="text-2xl font-extrabold mt-4 tracking-tight" 
          style={{ fontFamily: "var(--font-display)", color: "#E65100" }}
        >
          대시보드 준비 중...
        </h1>
        
        <p className="text-sm mt-2 font-medium" style={{ color: "#8D6E63" }}>
          <span className="font-bold text-orange-600">{displayId}</span> 님 환영해요!
        </p>

        {/* 🏃‍♂️ 로그아웃 폼 액션 연동 */}
        <form action={handleSignOut} className="w-full mt-8">
          <button
            type="submit"
            className="w-full py-3 rounded-2xl text-sm font-bold border-2 transition-all duration-200 active:scale-95 hover:bg-orange-50"
            style={{
              background: "#ffffff",
              borderColor: "#FFE0B2",
              color: "#FF7043",
              fontFamily: "var(--font-display)",
              boxShadow: "0 2px 8px rgba(255, 112, 67, 0.05)",
              cursor: "pointer"
            }}
          >
            로그아웃 🏃‍♂️
          </button>
        </form>
      </div>
    </main>
  );
}