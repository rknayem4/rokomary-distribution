"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Building2,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { authClient } from "@/app/lib/auth-client";
import Link from "next/link";

const LoginPage = () => {
  const router = useRouter();

  // State Management
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"retailer" | "staff">("retailer");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Handle Form Submission using Better Auth
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    try {
      // Sign in using Better Auth Email/Password provider
      const { data, error } = await authClient.signIn.email({
        email,
        password,
        dontRememberMe: !rememberMe, // Better Auth uses dontRememberMe boolean flag
      });

      if (error) {
        setErrorMessage(
          error.message || "Invalid email or password. Please try again.",
        );
      } else if (data) {
        // Redirect based on selected role
        if (role === "staff") {
          router.push("/admin");
        } else {
          router.push("/");
        }
        router.refresh();
      }
    } catch (err: any) {
      setErrorMessage(
        "An unexpected server error occurred. Please try again later.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full mb-10 pb-10 bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Background Decorator Gradients */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-5xl bg-white dark:bg-slate-900 rounded-2xl shadow-xl overflow-hidden border border-slate-200 dark:border-slate-800 grid grid-cols-1 lg:grid-cols-12 relative z-10">
        {/* Left Side: Branding & Marketing Section */}
        <div className="lg:col-span-5 bg-gradient-to-br from-blue-600 via-indigo-600 to-indigo-800 p-8 lg:p-12 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10 backdrop-blur-[2px]" />

          <div className="relative z-10">
            {/* Company Logo */}
            <div className="flex justify-center">
              <Link href="/">
                <img
                  src="/assats/rokomary-distribution.svg"
                  alt="Rokomary Distribution"
                  className="max-w-50 p-2"
                />
              </Link>
            </div>

            <div className="mt-8 space-y-4">
              <h1 className="text-2xl lg:text-3xl font-extrabold leading-tight">
                Sign in to your distribution account
              </h1>
              <p className="text-blue-100 text-sm leading-relaxed">
                Effortlessly track stock levels, place new orders, and manage
                invoices all in one place.
              </p>
            </div>
          </div>

          {/* Feature List */}
          <div className="relative z-10 my-8 space-y-3">
            <div className="flex items-center gap-3 text-sm text-blue-50">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>Real-time stock updates & pricing</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-blue-50">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>Instant order confirmation</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-blue-50">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>Better Auth session management</span>
            </div>
          </div>

          {/* Footer Info */}
          <div className="relative z-10 pt-6 border-t border-white/20 text-xs text-blue-200">
            Need assistance? Contact us at:{" "}
            <span className="text-white font-medium">
              support@distrohub.com
            </span>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-center">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
              Welcome back 👋
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
              Please enter your account details to log in.
            </p>
          </div>

          {/* Account Role Selector */}
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl mb-6">
            <button
              type="button"
              onClick={() => setRole("retailer")}
              className={`flex-1 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all ${
                role === "retailer"
                  ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
              }`}
            >
              Retailer / Client
            </button>
          </div>

          {/* Error Alert */}
          {errorMessage && (
            <div className="mb-6 p-3.5 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/60 rounded-xl flex items-center gap-3 text-red-600 dark:text-red-400 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-slate-800 text-sm transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  Password
                </label>
                <a
                  href="/forgot-password"
                  className="text-xs text-blue-600 hover:underline dark:text-blue-400 font-medium"
                >
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <Lock className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-11 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-slate-800 text-sm transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between py-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                <span className="text-xs text-slate-600 dark:text-slate-400">
                  Remember me
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium text-sm rounded-xl shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Registration Hint */}
          <div className="mt-8 text-center text-xs text-slate-500 dark:text-slate-400">
            New retailer?{" "}
            <a
              href="/auth/register"
              className="text-blue-600 dark:text-blue-400 font-semibold hover:underline"
            >
              Apply for an account here
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
