"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FileQuestion,
  Home,
  ArrowLeft,
  RefreshCw,
  Building2,
  HelpCircle,
} from "lucide-react";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen w-full bg-slate-950 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      {/* Background Decorator Gradients */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-xl text-center relative z-10 my-auto">
        
        {/* Brand Logo */}
        <div className="flex justify-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <img
              src="/assats/rokomary-distribution2.svg"
              alt="Rokomary Distribution Logo"
              className="h-9 w-auto object-contain"
            />
          </Link>
        </div>

        {/* 404 Badge & Visual Icon */}
        <div className="relative inline-flex items-center justify-center mb-6">
          <div className="absolute inset-0 bg-indigo-500/20 rounded-full blur-2xl animate-pulse" />
          <div className="relative p-6 bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl">
            <FileQuestion className="w-16 h-16 text-indigo-400" />
          </div>
        </div>

        {/* Error Code & Message */}
        <span className="inline-block px-3 py-1 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-bold rounded-full uppercase tracking-widest mb-3">
          Error 404
        </span>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">
          Page Not Found
        </h1>

        <p className="text-slate-400 text-sm leading-relaxed max-w-md mx-auto mb-8">
          Oops! The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
          <button
            onClick={() => router.back()}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 text-xs font-semibold shadow-md flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95"
          >
            <ArrowLeft className="w-4 h-4 text-slate-400" />
            <span>Go Back</span>
          </button>

          <Link
            href="/"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95"
          >
            <Home className="w-4 h-4" />
            <span>Return Home</span>
          </Link>
        </div>

        {/* Support Help Link */}
        <div className="mt-12 pt-6 border-t border-slate-800/60 flex items-center justify-center gap-2 text-xs text-slate-500">
          <HelpCircle className="w-4 h-4 text-slate-400" />
          <span>Need help?</span>
          <a
            href="mailto:support@rokomary.com"
            className="text-indigo-400 font-medium hover:underline"
          >
            Contact Support
          </a>
        </div>

      </div>
    </div>
  );
}