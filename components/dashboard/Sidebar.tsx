"use client";
import { motion } from "framer-motion";
import { Home, User, Map, Calendar, BarChart, Users, Bell, Settings, LogOut, DollarSign } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const sidebarItems = [
  { label: "Profile", icon: User, href: "/dashboard/profile" },
  { label: "Destinations", icon: Map, href: "/dashboard/company/destinations", company: true },
  { label: "Bookings", icon: Calendar, href: "/dashboard/bookings" },
  { label: "Analytics", icon: BarChart, href: "/dashboard/company/analytics", company: true },
  { label: "Team", icon: Users, href: "/dashboard/company/team", company: true },
  { label: "My Trips", icon: Map, href: "/dashboard/guide/trips", guide: true },
  { label: "Earnings", icon: DollarSign, href: "/dashboard/guide/earnings", guide: true },
  { label: "Notifications", icon: Bell, href: "/dashboard/notifications" },
  { label: "Settings", icon: Settings, href: "/dashboard/settings" },
  { label: "Logout", icon: LogOut, href: "/signin" },
];

export default function Sidebar({ role = "company", active = "Profile", onSelectAction }: { role?: "company" | "guide"; active?: string; onSelectAction?: (label: string) => void }) {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <motion.aside
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className={`h-screen bg-gradient-to-br from-emerald-700 to-blue-700 text-white shadow-lg flex flex-col ${collapsed ? "w-16" : "w-64"} transition-all duration-300`}
    >
      <div className="flex items-center justify-between px-4 py-6">
        <span className={`font-bold text-2xl tracking-tight ${collapsed ? "hidden" : "block"}`}>TrailMate</span>
        <button onClick={() => setCollapsed(!collapsed)} className="text-white focus:outline-none">
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="M12 19V5"/></svg>
        </button>
      </div>
      <nav className="flex-1 flex flex-col gap-2 mt-4">
        {sidebarItems.filter(item => (role === "company" ? !item.guide : !item.company)).map(item => (
          <Link key={item.label} href={item.href} className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 hover:bg-white/10 ${active === item.label ? "bg-white/20" : ""}`}
            onClick={() => onSelectAction && onSelectAction(item.label)}>
            <item.icon className="w-5 h-5" />
            <span className={`${collapsed ? "hidden" : "block"}`}>{item.label}</span>
          </Link>
        ))}
      </nav>
    </motion.aside>
  );
}
