"use client";

import React from "react";
import { PackageCheck } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen w-full bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decorator Gradients */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/3 left-1/3 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center">
        {/* Brand Logo or Icon Container */}
        <div className="relative mb-8">
          {/* Outer Pulsing Glow */}
          <div className="absolute inset-0 bg-indigo-500/20 rounded-2xl blur-xl animate-pulse" />

          {/* Animated Spinner Ring Around Logo */}
          <div className="relative p-5 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex items-center justify-center">
            <PackageCheck className="w-10 h-10 text-indigo-400 animate-bounce" />
            
            {/* Spinning Ring */}
            <div className="absolute -inset-1.5 rounded-3xl border-2 border-transparent border-t-indigo-500 border-r-indigo-500/30 animate-spin" />
          </div>
        </div>

        {/* Brand Name */}
        <h2 className="text-lg font-bold text-white tracking-wide mb-1">
          Rokomary Distribution
        </h2>

        {/* Loading Message */}
        <p className="text-xs text-slate-400 font-medium animate-pulse mb-6">
          Fetching distribution data, please wait...
        </p>

        {/* Minimal Progress Bar */}
        <div className="w-48 h-1 bg-slate-800 rounded-full overflow-hidden relative">
          <div className="h-full bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full w-1/2 animate-[loadingBar_1.5s_infinite_ease-in-out]" />
        </div>
      </div>
    </div>
  );
}