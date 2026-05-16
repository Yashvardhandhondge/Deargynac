"use client";

import { useState, useEffect, Suspense, type FormEvent } from "react";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ChevronLeft,
  Shield,
  Lock,
  UserX,
  Loader2,
  Heart,
  ShieldCheck,
  Sparkles,
  UserPlus,
  LogIn,
  Eye,
  EyeOff,
  AlertTriangle,
} from "lucide-react";
import { useIsMobile } from "@/hooks/useWindowSize";

type AuthMode = "signin" | "signup";

const DEV_TEST_ACCOUNTS = [
  { label: "Admin", username: "admin", password: "DearGynac1" },
  { label: "Dr. Snehal (Doctor)", username: "drsnehal", password: "DearGynac1" },
  { label: "Dr. Kshitija (Radiologist)", username: "drkshitija", password: "DearGynac1" },
  { label: "Dr. Praveen (Doctor)", username: "drpraveen", password: "DearGynac1" },
  { label: "Priya (Patient)", username: "priya", password: "DearGynac1" },
];

function dashboardForRole(role: string): string {
  if (role === "doctor" || role === "radiologist") return "/doctor";
  if (role === "admin") return "/admin";
  return "/patient";
}

function safeCallbackForRole(
  role: string,
  callbackParam: string | null
): string | null {
  if (
    !callbackParam ||
    !callbackParam.startsWith("/") ||
    callbackParam.startsWith("//") ||
    callbackParam.includes("..")
  ) {
    return null;
  }
  if (role === "patient" && callbackParam.startsWith("/patient")) {
    return callbackParam;
  }
  if (
    (role === "doctor" || role === "radiologist") &&
    callbackParam.startsWith("/doctor")
  ) {
    return callbackParam;
  }
  if (role === "admin" && callbackParam.startsWith("/admin")) {
    return callbackParam;
  }
  return null;
}

function postAuthDestination(
  role: string,
  callbackParam: string | null
): string {
  const safe = safeCallbackForRole(role, callbackParam);
  if (safe) return safe;
  return dashboardForRole(role);
}

