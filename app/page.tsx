// app/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../utils/supabase'

interface Transaction {
  id: string
  created_at: string
  amount: number
  description: string
  status: string
}

// 🌐 폼 전체와 화폐 단위까지 완벽하게 지원하는 다국어 사전
const translations = {
  ko: {
    title: "💰 우리 아이 용돈기입장",
    subtitle: "Next.js + Supabase 실시간 연동",
    formTitle: "새 내역 기록하기",
    labelAmount: "금액 (지출은 마이너스 '-' 입력)",
    placeholderAmount: "예: 5000 또는 -1500",
    labelDesc: "내용",
    placeholderDesc: "예: 할머니 용돈, 편의점 과자",
    btnSubmit: "기록하기",
    listTitle: "용돈 및 지출 내역",
    loading: "로딩 중...",
    empty: "아직 기록된 내역이 없습니다.",
    alertEmpty: "금액과 내용을 입력해주세요!",
    alertSuccess: "성공적으로 등록되었습니다! 🎉",
    alertFail: "등록 실패: ",
    unit: "원",                  // 한국어일 때는 '원'
    langBtn: "🇯🇵 日本語で見る"
  },
  ja: {
    title: "💰 おこづかい帳",
    subtitle: "Next.js + Supabase リアルタイム連動",
    formTitle: "新しい履歴を記録する",
    labelAmount: "金額 (支出はマイナス '-' を入力)",
    placeholderAmount: "例: 5000 または -1500",
    labelDesc: "内容",
    placeholderDesc: "例: おばあちゃんのお小遣い, コンビニのお菓子",
    btnSubmit: "記録する",
    listTitle: "入出金履歴",
    loading: "読み込み中...",
    empty: "まだ履歴がありません。",
    alertEmpty: "金額と内容を入力してください！",
    alertSuccess: "正常に登録されました！🎉",
    alertFail: "登録失敗: ",
    unit: "円",                  // 일본어일 때는 '엔(円)'
    langBtn: "🇰🇷 한국어로 보기"
  }
}

export default function Home() {
  const [lang, setLang] = useState<'ko' | 'ja'>('ko')
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [amount, setAmount] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(true)

  const t = translations[lang]

  const toggleLanguage = () => {
    setLang((prev) => (prev === 'ko' ? 'ja' : 'ko'))
  }

  async function fetchTransactions() {
    setLoading(true)
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error(error.message)
    } else if (data) {
      setTransactions(data)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchTransactions()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!amount || !description) return alert(t.alertEmpty)

    const { error } = await supabase
      .from('transactions')
      .insert([
        {
          amount: Number(amount),
          description: description,
          status: 'approved',
        }
      ])

    if (error) {
      alert(t.alertFail + error.message)
    } else {
      alert(t.alertSuccess)
      setAmount('')
      setDescription('')
      fetchTransactions()
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-12 bg-gray-50 text-gray-800">
      
      {/* 🌐 언어 변경 버튼 */}
      <div className="w-full max-w-md flex justify-end mb-4">
        <button
          onClick={toggleLanguage}
          className="bg-white px-4 py-2 rounded-full shadow-md text-xs font-semibold border border-gray-100 hover:bg-gray-100 transition active:scale-95"
        >
          {t.langBtn}
        </button>
      </div>

      <div className="max-w-md w-full space-y-8">
        
        {/* 헤더 전체 변경 */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">{t.title}</h1>
          <p className="text-gray-500 mt-2">{t.subtitle}</p>
        </div>

        {/* 폼 전체 변경 */}
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-sm space-y-4">
          <h2 className="text-lg font-semibold text-gray-700">{t.formTitle}</h2>
          
          <div>
            <label className="block text-xs text-gray-400 mb-1">{t.labelAmount}</label>
            <input
              type="number"
              placeholder={t.placeholderAmount}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1">{t.labelDesc}</label>
            <input
              type="text"
              placeholder={t.placeholderDesc}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium p-3 rounded-xl transition text-sm shadow-sm"
          >
            {t.btnSubmit}
          </button>
        </form>

        {/* 내역 리스트 및 화폐 단위 전체 변경 */}
        <div className="bg-white p-6 rounded-2xl shadow-sm space-y-4">
          <h2 className="text-lg font-semibold text-gray-700">{t.listTitle}</h2>

          {loading ? (
            <p className="text-center text-sm text-gray-400 py-4">{t.loading}</p>
          ) : transactions.length === 0 ? (
            <p className="text-center text-sm text-gray-400 py-4">{t.empty}</p>
          ) : (
            <div className="divide-y divide-gray-100 max-h-60 overflow-y-auto pr-1">
              {transactions.map((tx) => (
                <div key={tx.id} className="flex justify-between items-center py-3 text-sm">
                  <div>
                    <p className="font-medium text-gray-800">{tx.description}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(tx.created_at).toLocaleDateString(lang === 'ko' ? 'ko-KR' : 'ja-JP')}
                    </p>
                  </div>
                  {/* 💰 화폐 단위(t.unit)도 여기에서 유동적으로 바뀝니다! */}
                  <span className={`font-bold ${tx.amount > 0 ? 'text-green-600' : 'text-red-500'}`}>
                    {tx.amount > 0 ? `+${tx.amount.toLocaleString()}` : tx.amount.toLocaleString()}{t.unit}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </main>
  )
}