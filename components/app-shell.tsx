"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ClipboardList, History, LogOut, MessageCircle, Settings2, Sparkles } from "lucide-react";
import { signOut } from "@/lib/actions";

const routes = [
  { href: "/generate", label: "Write a reply", icon: Sparkles },
  { href: "/voice", label: "Brand voice", icon: Settings2 },
  { href: "/history", label: "Reply history", icon: History },
];

export default function AppShell({ children, businessName, email }: { children: React.ReactNode; businessName: string; email: string }) {
  const pathname = usePathname();
  const active = routes.find((route) => pathname.startsWith(route.href))?.label ?? "Workspace";
  return <div className="app-frame">
    <aside className="sidebar">
      <Link className="brand" href="/"><span className="brand-mark"><MessageCircle size={17} strokeWidth={2.4} /></span><span>replykit</span></Link>
      <div className="side-label">Workspace</div>
      <nav className="side-nav" aria-label="Workspace navigation">{routes.map(({ href, label, icon: Icon }) => <Link className={`side-link ${pathname.startsWith(href) ? "active" : ""}`} href={href} key={href}><Icon size={16} strokeWidth={1.8} />{label}</Link>)}</nav>
      <div className="sidebar-spacer" />
      <div className="business-chip"><div className="business-avatar">{businessName.slice(0, 1).toUpperCase()}</div><div className="business-meta"><div className="business-name">{businessName}</div><div className="business-caption">{email}</div></div><form action={signOut}><button className="signout-button" title="Sign out" aria-label="Sign out"><LogOut size={15} /></button></form></div>
    </aside>
    <div className="main-area">
      <header className="topbar"><div className="breadcrumb"><ClipboardList size={13} /><span>Workspace</span><span>/</span><strong>{active}</strong></div><div className="topbar-right"><span className="status-dot" /> Private workspace</div></header>
      {children}
    </div>
    <nav className="mobile-nav" aria-label="Mobile navigation">{routes.map(({ href, label, icon: Icon }) => <Link className={`mobile-link ${pathname.startsWith(href) ? "active" : ""}`} href={href} key={href}><Icon size={17} strokeWidth={1.8} /><span>{label === "Write a reply" ? "Write" : label === "Brand voice" ? "Voice" : "History"}</span></Link>)}</nav>
  </div>;
}
