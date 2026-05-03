"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  LayoutDashboard,
  MessageCircle,
  FileText,
  Calendar,
  FolderOpen,
  User,
  LogOut,
  Menu,
  X,
  Bell,
} from "lucide-react";
import LanguageSwitcher from "@/components/shared/LanguageSwitcher";

const navItems = [
  { icon: LayoutDashboard, href: "/patient", label: "Overview" },
  { icon: MessageCircle, href: "/patient/book", label: "Book Consultation" },
  { icon: FileText, href: "/patient/consultations", label: "My Consultations" },
  { icon: Calendar, href: "/patient/appointments", label: "Appointments" },
  { icon: FolderOpen, href: "/patient/records", label: "My Records" },
  { icon: User, href: "/patient/profile", label: "Profile" },
];

function SidebarContent({
  pathname,
  session,
  onNavClick,
}: {
  pathname: string;
  session: any;
  onNavClick?: () => void;
}) {
  const userName =
    (session?.user as any)?.name ||
    (session?.user as any)?.alias ||
    "Patient";
  const initial = userName.charAt(0).toUpperCase();

  return (
    <>
      {/* Logo */}
      <div className="px-6 py-5 border-b border-gray-100">
        <Link href="/" className="flex items-baseline">
          <span className="font-serif font-bold text-xl text-[#3D3438]">
            Dear
          </span>
          <span className="font-serif italic text-xl text-[#D97894]">
            Gynac
          </span>
          <span className="text-[#D4A017] font-bold text-2xl leading-none">
            .
          </span>
        </Link>
      </div>

      {/* Nav items */}
      <nav className="flex-1 mt-6 px-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            (item.href !== "/patient" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavClick}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive
                  ? "bg-rose-50 text-[#D97894] font-semibold"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom user section */}
      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#D97894] flex items-center justify-center text-white text-sm font-semibold">
            {initial}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-[#3D3438] truncate">
              {userName}
            </p>
            <p className="text-xs text-gray-400">Patient</p>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/auth/login" })}
            className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
            title="Sign out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </>
  );
}

function getPageTitle(pathname: string) {
  const item = navItems.find(
    (n) =>
      pathname === n.href ||
      (n.href !== "/patient" && pathname.startsWith(n.href))
  );
  if (item) return item.label;
  if (pathname.includes("/consultation/")) return "Consultation";
  return "Dashboard";
}

export default function PatientDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();

  if (status === 'loading') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: '#FFF7F9' }}>
        <div style={{ width: '3rem', height: '3rem', border: '4px solid #FDE8F0', borderTop: '4px solid #D97894', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      </div>
    );
  }

  const userName =
    (session?.user as any)?.name ||
    (session?.user as any)?.alias ||
    "Patient";
  const initial = userName.charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-[#FFF7F9]">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:flex-col fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-gray-100 z-30">
        <SidebarContent pathname={pathname} session={session} />
      </aside>

      {/* Mobile topbar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-white border-b border-gray-100 z-30 flex items-center justify-between px-4">
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 text-gray-600 hover:text-[#D97894]"
        >
          <Menu className="w-5 h-5" />
        </button>
        <Link href="/" className="flex items-baseline">
          <span className="font-serif font-bold text-lg text-[#3D3438]">
            Dear
          </span>
          <span className="font-serif italic text-lg text-[#D97894]">
            Gynac
          </span>
          <span className="text-[#D4A017] font-bold text-xl leading-none">
            .
          </span>
        </Link>
        <button
          onClick={() => router.push("/patient/profile")}
          className="w-8 h-8 rounded-full bg-[#D97894] flex items-center justify-center text-white text-xs font-semibold"
        >
          {initial}
        </button>
      </div>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute left-0 top-0 bottom-0 w-64 bg-white flex flex-col shadow-xl">
            <div className="flex items-center justify-end p-3">
              <button
                onClick={() => setMobileOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <SidebarContent
              pathname={pathname}
              session={session}
              onNavClick={() => setMobileOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="lg:ml-64">
        {/* Desktop top bar */}
        <header className="hidden lg:flex h-16 bg-white border-b border-gray-100 items-center justify-between px-8">
          <h1 className="text-lg font-semibold text-[#3D3438] font-serif">
            {getPageTitle(pathname)}
          </h1>
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <button className="p-2 text-gray-400 hover:text-gray-600 relative">
              <Bell className="w-5 h-5" />
            </button>
            <div className="w-8 h-8 rounded-full bg-[#D97894] flex items-center justify-center text-white text-xs font-semibold">
              {initial}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6 lg:p-8 mt-14 lg:mt-0">{children}</main>
      </div>
    </div>
  );
}
