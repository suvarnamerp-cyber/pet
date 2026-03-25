"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Heart } from "lucide-react";
import toast from "react-hot-toast";
import { login, signup } from "@/lib/api";
import { setSession } from "@/lib/auth-session";
import type { AuthFormState } from "@/lib/types";

export default function AuthCard() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup">("signup");
  const [form, setForm] = useState<AuthFormState>({
    userName: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const message = await signup(form);
        toast.success(message || "Account created");
        setMode("login");
      } else {
        const session = await login(form);
        setSession(session);
        toast.success(`Welcome ${session.userName}`);
        router.push("/dashboard");
      }
    } catch {
      toast.error("Authentication failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-xl rounded-2xl bg-white/90 p-4 shadow-soft">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold uppercase tracking-wide text-brand-500">Pet owner access</p>
        <div className="flex items-center gap-1 rounded-full bg-brand-100 px-3 py-2 text-sm font-medium text-brand-700">
          <Heart size={16} />
          Secure tags
        </div>
      </div>

      <h2 className="text-3xl font-semibold text-ink-900">Welcome back</h2>

      <div className="relative mb-6 mt-4 grid grid-cols-2 gap-2 rounded-full bg-amber-100 p-1">
        <span
          className={`absolute bottom-1 left-1 top-1 w-[calc(50%-4px)] rounded-full bg-white shadow transition-transform duration-200 ease-out ${
            mode === "login" ? "translate-x-full" : "translate-x-0"
          }`}
        />

        <button
          type="button"
          className={`relative z-10 rounded-full px-4 py-2 text-sm font-semibold ${
            mode === "signup" ? "text-ink-900" : "text-ink-600"
          }`}
          onClick={() => setMode("signup")}
        >
          Sign up
        </button>

        <button
          type="button"
          className={`relative z-10 rounded-full px-4 py-2 text-sm font-semibold ${
            mode === "login" ? "text-ink-900" : "text-ink-600"
          }`}
          onClick={() => setMode("login")}
        >
          Log in
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block text-sm font-medium text-ink-700">
          User name
          <input
            required
            type="text"
            value={form.userName}
            onChange={(event) => setForm({ ...form, userName: event.target.value })}
            placeholder="Enter your user name"
            className="mt-2 w-full rounded-xl border border-amber-100 bg-white px-4 py-3 text-ink-900 focus:border-brand-400 focus:outline-none"
          />
        </label>

        <label className="block text-sm font-medium text-ink-700">
          Password
          <input
            required
            type="password"
            value={form.password}
            onChange={(event) => setForm({ ...form, password: event.target.value })}
            placeholder="Enter your password"
            className="mt-2 w-full rounded-xl border border-amber-100 bg-white px-4 py-3 text-ink-900 focus:border-brand-400 focus:outline-none"
          />
        </label>

        <div className="flex w-full justify-center">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 rounded-full border border-amber-200 bg-white px-5 py-3 text-sm font-semibold text-ink-700 hover:bg-amber-100"
          >
            {loading ? "Please wait..." : mode === "signup" ? "Create account" : "Enter dashboard"}
            <ArrowRight size={18} />
          </button>
        </div>
      </form>

      <p className="mt-6 text-sm text-ink-600">
        By continuing, you agree to share your pet details only with verified finders.
      </p>
    </div>
  );
}
