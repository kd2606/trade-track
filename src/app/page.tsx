"use client";

import React from "react";
import { Store, TrendingUp, Wallet, History, Eye } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const supabase = createClient();
  const router = useRouter();

  const handleGoogleLogin = async () => {
    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL ||
      (typeof window !== 'undefined' ? window.location.origin : '');

    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${siteUrl}/auth/callback`,
      },
    })
  };

  const handleDemoLogin = async () => {
    // Navigate directly to demo route
    router.push('/demo');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50 flex items-center justify-center p-6 font-sans">
      <div className="max-w-5xl mx-auto w-full grid md:grid-cols-2 gap-8 items-center">
        {/* Left Section (Hero/Information) */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center shadow-sm text-white">
              <Store size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 leading-tight">TradeTrack</h1>
              <p className="text-sm font-medium text-slate-500">Your business, in numbers.</p>
            </div>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight text-slate-900">
            Track daily sales, expenses & <span className="text-emerald-600">profit</span> in real time.
          </h2>
          
          <p className="text-lg text-slate-600">
            A clean, minimal dashboard built for shopkeepers and small business owners. Add a sale and instantly see your profit update — no spreadsheets, no stress.
          </p>
          
          <ul className="space-y-4 pt-2">
            <li className="flex items-center gap-3">
              <TrendingUp className="text-emerald-600 w-6 h-6 shrink-0" />
              <span className="text-slate-700 font-medium text-lg">Live profit / loss at a glance</span>
            </li>
            <li className="flex items-center gap-3">
              <Wallet className="text-blue-600 w-6 h-6 shrink-0" />
              <span className="text-slate-700 font-medium text-lg">Categorised expense tracking</span>
            </li>
            <li className="flex items-center gap-3">
              <History className="text-amber-600 w-6 h-6 shrink-0" />
              <span className="text-slate-700 font-medium text-lg">Searchable transaction history</span>
            </li>
          </ul>
        </div>

        {/* Right Section (Login Card) */}
        <div className="w-full max-w-md mx-auto md:ml-auto">
          <div className="rounded-xl border border-slate-200 bg-white shadow-xl p-8">
            <h3 className="text-2xl font-bold text-slate-900 mb-2 text-center">Welcome to TradeTrack</h3>
            <p className="text-slate-600 mb-6 text-center">Choose how you'd like to explore the platform</p>
            
            <div className="space-y-4">
              <button 
                onClick={handleGoogleLogin}
                className="w-full flex items-center justify-center gap-3 bg-white border border-slate-300 rounded-lg py-3 px-4 shadow-sm hover:bg-slate-50 transition-colors focus:ring-2 focus:ring-emerald-500 outline-none"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                <span className="font-medium text-slate-700">Continue with Google</span>
              </button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-300"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-white px-2 text-slate-500">OR</span>
                </div>
              </div>

              <button 
                onClick={handleDemoLogin}
                className="w-full flex items-center justify-center gap-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg py-3 px-4 shadow-sm transition-colors focus:ring-2 focus:ring-emerald-500 outline-none"
              >
                <Eye className="w-5 h-5" />
                <span className="font-medium">Try Demo Account</span>
              </button>
            </div>
            
            <p className="text-xs text-slate-400 mt-6 text-center">
              Google account required for data persistence • Demo mode shows sample data
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
