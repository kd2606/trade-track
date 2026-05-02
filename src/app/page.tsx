"use client";

import React from "react";
import { createClient } from "@/utils/supabase/client";

export default function LandingPage() {
  const supabase = createClient();

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

  const handleMicrosoftLogin = async () => {
    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL ||
      (typeof window !== 'undefined' ? window.location.origin : '');

    await supabase.auth.signInWithOAuth({
      provider: 'azure',
      options: {
        redirectTo: `${siteUrl}/auth/callback`,
      },
    })
  };

  return (
    <div className="min-h-screen bg-surface font-body-md text-on-surface flex items-center justify-center relative overflow-hidden">
      {/* Background Abstract Layer */}
      <div className="absolute inset-0 z-0">
        <div className="w-full h-full bg-gradient-to-tr from-surface via-transparent to-primary/5"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/20 via-transparent to-emerald-50/20"></div>
      </div>

      {/* Login Container */}
      <main className="relative z-10 w-full max-w-md px-6 py-12">
        <div className="glass-card border border-outline-variant/30 rounded-xl shadow-xl shadow-gray-900/5 p-8 animate-fade-in-up">
          {/* Brand Identity */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-12 h-12 bg-primary-container rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-primary/20">
              <span className="material-symbols-outlined text-white text-3xl">insights</span>
            </div>
            <h1 className="text-3xl font-bold text-on-surface tracking-tight mb-2">TradeTrack</h1>
            <p className="text-on-surface-variant">Log in to manage your enterprise operations</p>
          </div>

          {/* Login Form */}
          <form className="space-y-6">
            {/* Email Field */}
            <div className="floating-label-group">
              <input 
                className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-4 pt-4 pb-2 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all duration-200 peer" 
                id="email" 
                name="email" 
                placeholder=" " 
                required 
                type="email" 
              />
              <label className="floating-label" htmlFor="email">
                <span className="material-symbols-outlined text-lg">mail</span>
                Email Address
              </label>
            </div>

            {/* Password Field */}
            <div className="floating-label-group">
              <input 
                className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-4 pt-4 pb-2 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all duration-200 peer" 
                id="password" 
                name="password" 
                placeholder=" " 
                required 
                type="password" 
              />
              <label className="floating-label" htmlFor="password">
                <span className="material-symbols-outlined text-lg">lock</span>
                Password
              </label>
              <button 
                className="absolute right-4 top-4 text-on-surface-variant hover:text-primary transition-colors" 
                type="button"
              >
                <span className="material-symbols-outlined text-lg">visibility</span>
              </button>
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer group">
                <div className="relative flex items-center">
                  <input className="peer h-4 w-4 rounded border-outline-variant text-primary focus:ring-primary/20 transition-all" type="checkbox" />
                </div>
                <span className="text-on-surface-variant group-hover:text-on-surface transition-colors">Remember me</span>
              </label>
              <a className="text-primary hover:text-on-primary-fixed-variant transition-colors" href="#">Forgot Password?</a>
            </div>

            {/* Submit Button */}
            <button 
              className="w-full h-12 bg-primary hover:bg-on-primary-fixed-variant text-on-primary font-bold rounded-lg shadow-lg shadow-primary/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2" 
              type="submit"
            >
              Log In
              <span className="material-symbols-outlined text-lg">arrow_forward</span>
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-outline-variant"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase tracking-wider">
              <span className="bg-white/80 px-4 text-on-surface-variant backdrop-blur-sm">Or continue with</span>
            </div>
          </div>

          {/* Social Logins */}
          <div className="grid grid-cols-2 gap-3 mb-8">
            <button 
              onClick={handleGoogleLogin}
              className="flex items-center justify-center gap-2 h-11 bg-white border border-outline-variant rounded-lg hover:bg-surface-container transition-all active:scale-95 group"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span className="text-on-surface">Google</span>
            </button>
            
            <button 
              onClick={handleMicrosoftLogin}
              className="flex items-center justify-center gap-2 h-11 bg-white border border-outline-variant rounded-lg hover:bg-surface-container transition-all active:scale-95 group"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <rect x="2" y="2" width="9" height="9" fill="#F25022"/>
                <rect x="13" y="2" width="9" height="9" fill="#7FBA00"/>
                <rect x="2" y="13" width="9" height="9" fill="#00A4EF"/>
                <rect x="13" y="13" width="9" height="9" fill="#FFB900"/>
              </svg>
              <span className="text-on-surface">Microsoft</span>
            </button>
          </div>

          {/* Sign Up CTA */}
          <p className="text-center text-on-surface-variant">
            New to TradeTrack? 
            <a className="text-primary font-semibold hover:underline decoration-2 underline-offset-4 ml-1" href="#">Create an account</a>
          </p>
        </div>

        {/* Footer Links */}
        <footer className="mt-8 flex justify-center gap-6 text-xs text-on-surface-variant">
          <a className="hover:text-primary transition-colors" href="#">Privacy Policy</a>
          <a className="hover:text-primary transition-colors" href="#">Terms of Service</a>
          <a className="hover:text-primary transition-colors" href="#">Contact Support</a>
        </footer>
      </main>
    </div>
  );
}
