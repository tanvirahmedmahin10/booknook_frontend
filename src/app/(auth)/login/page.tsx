"use client";

import React, { useState } from "react";
import { Mail, Lock, Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";

export default function SignInForm() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);

  const rawCallbackUrl = searchParams.get("callbackUrl");
  const callbackUrl = rawCallbackUrl ? decodeURIComponent(rawCallbackUrl) : "/";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = String(formData.get("email"));
    const password = String(formData.get("password"));
    const rememberMe = formData.get("rememberMe") === "on";

    const { data, error } = await authClient.signIn.email({
      email,
      password,
      rememberMe,
    });

    if (error) {
      setLoading(false);
      toast.error(error.message || "Failed to log in");
      return;
    }

    toast.success("Successfully logged in!");

    // Hard redirect guarantees the browser commits the session cookie before hitting the protected route
    window.location.href = callbackUrl;
  };

  const handleGoogleSignIn = async () => {
    const { error } = await authClient.signIn.social({
      provider: "google",
      callbackURL: callbackUrl,
    });
    if (error) toast.error(error.message || "Failed to sign in with Google");
  };

  return (
    <div className="min-h-[calc(100vh-6rem)] bg-slate-50/50 flex flex-col items-center justify-center p-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
          Welcome Back
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Resume your adventure with BookNook
        </p>
      </div>

      <div className="w-full max-w-md bg-white rounded-xl border border-slate-200/80 shadow-sm p-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-900 block">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                name="email"
                required
                placeholder="Enter your email"
                className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-900 block">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                name="password"
                required
                placeholder="Enter your password"
                className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="rememberMe"
                className="w-4 h-4 rounded border-slate-300 text-cyan-600 focus:ring-cyan-600"
              />
              <span className="text-slate-600">Remember me</span>
            </label>
            <Link
              href="/forgot-password"
              className="text-cyan-600 hover:underline font-medium"
            >
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-2.5 px-4 bg-cyan-600 hover:bg-cyan-700 text-white font-medium text-sm rounded-lg transition-colors shadow-sm disabled:opacity-50 flex items-center justify-center"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Login"}
          </button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-3 text-slate-400">
                Or continue with
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-medium text-sm rounded-lg transition-colors shadow-sm"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c-.07-.66-.63-1.17-1.3-1.17H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-8.88 0-.64-.06-1.27-.19-1.89z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.15-4.05 1.15-3.12 0-5.77-2.11-6.72-4.95H1.2v3.15C3.16 21.36 7.24 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.24c-.24-.72-.38-1.5-.38-2.24s.14-1.52.38-2.24V6.61H1.2C.44 8.14 0 9.87 0 12s.44 3.86 1.2 5.39l4.08-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.76 0 3.34.61 4.59 1.8l3.43-3.43C17.95 1.19 15.24 0 12 0 7.24 0 3.16 2.64 1.2 6.61l4.08 3.15c.95-2.84 3.6-4.95 6.72-4.95z"
              />
            </svg>
            Login With Google
          </button>

          <p className="text-center mt-6 text-sm text-slate-500">
            Don&apos;t have an account?{" "}
            <Link
              href={`/register${callbackUrl !== "/" ? `?callbackUrl=${encodeURIComponent(callbackUrl)}` : ""}`}
              className="text-cyan-600 hover:underline font-medium"
            >
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}