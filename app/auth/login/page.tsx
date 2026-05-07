"use client";

import {
  useState,
  useRef,
  useEffect,
  useCallback,
  Suspense,
} from "react";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ChevronLeft,
  Shield,
  Lock,
  UserX,
  CheckCircle,
  Loader2,
  Heart,
  ShieldCheck,
  Sparkles,
  UserPlus,
  LogIn,
} from "lucide-react";
import { useIsMobile } from "@/hooks/useWindowSize";

type AuthStep = "collect" | "otp";
type SigninPhase = "phone" | "new_profile";
type AuthMode = "signin" | "signup";

const DEV_TEST_ACCOUNTS = [
  { label: "Admin", phone: "9000000000" },
  { label: "Dr. Snehal (Doctor)", phone: "9000000001" },
  { label: "Dr. Kshitija (Doctor)", phone: "9000000002" },
  { label: "Dr. Praveen (Doctor)", phone: "9000000003" },
  { label: "Priya (Patient)", phone: "9000000004" },
  { label: "Patient (alt)", phone: "9000000005" },
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
  const [authLogLines, setAuthLogLines] = useState<string[]>([]);
  const pushAuthLog = useCallback((msg: string) => {
    const line = `${new Date().toISOString()} ${msg}`;
    console.log(`[DearGynac auth] ${msg}`);
    setAuthLogLines((prev) => [...prev.slice(-19), line]);
  }, []);

  const [authMode, setAuthMode] = useState<AuthMode>("signin");
  const [step, setStep] = useState<AuthStep>("collect");
  const [signinPhase, setSigninPhase] = useState<SigninPhase>("phone");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [anonLoading, setAnonLoading] = useState(false);
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [profileRequiredOnVerify, setProfileRequiredOnVerify] =
    useState(false);
  const [otpIntent, setOtpIntent] = useState<"signin" | "signup">("signin");

  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const otpVerifyInFlight = useRef(false);
  const otpAutoSubmitKeyRef = useRef<string | null>(null);

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  useEffect(() => {
    pushAuthLog(`useSession status=${status}`);
  }, [status, pushAuthLog]);

  useEffect(() => {
    if (status !== "authenticated" || !session?.user) return;
    const role = (session.user as { role?: string }).role ?? "patient";
    const dest = postAuthDestination(role, callbackUrl);
    pushAuthLog(`useSession: authenticated role=${role} → ${dest}`);
    window.location.href = dest;
  }, [status, session, pushAuthLog, callbackUrl]);

  const resetFlow = useCallback(() => {
    setStep("collect");
    setSigninPhase("phone");
    setOtp(["", "", "", "", "", ""]);
    setError("");
    setProfileRequiredOnVerify(false);
    otpAutoSubmitKeyRef.current = null;
  }, []);

  const switchMode = (mode: AuthMode) => {
    setAuthMode(mode);
    resetFlow();
    setPhone("");
    setName("");
    setEmail("");
  };

  const sendOtpRequest = async (
    intent: "signin" | "signup",
    needProfileOnVerify: boolean
  ) => {
    const res = await fetch("/api/auth/otp/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, intent }),
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      setError(json.message || "Failed to send OTP");
      return false;
    }
    pushAuthLog(`OTP send OK phone=${phone} intent=${intent}`);
    setOtpIntent(intent);
    setProfileRequiredOnVerify(needProfileOnVerify);
    setStep("otp");
    setCountdown(30);
    return true;
  };

  const handleSigninContinue = async () => {
    setError("");
    if (!/^\d{10}$/.test(phone)) {
      setError("Enter a valid 10-digit mobile number");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/patient/check-phone", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        setError(json.message || "Could not verify this number");
        return;
      }
      if (json.isNew) {
        setSigninPhase("new_profile");
        pushAuthLog(`signin: new phone → profile step`);
        return;
      }
      const ok = await sendOtpRequest("signin", false);
      if (ok) pushAuthLog(`signin: existing account → OTP`);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleNewProfileSendOtp = async () => {
    setError("");
    const n = name.trim();
    const em = email.trim();
    if (n.length < 2) {
      setError("Please enter your full name");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) {
      setError("Please enter a valid email");
      return;
    }
    setLoading(true);
    try {
      const ok = await sendOtpRequest("signin", true);
      if (ok) pushAuthLog(`signin: new patient profile → OTP`);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignupSendOtp = async () => {
    setError("");
    const n = name.trim();
    const em = email.trim();
    if (n.length < 2) {
      setError("Please enter your full name");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) {
      setError("Please enter a valid email");
      return;
    }
    if (!/^\d{10}$/.test(phone)) {
      setError("Enter a valid 10-digit mobile number");
      return;
    }
    setLoading(true);
    try {
      const ok = await sendOtpRequest("signup", true);
      if (ok) pushAuthLog(`signup → OTP`);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAnonymous = async () => {
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
      const dest = postAuthDestination("patient", callbackUrl);
      const result = await signIn("credentials", {
        userId: json.userId,
        role: json.role,
        isAnonymous: "true",
        redirect: false,
        callbackUrl: dest,
      });
      pushAuthLog(
        `anonymous signIn: ok=${result?.ok} error=${result?.error ?? "none"}`
      );
      if (result?.error || result?.ok === false) {
        setError("Authentication failed: " + (result.error ?? "unknown"));
        return;
      }
      window.location.href = dest;
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setAnonLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;
    const newOtp = [...otp];
    for (let i = 0; i < 6; i++) {
      newOtp[i] = pasted[i] || "";
    }
    setOtp(newOtp);
    const focusIdx = Math.min(pasted.length, 5);
    otpRefs.current[focusIdx]?.focus();
  };

  const handleVerifyOTP = useCallback(async () => {
    const otpValue = otp.join("");
    if (otpValue.length !== 6) {
      setError("Please enter the full 6-digit OTP");
      return;
    }
    if (otpVerifyInFlight.current) return;
    otpVerifyInFlight.current = true;
    setLoading(true);
    setError("");
    try {
      pushAuthLog(`verify start phone=${phone}`);
      const res = await fetch("/api/auth/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone,
          otp: otpValue,
          ...(profileRequiredOnVerify
            ? { name: name.trim(), email: email.trim() }
            : {}),
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        otpAutoSubmitKeyRef.current = null;
        pushAuthLog(`verify API fail: ${json.message ?? res.status}`);
        setError(json.message || "Invalid OTP");
        setOtp(["", "", "", "", "", ""]);
        otpRefs.current[0]?.focus();
        return;
      }
      const role = String(json.role ?? "patient");
      const dest = postAuthDestination(role, callbackUrl);
      pushAuthLog(`verify OK userId=${json.userId} role=${role} → ${dest}`);

      const result = await signIn("credentials", {
        userId: json.userId,
        role: json.role,
        isAnonymous: "false",
        redirect: false,
        callbackUrl: dest,
      });
      pushAuthLog(
        `signIn: ok=${result?.ok} error=${result?.error ?? "none"}`
      );

      if (result?.error || result?.ok === false) {
        otpAutoSubmitKeyRef.current = null;
        setError("Authentication failed: " + (result.error ?? "unknown"));
        return;
      }

      window.location.href = dest;
    } catch (e) {
      otpAutoSubmitKeyRef.current = null;
      pushAuthLog(
        `verify exception: ${e instanceof Error ? e.message : String(e)}`
      );
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
      otpVerifyInFlight.current = false;
    }
  }, [otp, phone, pushAuthLog, profileRequiredOnVerify, name, email, callbackUrl]);

  useEffect(() => {
    if (!otp.every((d) => d !== "") || step !== "otp") return;
    const key = `${phone}:${otp.join("")}`;
    if (otpAutoSubmitKeyRef.current === key) return;
    otpAutoSubmitKeyRef.current = key;
    void handleVerifyOTP();
  }, [otp, step, phone, handleVerifyOTP]);

  const handleResend = async () => {
    setError("");
    otpAutoSubmitKeyRef.current = null;
    setOtp(["", "", "", "", "", ""]);
    try {
      const res = await fetch("/api/auth/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, intent: otpIntent }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setCountdown(30);
      } else {
        setError(json.message || "Failed to resend OTP");
      }
    } catch {
      setError("Failed to resend OTP");
    }
  };

  const goBackFromOtp = () => {
    otpAutoSubmitKeyRef.current = null;
    setStep("collect");
    setOtp(["", "", "", "", "", ""]);
    setError("");
  };

  const phoneField = (
    <div>
      <label className="block text-sm font-medium text-[#3D3438] mb-1.5">
        Phone number
      </label>
      <div className="flex border border-rose-100 rounded-xl overflow-hidden bg-white shadow-sm focus-within:ring-2 focus-within:ring-[#D97894]/35 focus-within:border-[#D97894] transition-shadow">
        <span className="bg-rose-50/80 px-4 flex items-center text-[#6B4B55] font-semibold text-sm border-r border-rose-100">
          +91
        </span>
        <input
          type="tel"
          maxLength={10}
          placeholder="98765 43210"
          value={phone}
          onChange={(e) =>
            setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
          }
          disabled={signinPhase === "new_profile"}
          className="flex-1 px-4 py-3.5 outline-none text-sm bg-white disabled:bg-rose-50/50 disabled:text-[#3D3438]"
        />
      </div>
    </div>
  );

  return (
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
        {step === "collect" && (
          <div className="w-full max-w-md mb-4 rounded-2xl border border-amber-200/80 bg-gradient-to-br from-amber-50 to-orange-50/90 p-4 shadow-sm">
            <div className="flex items-center gap-2 text-amber-950 font-semibold text-sm mb-2">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
              Dev build — OTP is always{" "}
              <span className="font-mono tracking-wide">123456</span>
            </div>
            <p className="text-xs text-amber-900/80 mb-3 leading-snug">
              Tap a row to fill the phone field. Admin, doctors, and patients all
              sign in here. New numbers (no account yet) ask for name and email
              before the code.
            </p>
            <div className="flex flex-col gap-2">
              {DEV_TEST_ACCOUNTS.map((account) => (
                <button
                  key={account.phone}
                  type="button"
                  onClick={() => {
                    setPhone(account.phone);
                    setAuthMode("signin");
                    setSigninPhase("phone");
                  }}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-amber-200 bg-white/90 px-3 py-2.5 text-left text-xs sm:text-sm text-[#1A0A12] hover:bg-amber-50/80 transition-colors min-h-[44px] w-full"
                >
                  <span className="font-semibold">{account.label}</span>
                  <span className="font-mono text-gray-500">{account.phone}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="w-full max-w-md rounded-2xl bg-white/95 backdrop-blur-sm border border-rose-100/80 shadow-[0_24px_70px_-28px_rgba(61,52,56,0.35)] p-6 sm:p-9">
          {step === "collect" ? (
            <>
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
                {authMode === "signin"
                  ? signinPhase === "new_profile"
                    ? "Almost there"
                    : "Welcome back"
                  : "Create your account"}
              </h1>
              <p className="text-gray-500 text-sm mt-2 leading-relaxed">
                {authMode === "signin"
                  ? signinPhase === "new_profile"
                    ? "Add your details so we can set up your private patient profile. We'll text a code to your number (demo: 123456)."
                    : "Sign in with your mobile number. New here? We'll ask for your name and email next."
                  : "Use your personal number — it stays your unique login. We'll send a one-time code (demo: 123456)."}
              </p>

              <div className="mt-6 space-y-4">
                {authMode === "signup" && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-[#3D3438] mb-1.5">
                        Full name
                      </label>
                      <input
                        type="text"
                        autoComplete="name"
                        placeholder="e.g. Ananya Desai"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full rounded-xl border border-rose-100 px-4 py-3.5 text-sm outline-none focus:ring-2 focus:ring-[#D97894]/30 focus:border-[#D97894] bg-white shadow-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#3D3438] mb-1.5">
                        Email
                      </label>
                      <input
                        type="email"
                        autoComplete="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full rounded-xl border border-rose-100 px-4 py-3.5 text-sm outline-none focus:ring-2 focus:ring-[#D97894]/30 focus:border-[#D97894] bg-white shadow-sm"
                      />
                    </div>
                    {phoneField}
                    <button
                      type="button"
                      onClick={handleSignupSendOtp}
                      disabled={loading}
                      className="w-full bg-[#D97894] text-white rounded-full py-3.5 font-semibold hover:bg-[#C45F7E] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md shadow-rose-300/40"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Sending code…
                        </>
                      ) : (
                        "Send OTP"
                      )}
                    </button>
                  </>
                )}

                {authMode === "signin" && signinPhase === "phone" && (
                  <>
                    {phoneField}
                    <button
                      type="button"
                      onClick={handleSigninContinue}
                      disabled={loading}
                      className="w-full bg-[#D97894] text-white rounded-full py-3.5 font-semibold hover:bg-[#C45F7E] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md shadow-rose-300/40"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Please wait…
                        </>
                      ) : (
                        "Continue"
                      )}
                    </button>
                  </>
                )}

                {authMode === "signin" && signinPhase === "new_profile" && (
                  <>
                    {phoneField}
                    <p className="text-xs text-gray-500 -mt-2">
                      +91 {phone} — we will send your verification code here.
                    </p>
                    <div>
                      <label className="block text-sm font-medium text-[#3D3438] mb-1.5">
                        Full name
                      </label>
                      <input
                        type="text"
                        autoComplete="name"
                        placeholder="How should we address you?"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full rounded-xl border border-rose-100 px-4 py-3.5 text-sm outline-none focus:ring-2 focus:ring-[#D97894]/30 focus:border-[#D97894] bg-white shadow-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#3D3438] mb-1.5">
                        Email
                      </label>
                      <input
                        type="email"
                        autoComplete="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full rounded-xl border border-rose-100 px-4 py-3.5 text-sm outline-none focus:ring-2 focus:ring-[#D97894]/30 focus:border-[#D97894] bg-white shadow-sm"
                      />
                    </div>
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          setSigninPhase("phone");
                          setError("");
                        }}
                        className="flex-1 rounded-full border-2 border-rose-200 text-[#9B6B7A] py-3 font-semibold hover:bg-rose-50 transition-colors"
                      >
                        Back
                      </button>
                      <button
                        type="button"
                        onClick={handleNewProfileSendOtp}
                        disabled={loading}
                        className="flex-[2] bg-[#D97894] text-white rounded-full py-3 font-semibold hover:bg-[#C45F7E] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {loading ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          "Send OTP"
                        )}
                      </button>
                    </div>
                  </>
                )}
              </div>

              {error && (
                <p className="text-red-600 text-sm mt-4 text-center bg-red-50 rounded-xl py-2 px-3 border border-red-100">
                  {error}
                </p>
              )}

              {authMode === "signin" && signinPhase === "phone" && (
                <>
                  <div className="flex items-center gap-3 my-7">
                    <div className="flex-1 h-px bg-rose-100" />
                    <span className="text-xs uppercase tracking-wider text-gray-400 font-medium">
                      or
                    </span>
                    <div className="flex-1 h-px bg-rose-100" />
                  </div>

                  <button
                    type="button"
                    onClick={handleAnonymous}
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
                Your number is only used for verification. We never sell it.
              </p>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2 text-emerald-700 mb-3">
                <CheckCircle className="w-5 h-5 shrink-0" />
                <span className="text-sm font-medium">
                  Code sent to +91 {phone}
                </span>
              </div>

              <button
                type="button"
                onClick={goBackFromOtp}
                className="text-sm text-[#D97894] hover:text-[#C45F7E] font-medium mb-5"
              >
                Change number
              </button>

              <h2 className="font-serif font-bold text-xl text-[#3D3438]">
                Enter verification code
              </h2>
              <p className="text-gray-500 text-sm mt-1 mb-6">
                Demo OTP:{" "}
                <span className="font-mono font-semibold text-[#3D3438]">
                  123456
                </span>
              </p>

              <div
                className="flex gap-2 sm:gap-3 justify-center mb-6"
                onPaste={handleOtpPaste}
              >
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => {
                      otpRefs.current[i] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                    className={`${isMobile ? "w-10 h-11" : "w-11 h-12"} text-center text-lg font-bold border-2 rounded-xl outline-none transition ${
                      digit
                        ? "border-[#D97894] bg-rose-50"
                        : "border-rose-100 focus:border-[#D97894]"
                    }`}
                  />
                ))}
              </div>

              {error && (
                <p className="text-red-600 text-sm mb-4 text-center bg-red-50 rounded-xl py-2 px-3 border border-red-100">
                  {error}
                </p>
              )}

              <button
                type="button"
                onClick={handleVerifyOTP}
                disabled={loading}
                className="w-full bg-[#D97894] text-white rounded-full py-3.5 font-semibold hover:bg-[#C45F7E] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Verifying…
                  </>
                ) : (
                  "Verify & continue"
                )}
              </button>

              <div className="text-center mt-4">
                {countdown > 0 ? (
                  <span className="text-sm text-gray-400">
                    Resend in 0:{countdown.toString().padStart(2, "0")}
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={handleResend}
                    className="text-sm text-[#D97894] hover:text-[#C45F7E] font-medium"
                  >
                    Resend OTP
                  </button>
                )}
              </div>
            </>
          )}
        </div>

        <div className="w-full max-w-md mt-3 p-3 bg-[#1A0A12] text-neutral-300 rounded-xl text-[0.65rem] font-mono max-h-36 overflow-y-auto border border-white/10">
          <div className="font-bold mb-1 text-pink-300">Auth debug</div>
          {authLogLines.length === 0 ? (
            <span className="opacity-70">
              Log lines appear here. Console:{" "}
              <code className="text-sky-300">[DearGynac auth]</code>
            </span>
          ) : (
            authLogLines.map((line, i) => (
              <div key={i} className="break-all">
                {line}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
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
