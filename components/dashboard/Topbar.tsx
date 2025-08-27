"use client";
import { Bell, Search, Sun, Moon, User } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

export default function Topbar({ user = { name: "Alex" }, onToggleTheme }: { user?: any; onToggleTheme?: () => void }) {
  const [dark, setDark] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="w-full flex items-center justify-between px-8 py-4 bg-white dark:bg-gray-900 shadow"
    >
      <div className="flex items-center gap-4">
        <img src="/placeholder-logo.png" alt="Logo" className="w-10 h-10 rounded-full shadow" />
        <span className="font-bold text-xl text-emerald-700 dark:text-emerald-400">TrailMate</span>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative">
          <input type="text" placeholder="Search..." className="px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 focus:outline-none" />
          <Search className="absolute right-2 top-2 w-4 h-4 text-gray-400" />
        </div>
        <button onClick={() => { setDark(!dark); onToggleTheme && onToggleTheme(); }} className="p-2 rounded-full bg-gray-100 dark:bg-gray-800">
          {dark ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-gray-700" />}
        </button>
        <Bell className="w-6 h-6 text-gray-400" />
          <div className="relative">
            <button
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800"
              onClick={() => setShowDropdown((v) => !v)}
            >
              <User className="w-5 h-5 text-gray-700 dark:text-gray-200" />
              <span className="font-semibold text-gray-700 dark:text-gray-200">{user.name}</span>
            </button>
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-900 rounded-lg shadow-lg border z-10">
                <ul className="py-2">
                  <li className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer">Profile</li>
                  <li className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer">Settings</li>
                  <li className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer">Logout</li>
                </ul>
              </div>
            )}
          </div>
      </div>
    </motion.header>
  );
}
