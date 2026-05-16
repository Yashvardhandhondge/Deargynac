#!/usr/bin/env python3
"""Generate username/password login page from OTP version."""
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
src = (ROOT / "app/auth/login/page.tsx").read_text()

# Fix imports
src = src.replace(
    "import {\n  useState,\n  useRef,\n  useEffect,\n  useCallback,\n  Suspense,\n} from \"react\";",
    'import { useState, useEffect, Suspense, type FormEvent } from "react";',
)
src = src.replace("  CheckCircle,\n  Loader2,", "  Loader2,")
if "Eye," not in src:
    src = src.replace(
        "  LogIn,\n} from \"lucide-react\";",
        "  LogIn,\n  Eye,\n  EyeOff,\n  AlertTriangle,\n} from \"lucide-react\";",
    )

src = src.replace(
    'type AuthStep = "collect" | "otp";\ntype SigninPhase = "phone" | "new_profile";\ntype AuthMode = "signin" | "signup";',
    'type AuthMode = "signin" | "signup";',
)

src = src.replace(
    """const DEV_TEST_ACCOUNTS = [
  { label: "Admin", phone: "9000000000" },
  { label: "Dr. Snehal (Doctor)", phone: "9000000001" },
  { label: "Dr. Kshitija (Doctor)", phone: "9000000002" },
  { label: "Dr. Praveen (Doctor)", phone: "9000000003" },
  { label: "Priya (Patient)", phone: "9000000004" },
  { label: "Patient (alt)", phone: "9000000005" },
];""",
    """const DEV_TEST_ACCOUNTS = [
  { label: "Admin", username: "admin", password: "DearGynac1" },
  { label: "Dr. Snehal (Doctor)", username: "drsnehal", password: "DearGynac1" },
  { label: "Dr. Kshitija (Radiologist)", username: "drkshitija", password: "DearGynac1" },
  { label: "Dr. Praveen (Doctor)", username: "drpraveen", password: "DearGynac1" },
  { label: "Priya (Patient)", username: "priya", password: "DearGynac1" },
];""",
)

# Replace state block
old_state = """  const isMobile = useIsMobile();
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
  }, [status, session, pushAuthLog, callbackUrl]);"""

new_state = """  const isMobile = useIsMobile();

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
  }, [status, session, callbackUrl]);"""

if old_state in src:
    src = src.replace(old_state, new_state)
else:
    raise SystemExit("state block not found")

handlers_path = ROOT / "scripts/login_handlers.txt"
ui_path = ROOT / "scripts/login_ui.txt"
handlers = handlers_path.read_text()
ui = ui_path.read_text()

# Remove old handlers through phoneField
start = src.index("  const resetFlow = useCallback")
end = src.index("  return (\n    <motionless") if "motionless" in src else src.index("  return (\n    <motionless")
# fix - find phoneField end
end_marker = "  const phoneField = ("
end = src.index(end_marker)
# find closing of phoneField - );
phone_end = src.index("  );\n\n  return (", end)
src = src[:start] + handlers + "\n\n" + src[phone_end + len("  );\n\n"):]

# Replace form UI inside white card - from step === collect through end of card inner
# Find {step === "collect" && ( at dev panel - simpler: replace dev panel + card content

print("Need handlers and ui files")
PYEOF
