import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return (
    <main
      className="min-h-screen w-full flex items-center justify-center"
      style={{ background: "linear-gradient(160deg, #FFF8ED 0%, #FFE0B2 100%)" }}
    >
      <div className="text-center">
        <span className="text-6xl">🐷</span>
        <h1 className="text-2xl font-extrabold mt-4" style={{ color: "#E65100" }}>
          대시보드 준비 중...
        </h1>
        <p className="text-sm mt-2" style={{ color: "#8D6E63" }}>
          {user.email} 님 환영해요!
        </p>
      </div>
    </main>
  );
}
