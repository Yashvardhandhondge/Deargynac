"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  AlertTriangle,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
} from "lucide-react";

const navItems = [
  { icon: LayoutDashboard, href: "/admin", label: "Overview" },
  { icon: Users, href: "/admin/doctors", label: "Doctors" },
  { icon: ClipboardList, href: "/admin/consultations", label: "Consultations" },
  { icon: AlertTriangle, href: "/admin/sla", label: "SLA Monitor" },
  { icon: Settings, href: "/admin/settings", label: "Settings" },
];

function SidebarContent({ pathname, session, onNavClick }: { pathname: string; session: any; onNavClick?: () => void }) {
  const userName = (session?.user as any)?.name || "Admin";
  const initial = userName.charAt(0).toUpperCase();
  return (
    <>
      <div className="px-6 py-5 border-b border-white/10">
        <Link href="/" className="flex items-baseline">
          <span className="font-serif font-bold text-xl text-white">Dear</span>
          <span className="font-serif italic text-xl text-[#C2185B]">Gynac</span>
          <span className="text-[#D4A017] font-bold text-2xl leading-none">.</span>
        </Link>
      </div>
      <nav className="flex-1 mt-6 px-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
          return (
            <Link key={item.href} href={item.href} onClick={onNavClick}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${isActive ? "bg-white/10 text-white" : "text-white/60 hover:bg-white/5 hover:text-white"}`}>
              <Icon className="w-5 h-5" />{item.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#D4A017] flex items-center justify-center text-white text-sm font-semibold">{initial}</div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">{userName}</p>
            <p className="text-xs text-[#D4A017]">Admin</p>
          </div>
          <button onClick={() => signOut({ callbackUrl: "/auth/login" })} className="p-1.5 text-white/40 hover:text-red-400 transition-colors" title="Sign out">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </>
  );
}

function getPageTitle(pathname: string) {
  return navItems.find((n) => pathname === n.href || (n.href !== "/admin" && pathname.startsWith(n.href)))?.label || "Dashboard";
}

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();
  const userName = (session?.user as any)?.name || "Admin";
  const initial = userName.charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-[#FDF8F5]">
      <aside className="hidden lg:flex lg:flex-col fixed left-0 top-0 bottom-0 w-64 bg-[#1A0A12] z-30">
        <SidebarContent pathname={pathname} session={session} />
      </aside>
      <div className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-[#1A0A12] z-30 flex items-center justify-between px-4">
        <button onClick={() => setMobileOpen(true)} className="p-2 text-white/60 hover:text-white"><Menu className="w-5 h-5" /></button>
        <Link href="/" className="flex items-baseline">
          <span className="font-serif font-bold text-lg text-white">Dear</span>
          <span className="font-serif italic text-lg text-[#C2185B]">Gynac</span>
          <span className="text-[#D4A017] font-bold text-xl leading-none">.</span>
        </Link>
        <button onClick={() => router.push("/admin")} className="w-8 h-8 rounded-full bg-[#D4A017] flex items-center justify-center text-white text-xs font-semibold">{initial}</button>
      </div>
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-64 bg-[#1A0A12] flex flex-col shadow-xl">
            <div className="flex items-center justify-end p-3"><button onClick={() => setMobileOpen(false)} className="p-1 text-white/40 hover:text-white"><X className="w-5 h-5" /></button></div>
            <SidebarContent pathname={pathname} session={session} onNavClick={() => setMobileOpen(false)} />
          </div>
        </div>
      )}
      <div className="lg:ml-64">
        <header className="hidden lg:flex h-16 bg-white border-b border-gray-100 items-center justify-between px-8">
          <h1 className="text-lg font-semibold text-[#1A0A12] font-serif">{getPageTitle(pathname)}</h1>
          <div className="flex items-center gap-4">
            <button className="p-2 text-gray-400 hover:text-gray-600 relative"><Bell className="w-5 h-5" /></button>
            <div className="w-8 h-8 rounded-full bg-[#D4A017] flex items-center justify-center text-white text-xs font-semibold">{initial}</div>
          </div>
        </header>
        <main className="p-6 lg:p-8 mt-14 lg:mt-0">{children}</main>
      </div>
    </div>
  );
}
