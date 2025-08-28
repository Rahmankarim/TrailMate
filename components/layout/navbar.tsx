"use client"
import React from "react";
import { Button } from "@/components/ui/button"
import { Mountain, Menu } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = React.useState<any>(null);
  React.useEffect(() => {
    // Check JWT in localStorage
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (token) {
      // Decode JWT to get user info (role, name, etc.)
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUser(payload);
      } catch {
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, []);

  // Dropdown menu UI
  const [showDropdown, setShowDropdown] = React.useState(false);
  React.useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const btn = document.getElementById("profile-menu-btn");
      const dropdown = document.getElementById("profile-menu-dropdown");
      if (!btn || !dropdown) return;
      if (!btn.contains(e.target as Node) && !dropdown.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showDropdown]);

  const ProfileDropdown = () => (
    <div className="relative">
      <button className="rounded-full border-2 border-emerald-600 w-10 h-10 flex items-center justify-center bg-white shadow hover:scale-105 transition" id="profile-menu-btn" onClick={() => setShowDropdown((v) => !v)}>
        <img src={user?.avatar || "/placeholder-user.jpg"} alt="Profile" className="w-8 h-8 rounded-full" />
      </button>
      {showDropdown && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border z-50" id="profile-menu-dropdown">
          <ul className="py-2">
            <li>
              <button className="w-full text-left px-4 py-2 hover:bg-gray-100" onClick={() => router.push("/dashboard/profile")}>Profile</button>
            </li>
            <li>
              <button className="w-full text-left px-4 py-2 hover:bg-gray-100" onClick={() => {
                if (user?.role === "company") router.push("/dashboard/company");
                else if (user?.role === "guide") router.push("/dashboard/guide");
                else router.push("/dashboard");
              }}>Dashboard</button>
            </li>
            <li>
              <button className="w-full text-left px-4 py-2 hover:bg-gray-100" onClick={() => router.push("/dashboard/settings")}>Settings</button>
            </li>
            <li>
              <button className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100" onClick={() => { localStorage.removeItem("token"); setUser(null); router.push("/signin"); }}>Logout</button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );

  // ...existing code...

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 border-b border-gray-100 animate-slide-down">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 animate-fade-in">
            <Mountain className="h-8 w-8 text-gray-900" />
            <span className="text-2xl font-bold text-gray-900">TrailMate</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/destinations" className="text-gray-600 hover:text-gray-900 transition-all duration-300 hover:scale-105">Destinations</Link>
            <Link href="/features" className="text-gray-600 hover:text-gray-900 transition-all duration-300 hover:scale-105">Features</Link>
               <Link href="/blog" className="text-gray-600 hover:text-gray-900 transition-all duration-300 hover:scale-105">Blogs</Link>
                  <Link href="/community" className="text-gray-600 hover:text-gray-900 transition-all duration-300 hover:scale-105">Community</Link>
            <Link href="/about" className="text-gray-600 hover:text-gray-900 transition-all duration-300 hover:scale-105">About</Link>
            <Link href="/contact" className="text-gray-600 hover:text-gray-900 transition-all duration-300 hover:scale-105">Contact</Link>

          </nav>
          <div className="flex items-center space-x-4">
            {!user ? (
              <>
                <Button variant="ghost" className="hidden md:inline-flex hover:scale-105 transition-transform" onClick={() => router.push("/signin")}>Sign In</Button>
                <Button className="bg-gray-900 hover:bg-gray-800 text-white hover:scale-105 transition-all duration-300">Get Started</Button>
              </>
            ) : (
              <ProfileDropdown />
            )}
            <Button variant="ghost" size="sm" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