function LoginPageInner() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  const { data: session, status } = useSession();
  const isMobile = useIsMobile();

  const [authMode, setAuthMode] = useState<AuthMode>("signin");
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [anonLoading, setAnonLoading] = useState(false);
  const [error, setError] = useState("");
  const [showAnonModal, setShowAnonModal] = useState(false);

  useEffect(() => {
    if (status !== "authenticated" || !session?.user) return;
    const role = (session.user as { role?: string }).role ?? "patient";
    window.location.href = postAuthDestination(role, callbackUrl);
  }, [status, session, callbackUrl]);

  const switchMode = (mode: AuthMode) => {
    setAuthMode(mode);
    setError("");
    setPassword("");
    setConfirmPassword("");
    setShowPassword(false);
    if (mode === "signin") setName("");
  };

  const handleSignIn = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    const u = username.trim().toLowerCase();
    if (u.length < 3) {
      setError("Enter your username.");
      return;
    }
    if (!password) {
      setError("Enter your password.");
      return;
    }
    setLoading(true);
    try {
      const result = await signIn("credentials", {
        username: u,
        password,
        redirect: false,
      });
      if (result?.error || result?.ok === false) {
        setError("Invalid username or password.");
        return;
      }
      window.location.reload();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    const u = username.trim().toLowerCase();
    const n = name.trim();
    if (u.length < 3) {
      setError("Choose a username (at least 3 characters).");
      return;
    }
    if (n.length < 2) {
      setError("Enter your name.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: u, name: n, password }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        setError(json.message || "Could not create account.");
        return;
      }
      const result = await signIn("credentials", {
        username: u,
        password,
        redirect: false,
      });
      if (result?.error || result?.ok === false) {
        setError("Account created but sign-in failed. Try signing in.");
        setAuthMode("signin");
        return;
      }
      window.location.href = postAuthDestination("patient", callbackUrl);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAnonymousConfirm = async () => {
    setShowAnonModal(false);
    setAnonLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/anonymous", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        setError(json.message || "Failed to create anonymous profile");
        return;
      }
      const result = await signIn("credentials", {
        userId: json.userId,
        role: json.role,
        isAnonymous: "true",
        redirect: false,
      });
      if (result?.error || result?.ok === false) {
        setError("Authentication failed. Please try again.");
        return;
      }
      window.location.href = postAuthDestination("patient", callbackUrl);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setAnonLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-rose-100 px-4 py-3.5 text-sm outline-none focus:ring-2 focus:ring-[#D97894]/30 focus:border-[#D97894] bg-white shadow-sm";

  return (
    <>
      {showAnonModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="anon-modal-title"
        >
          <div className="w-full max-w-md rounded-2xl bg-white p-6 sm:p-8 shadow-xl border border-rose-100">
            <div className="flex items-center gap-3 text-amber-800 mb-4">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h2 id="anon-modal-title" className="font-serif font-bold text-lg text-[#3D3438]">
                Anonymous session
              </h2>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              You are an anonymous user. Once the data is cleared, you cannot recover your
              consultation history or access this account again. Continue only if you accept
              that risk.
            </p>
            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={() => setShowAnonModal(false)}
                className="flex-1 rounded-full border-2 border-rose-200 text-[#9B6B7A] py-2.5 font-semibold hover:bg-rose-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAnonymousConfirm}
                disabled={anonLoading}
                className="flex-1 rounded-full bg-[#D97894] text-white py-2.5 font-semibold hover:bg-[#C45F7E] disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {anonLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "I understand, continue"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="flex min-h-screen">
      <div
        className="hidden md:flex w-1/2 flex-col items-center justify-center p-12 relative text-white"
        style={{
          background:
            "linear-gradient(145deg, #F0C4D4 0%, #D97894 48%, #B84D6E 100%)",
        }}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 20%, white, transparent 45%),
              radial-gradient(circle at 80% 10%, #F5E4A8, transparent 40%),
              radial-gradient(circle at 50% 90%, #1A0A12, transparent 55%)`,
          }}
        />
        <div className="login-brand-panel max-w-md text-center relative z-[1]">
          <div className="flex items-baseline justify-center mb-8">
            <span className="font-serif font-bold text-3xl text-white">
              Dear
            </span>
            <span className="font-serif italic text-3xl text-rose-100">
              Gynac
            </span>
            <span className="text-[#F5E4A8] font-bold text-4xl leading-none">
              .
            </span>
          </div>

          <p className="text-white/90 text-lg mb-10 leading-relaxed">
            India&apos;s most trusted women&apos;s health platform
          </p>

          <div className="space-y-6 text-left">
            <div className="flex items-start gap-4 rounded-2xl bg-white/10 p-4 backdrop-blur-[2px]">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                <Shield className="w-5 h-5 text-[#1A0A12]" strokeWidth={2} />
              </div>
              <div>
                <h3 className="font-semibold text-white">100% Anonymous</h3>
                <p className="text-white/85 text-sm mt-1 leading-relaxed">
                  No real name required. Your identity stays completely private.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 rounded-2xl bg-white/10 p-4 backdrop-blur-[2px]">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5 text-[#1A0A12]" strokeWidth={2} />
              </div>
              <div>
                <h3 className="font-semibold text-white">NMC-Verified Doctors</h3>
                <p className="text-white/85 text-sm mt-1 leading-relaxed">
                  Every doctor is verified against the National Medical Commission
                  registry.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 rounded-2xl bg-white/10 p-4 backdrop-blur-[2px]">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                <Heart className="w-5 h-5 text-[#1A0A12]" strokeWidth={2} />
              </div>
              <div>
                <h3 className="font-semibold text-white">Compassionate Care</h3>
                <p className="text-white/85 text-sm mt-1 leading-relaxed">
                  Stigma-free, judgement-free support for every health concern.
                </p>
              </div>
            </div>
          </div>

          <p className="italic text-white/75 text-base mt-14">
            &ldquo;Your health story belongs to you.&rdquo;
          </p>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-[#FFF7F9] to-[#FCE8EE] px-4 py-8 sm:p-6">
        <div className="w-full max-w-md mb-4 rounded-2xl border border-amber-200/80 bg-gradient-to-br from-amber-50 to-orange-50/90 p-4 shadow-sm">
          <div className="flex items-center gap-2 text-amber-950 font-semibold text-sm mb-2">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
            Dev test accounts
          </div>
          <p className="text-xs text-amber-900/80 mb-3 leading-snug">
            Tap a row to fill username and password. All use password <span className="font-mono font-semibold">DearGynac1</span>.
          </p>
          <div className="flex flex-col gap-2">
            {DEV_TEST_ACCOUNTS.map((account) => (
              <button
                key={account.username}
                type="button"
                onClick={() => {
                  setUsername(account.username);
                  setPassword(account.password);
                  setAuthMode("signin");
                }}
                className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-amber-200 bg-white/90 px-3 py-2.5 text-left text-xs sm:text-sm text-[#1A0A12] hover:bg-amber-50/80 transition-colors min-h-[44px] w-full"
              >
                <span className="font-semibold">{account.label}</span>
                <span className="font-mono text-gray-500">{account.username}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="w-full max-w-md rounded-2xl bg-white/95 backdrop-blur-sm border border-rose-100/80 shadow-[0_24px_70px_-28px_rgba(61,52,56,0.35)] p-6 sm:p-9">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-[#D97894] transition-colors mb-5"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Home
          </Link>

          <div className="flex rounded-full bg-rose-50/90 p-1 border border-rose-100 mb-6">
            <button
              type="button"
              onClick={() => switchMode("signin")}
              className={`flex-1 flex items-center justify-center gap-2 rounded-full py-2.5 text-sm font-semibold transition-all ${
                authMode === "signin"
                  ? "bg-white text-[#D97894] shadow-sm"
                  : "text-gray-500 hover:text-[#3D3438]"
              }`}
            >
              <LogIn className="w-4 h-4" />
              Sign in
            </button>
            <button
              type="button"
              onClick={() => switchMode("signup")}
              className={`flex-1 flex items-center justify-center gap-2 rounded-full py-2.5 text-sm font-semibold transition-all ${
                authMode === "signup"
                  ? "bg-white text-[#D97894] shadow-sm"
                  : "text-gray-500 hover:text-[#3D3438]"
              }`}
            >
              <UserPlus className="w-4 h-4" />
              Sign up
            </button>
          </div>

          <h1 className="font-serif font-bold text-2xl text-[#3D3438] tracking-tight">
            {authMode === "signin" ? "Welcome back" : "Create your account"}
          </h1>
          <p className="text-gray-500 text-sm mt-2 leading-relaxed">
            {authMode === "signin"
              ? "Sign in with your username and password. Your session is secured with a JWT token."
              : "Choose a username, your name, and a password. No phone number required."}
          </p>

          <form
            className="mt-6 space-y-4"
            onSubmit={authMode === "signin" ? handleSignIn : handleSignUp}
          >
            <div>
              <label className="block text-sm font-medium text-[#3D3438] mb-1.5">Username</label>
              <input
                type="text"
                autoComplete="username"
                placeholder="e.g. ananya_c"
                value={username}
                onChange={(e) => setUsername(e.target.value.replace(/\s/g, ""))}
                className={inputClass}
              />
              <p className="text-xs text-gray-400 mt-1">3–30 characters: letters, numbers, underscore.</p>
            </div>

            {authMode === "signup" && (
              <div>
                <label className="block text-sm font-medium text-[#3D3438] mb-1.5">Your name</label>
                <input
                  type="text"
                  autoComplete="name"
                  placeholder="How should we address you?"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={inputClass}
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-[#3D3438] mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  autoComplete={authMode === "signin" ? "current-password" : "new-password"}
                  placeholder="At least 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`${inputClass} pr-12`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#D97894]"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {authMode === "signup" && (
              <div>
                <label className="block text-sm font-medium text-[#3D3438] mb-1.5">Confirm password</label>
                <input
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={inputClass}
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#D97894] text-white rounded-full py-3.5 font-semibold hover:bg-[#C45F7E] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md shadow-rose-300/40"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Please wait…
                </>
              ) : authMode === "signin" ? (
                "Sign in"
              ) : (
                "Create account"
              )}
            </button>
          </form>

          {error && (
            <p className="text-red-600 text-sm mt-4 text-center bg-red-50 rounded-xl py-2 px-3 border border-red-100">
              {error}
            </p>
          )}

          {authMode === "signin" && (
            <>
              <div className="flex items-center gap-3 my-7">
                <div className="flex-1 h-px bg-rose-100" />
                <span className="text-xs uppercase tracking-wider text-gray-400 font-medium">or</span>
                <div className="flex-1 h-px bg-rose-100" />
              </div>
              <button
                type="button"
                onClick={() => setShowAnonModal(true)}
                disabled={anonLoading}
                className="w-full border-2 border-[#D97894] text-[#D97894] rounded-full py-3.5 font-semibold hover:bg-rose-50 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {anonLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Creating profile…
                  </>
                ) : (
                  <>
                    <UserX className="w-4 h-4" />
                    Continue anonymously
                  </>
                )}
              </button>
            </>
          )}

          <p className="flex items-center justify-center gap-2 text-xs text-gray-400 mt-6">
            <Lock className="w-3.5 h-3.5 shrink-0" />
            Passwords are hashed. We never sell your health data.
          </p>
        </div>
      </div>
      </div>
    </>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#FFF7F9]">
          <Loader2 className="w-8 h-8 animate-spin text-[#D97894]" />
        </div>
      }
    >
      <LoginPageInner />
    </Suspense>
  );
}
