import { useState, type ReactNode } from "react";
import { Link } from "wouter";
import { toast } from "sonner";
import {
  Bell,
  ClipboardList,
  FolderOpen,
  GraduationCap,
  Inbox,
  LayoutDashboard,
  LogOut,
  Menu,
  UserCog,
  X,
} from "lucide-react";

import { img } from "../Home";
import { applications, enquiries } from "./data";

export type BackofficeSection = "overview" | "profile" | "media" | "enquiries" | "admissions" | "onboarding";

const navGroups: { label: string; items: { id: BackofficeSection; label: string; href: string; icon: typeof LayoutDashboard }[] }[] = [
  { label: "Overview", items: [{ id: "overview", label: "Dashboard", href: "/school-admin", icon: LayoutDashboard }] },
  {
    label: "School",
    items: [
      { id: "profile", label: "Profile", href: "/school-admin/profile", icon: UserCog },
      { id: "media", label: "Media & documents", href: "/school-admin/media", icon: FolderOpen },
    ],
  },
  {
    label: "Admissions",
    items: [
      { id: "enquiries", label: "Enquiries", href: "/school-admin/enquiries", icon: Inbox },
      { id: "admissions", label: "Applications", href: "/school-admin/admissions", icon: ClipboardList },
    ],
  },
  { label: "Students", items: [{ id: "onboarding", label: "Onboarding", href: "/school-admin/onboarding", icon: GraduationCap }] },
];

export default function BackofficeShell({ active, title, eyebrow, actions, children }: { active: BackofficeSection; title: string; eyebrow: string; actions?: ReactNode; children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const newEnquiries = enquiries.filter((e) => e.status === "New").length;
  const pendingApplications = applications.filter((a) => a.status === "Submitted" || a.status === "Under review").length;

  return (
    <div className="bo-shell">
      <aside className={`bo-sidebar ${mobileOpen ? "is-open" : ""}`}>
        <div className="bo-sidebar-brand">
          <img src={img.campus} alt="" />
          <div>
            <strong>Greenfield Academy</strong>
            <small><span>School backoffice</span></small>
          </div>
          <button className="icon-button bo-sidebar-close" style={{ marginLeft: "auto" }} onClick={() => setMobileOpen(false)} aria-label="Close menu"><X size={18} /></button>
        </div>
        <div className="bo-sidebar-scroll">
          {navGroups.map((group) => (
            <div className="bo-nav-group" key={group.label}>
              <div className="bo-nav-label">{group.label}</div>
              {group.items.map((item) => {
                const Icon = item.icon;
                const badge = item.id === "enquiries" ? newEnquiries : item.id === "admissions" ? pendingApplications : 0;
                return (
                  <Link key={item.id} href={item.href} className={`bo-nav-link ${active === item.id ? "active" : ""}`} onClick={() => setMobileOpen(false)}>
                    <Icon size={16} />
                    {item.label}
                    {badge > 0 && <span className="bo-nav-badge">{badge}</span>}
                  </Link>
                );
              })}
            </div>
          ))}
        </div>
        <div className="bo-sidebar-footer">
          <Link href="/schools/greenfield-academy" className="bo-nav-link"><UserCog size={16} /> View public profile</Link>
          <button className="bo-nav-link" onClick={() => toast("Signed out (UI preview only)")}><LogOut size={16} /> Sign out</button>
          <div className="bo-admin-chip">
            <span className="bo-admin-avatar">JW</span>
            <div>
              <strong>Jane Wanjiku</strong>
              <small>Head teacher</small>
            </div>
          </div>
        </div>
      </aside>

      {mobileOpen && <div className="modal-backdrop" style={{ zIndex: 30 }} onClick={() => setMobileOpen(false)} />}

      <div className="bo-main">
        <header className="bo-topbar">
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button className="icon-button bo-mobile-toggle" onClick={() => setMobileOpen(true)} aria-label="Open menu"><Menu size={20} /></button>
            <div>
              <div className="bo-topbar-eyebrow">{eyebrow}</div>
              <h1>{title}</h1>
            </div>
          </div>
          <div className="bo-topbar-actions">
            {actions}
            <button className="bo-icon-btn" onClick={() => toast("No new notifications beyond what's shown here")} aria-label="Notifications">
              <Bell size={16} />
              {(newEnquiries > 0 || pendingApplications > 0) && <span className="bo-dot" />}
            </button>
          </div>
        </header>
        <div className="bo-content">{children}</div>
      </div>
    </div>
  );
}
