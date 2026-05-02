"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import Link from "next/link";
import {
  ChevronLeft,
  Shield,
  Lock,
  UserX,
  CheckCircle,
  Loader2,
  Heart,
  ShieldCheck,
} from "lucide-react";
import { useIsMobile } from "@/hooks/useWindowSize";

type AuthStep = "PHONE_INPUT" | "OTP_INPUT";

interface PhoneForm {
  phone: string;
}

export default function LoginPage() {
  const router = useRouter();
  const isMobile = useIsMobile();
  const [step, setStep] = useState<AuthStep>("PHONE_INPUT");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [anonLoading, setAnonLoading] = useState(false);
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(0);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<PhoneForm>();

  // Countdown timer for resend
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  // Send OTP
  const handleSendOTP = async (data: PhoneForm) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: data.phone }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        setError(json.message || "Failed to send OTP");
        return;
      }
      setPhone(data.phone);
      setStep("OTP_INPUT");
      setCountdown(30);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Anonymous login
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
      const result = await signIn("credentials", {
        userId: json.userId,
        role: json.role,
        isAnonymous: "true",
        redirect: false,
      });
      if (result?.error) {
        setError("Login failed. Please try again.");
        return;
      }
      router.push("/patient");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setAnonLoading(false);
    }
  };

  // OTP input handlers
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

  // Verify OTP
  const handleVerifyOTP = useCallback(async () => {
    const otpValue = otp.join("");
    if (otpValue.length !== 6) {
      setError("Please enter the full 6-digit OTP");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, otp: otpValue }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        setError(json.message || "Invalid OTP");
        setOtp(["", "", "", "", "", ""]);
        otpRefs.current[0]?.focus();
        return;
      }
      const result = await signIn("credentials", {
        userId: json.userId,
        role: json.role,
        isAnonymous: "false",
        redirect: false,
      });
      if (result?.error) {
        setError("Login failed. Please try again.");
        return;
      }
      if (json.role === "doctor") router.push("/doctor");
      else if (json.role === "admin") router.push("/admin");
      else router.push("/patient");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [otp, phone, router]);

  // Auto-submit when all 6 digits entered
  useEffect(() => {
    if (otp.every((d) => d !== "") && step === "OTP_INPUT") {
      handleVerifyOTP();
    }
  }, [otp, step, handleVerifyOTP]);

  // Resend OTP
  const handleResend = async () => {
    setError("");
    setOtp(["", "", "", "", "", ""]);
    try {
      const res = await fetch("/api/auth/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
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

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Left decorative panel */}
      <div
        style={{
          width: "50%",
          background: "linear-gradient(135deg, #880E4F 0%, #C2185B 100%)",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "3rem",
          position: "relative",
          display: isMobile ? "none" : "flex",
        }}
      >
        <div className="login-brand-panel max-w-md text-center text-white">
          {/* Logo */}
          <div className="flex items-baseline justify-center mb-8">
            <span className="font-serif font-bold text-3xl !text-white">
              Dear
            </span>
            <span className="font-serif italic text-3xl !text-rose-100">
              Gynac
            </span>
            <span className="!text-[#F5E4A8] font-bold text-4xl leading-none">
              .
            </span>
          </div>

          <p className="!text-white/90 text-lg mb-12">
            India&apos;s most trusted women&apos;s health platform
          </p>

          {/* Trust points */}
          <div className="space-y-6 text-left">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
                <Shield className="w-5 h-5 text-black" strokeWidth={2} />
              </div>
              <div>
                <h3 className="font-semibold !text-white">100% Anonymous</h3>
                <p className="!text-white/85 text-sm mt-1">
                  No real name required. Your identity stays completely private.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5 text-black" strokeWidth={2} />
              </div>
              <div>
                <h3 className="font-semibold !text-white">
                  NMC-Verified Doctors
                </h3>
                <p className="!text-white/85 text-sm mt-1">
                  Every doctor is verified against the National Medical
                  Commission registry.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
                <Heart className="w-5 h-5 text-black" strokeWidth={2} />
              </div>
              <div>
                <h3 className="font-semibold !text-white">
                  Compassionate Care
                </h3>
                <p className="!text-white/85 text-sm mt-1">
                  Stigma-free, judgement-free support for every health concern.
                </p>
              </div>
            </div>
          </div>

          {/* Quote */}
          <p className="italic !text-white/75 text-base mt-16">
            &ldquo;Your health story belongs to you.&rdquo;
          </p>
        </div>
      </div>

      {/* Right form panel */}
      <div
        style={{
          flex: 1,
          width: isMobile ? "100%" : "auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          backgroundColor: "#FDF8F5",
          padding: "1.5rem",
        }}
      >
        {/* Dev mode test credentials banner */}
        {process.env.NODE_ENV === "development" && step === "PHONE_INPUT" && (
          <div
            style={{
              width: "100%",
              maxWidth: "28rem",
              backgroundColor: "#FFF9E6",
              border: "1px solid #F59E0B",
              borderRadius: "0.75rem",
              padding: "1rem",
              marginBottom: "1rem",
            }}
          >
            <div
              style={{
                fontSize: "0.75rem",
                fontWeight: 700,
                color: "#92400E",
                marginBottom: "0.5rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              🧪 Dev Mode — Test Accounts (OTP: 123456)
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
              {[
                { label: "Admin", phone: "9000000000" },
                { label: "Dr. Snehal (Doctor)", phone: "9000000001" },
                { label: "Dr. Kshitija (Doctor)", phone: "9000000002" },
                { label: "Priya (Patient)", phone: "9000000004" },
              ].map((account) => (
                <button
                  key={account.phone}
                  type="button"
                  onClick={() => setValue("phone", account.phone)}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "0.375rem 0.5rem",
                    borderRadius: "0.375rem",
                    border: "1px solid #FCD34D",
                    backgroundColor: "white",
                    cursor: "pointer",
                    fontSize: "0.75rem",
                    color: "#1A0A12",
                    textAlign: "left",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#FFFBEB")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "white")
                  }
                >
                  <span style={{ fontWeight: 600 }}>{account.label}</span>
                  <span style={{ color: "#6B7280", fontFamily: "monospace" }}>
                    {account.phone}
                  </span>
                </button>
              ))}
            </div>
            <div
              style={{
                fontSize: "0.7rem",
                color: "#92400E",
                marginTop: "0.5rem",
                fontStyle: "italic",
              }}
            >
              Click any account to auto-fill phone. OTP is always 123456.
            </div>
          </div>
        )}

        <div
          style={{
            width: "100%",
            maxWidth: "28rem",
            backgroundColor: "white",
            borderRadius: "1rem",
            boxShadow: "0 20px 60px rgba(0,0,0,0.1)",
            padding: isMobile ? "1.5rem" : "2.5rem",
          }}
        >
          {step === "PHONE_INPUT" ? (
            <>
              {/* Back link */}
              <Link
                href="/"
                className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-[#C2185B] transition-colors mb-6"
              >
                <ChevronLeft className="w-4 h-4" />
                Back to Home
              </Link>

              {/* Title */}
              <h1 className="font-serif font-bold text-2xl text-[#1A0A12]">
                Welcome to DearGynac
              </h1>
              <p className="text-gray-500 text-sm mt-2">
                Enter your phone number to receive a one-time password
              </p>

              {/* Phone form */}
              <form
                onSubmit={handleSubmit(handleSendOTP)}
                className="mt-6 space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Phone Number
                  </label>
                  <div className="flex border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-[#C2185B] focus-within:border-[#C2185B]">
                    <span className="bg-gray-50 px-4 flex items-center text-gray-600 font-medium text-sm border-r border-gray-300">
                      +91
                    </span>
                    <input
                      type="tel"
                      maxLength={10}
                      placeholder="98765 43210"
                      className="flex-1 px-4 py-3 outline-none text-sm bg-white"
                      {...register("phone", {
                        required: "Phone number is required",
                        pattern: {
                          value: /^\d{10}$/,
                          message: "Please enter a valid 10-digit number",
                        },
                      })}
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.phone.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#C2185B] text-white rounded-full py-3 font-semibold hover:bg-[#880E4F] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Send OTP"
                  )}
                </button>
              </form>

              {error && (
                <p className="text-red-500 text-sm mt-3 text-center">
                  {error}
                </p>
              )}

              {/* Divider */}
              <div className="flex items-center gap-3 my-6">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-sm text-gray-400">or</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>

              {/* Anonymous button */}
              <button
                onClick={handleAnonymous}
                disabled={anonLoading}
                className="w-full border-2 border-[#C2185B] text-[#C2185B] rounded-full py-3 font-semibold hover:bg-rose-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {anonLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Creating profile...
                  </>
                ) : (
                  <>
                    <UserX className="w-4 h-4" />
                    Continue Anonymously
                  </>
                )}
              </button>

              {/* Privacy note */}
              <p className="flex items-center gap-2 text-xs text-gray-400 mt-6 justify-center">
                <Lock className="w-3 h-3" />
                Your number is only used for verification. We never share it.
              </p>
            </>
          ) : (
            <>
              {/* OTP Input State */}
              <div className="flex items-center gap-2 text-green-600 mb-4">
                <CheckCircle className="w-5 h-5" />
                <span className="text-sm font-medium">
                  OTP sent to +91 {phone}
                </span>
              </div>

              <button
                onClick={() => {
                  setStep("PHONE_INPUT");
                  setOtp(["", "", "", "", "", ""]);
                  setError("");
                }}
                className="text-sm text-[#C2185B] hover:text-[#880E4F] transition-colors mb-6"
              >
                Change number
              </button>

              <h2 className="font-serif font-bold text-xl text-[#1A0A12]">
                Enter Verification Code
              </h2>
              <p className="text-gray-500 text-sm mt-1 mb-6">
                Enter the 6-digit code sent to your phone
              </p>

              {/* OTP boxes */}
              <div
                className="flex gap-3 justify-center mb-6"
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
                    className={`${isMobile ? 'w-10 h-10' : 'w-12 h-12'} text-center text-xl font-bold border-2 rounded-lg outline-none transition ${
                      digit
                        ? "border-[#C2185B] bg-rose-50"
                        : "border-gray-300 focus:border-[#C2185B]"
                    } ${error ? "animate-shake" : ""}`}
                  />
                ))}
              </div>

              {error && (
                <p className="text-red-500 text-sm mb-4 text-center">
                  {error}
                </p>
              )}

              <button
                onClick={handleVerifyOTP}
                disabled={loading}
                className="w-full bg-[#C2185B] text-white rounded-full py-3 font-semibold hover:bg-[#880E4F] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Verify OTP"
                )}
              </button>

              {/* Resend */}
              <div className="text-center mt-4">
                {countdown > 0 ? (
                  <span className="text-sm text-gray-400">
                    Resend in 00:
                    {countdown.toString().padStart(2, "0")}
                  </span>
                ) : (
                  <button
                    onClick={handleResend}
                    className="text-sm text-[#C2185B] hover:text-[#880E4F] font-medium transition-colors"
                  >
                    Resend OTP
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
