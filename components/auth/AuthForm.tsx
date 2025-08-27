"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const brand = {
  logo: "/placeholder-logo.png",
  tagline: "Smarter Routes, Greener Journeys",
  bg: "/images/mount.jpg",
};

const tabs = [
  { key: "signin", label: "Sign In" },
  { key: "signup", label: "Sign Up" },
];

export default function AuthForm() {
  const [tab, setTab] = useState<"signin" | "signup">("signin");
  const [fields, setFields] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
    role: "",
    companyName: "",
  });
  const [errors, setErrors] = useState<{ [k: string]: string }>({});
  const [loading, setLoading] = useState(false);

  function validate() {
    const errs: { [k: string]: string } = {};
    if (tab === "signup" && !fields.name.trim()) errs.name = "Full name required";
    if (!fields.email.match(/^[^@]+@[^@]+\.[^@]+$/)) errs.email = "Valid email required";
    if (!fields.password) errs.password = "Password required";
    if (tab === "signup" && fields.password !== fields.confirm) errs.confirm = "Passwords do not match";
    return errs;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setLoading(true);
    let res, data;
    if (tab === "signin") {
      res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: fields.email, password: fields.password, role: fields.role, companyName: fields.companyName }),
      });
      data = await res.json();
      if (!res.ok || !data.token) {
        setErrors({ form: data.error || "Sign in failed" });
        setLoading(false);
        return;
      }
      localStorage.setItem("token", data.token);
      window.location.href = "/dashboard";
    } else {
      res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: fields.name, email: fields.email, password: fields.password, role: fields.role, companyName: fields.companyName }),
      });
      data = await res.json();
      if (!res.ok || !data.token) {
        setErrors({ form: data.error || "Sign up failed" });
        setLoading(false);
        return;
      }
      localStorage.setItem("token", data.token);
      window.location.href = "/dashboard";
    }
    setLoading(false);
  }

  return (
  <div className="min-h-screen flex flex-col md:flex-row">
    {/* Left: Image/Brand */}
    <div className="hidden md:flex flex-1 items-center justify-center bg-gradient-to-br from-emerald-100 to-blue-100 relative">
      <Image
        src={brand.bg}
        alt="Adventure"
        fill
        className="object-cover opacity-80"
        priority
      />
      <div className="absolute z-10 flex flex-col items-center justify-center w-full h-full bg-black/30">
        <Image src={brand.logo} alt="Logo" width={64} height={64} className="mb-4 rounded-full shadow-lg" />
        <div className="text-3xl font-bold text-white drop-shadow mb-2">TrailMate</div>
        <div className="text-lg text-white/80">{brand.tagline}</div>
      </div>
    </div>
    {/* Right: Form */}
    <div className="flex-1 flex items-center justify-center bg-white">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md px-6 py-10 rounded-3xl shadow-2xl bg-white"
      >
        {/* Tabs */}
        <div className="flex justify-center mb-8">
          {tabs.map(t => (
            <button
              key={t.key}
              className={`px-6 py-2 font-semibold rounded-t-lg transition-all duration-200 ${
                tab === t.key
                  ? "bg-gradient-to-r from-emerald-600 to-blue-600 text-white shadow"
                  : "bg-gray-100 text-gray-600"
              }`}
              onClick={() => setTab(t.key as any)}
            >
              {t.label}
            </button>
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.form
            key={tab}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.3 }}
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            {errors.form && <div className="text-xs text-red-500 mt-2 text-center">{errors.form}</div>}
            {tab === "signup" && (
              <div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={fields.name}
                    onChange={e => setFields(f => ({ ...f, name: e.target.value }))}
                    placeholder="Your full name"
                    autoComplete="name"
                    className={`w-full px-4 py-2 rounded-lg border transition focus:outline-none focus:ring-2 ${errors.name ? "border-red-500 focus:ring-red-200" : "border-gray-300 focus:ring-blue-200"}`}
                  />
                  {errors.name && <div className="text-xs text-red-500 mt-1">{errors.name}</div>}
                </div>
                <div className="flex gap-4 mb-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="role" value="company" checked={fields.role === "company"} onChange={e => setFields(f => ({ ...f, role: "company" }))} className="accent-emerald-700"/>
                    <span className="text-gray-700">Company</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="role" value="guide" checked={fields.role === "guide"} onChange={e => setFields(f => ({ ...f, role: "guide" }))} className="accent-emerald-700"/>
                    <span className="text-gray-700">Guide</span>
                  </label>
                </div>
                {errors.role && <div className="text-xs text-red-500 mb-2">{errors.role}</div>}
                {fields.role === "company" && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                    <input
                      type="text"
                      value={fields.companyName}
                      onChange={e => setFields(f => ({ ...f, companyName: e.target.value }))}
                      placeholder="Company Name"
                      autoComplete="organization"
                      className={`w-full px-4 py-2 rounded-lg border transition focus:outline-none focus:ring-2 ${errors.companyName ? "border-red-500 focus:ring-red-200" : "border-gray-300 focus:ring-blue-200"}`}
                    />
                    {errors.companyName && <div className="text-xs text-red-500 mt-1">{errors.companyName}</div>}
                  </div>
                )}
              </div>
            )}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={fields.email}
                onChange={e => setFields(f => ({ ...f, email: e.target.value }))}
                placeholder="you@email.com"
                autoComplete="email"
                className={`w-full px-4 py-2 rounded-lg border transition focus:outline-none focus:ring-2 ${errors.email ? "border-red-500 focus:ring-red-200" : "border-gray-300 focus:ring-blue-200"}`}
              />
              {errors.email && <div className="text-xs text-red-500 mt-1">{errors.email}</div>}
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                value={fields.password}
                onChange={e => setFields(f => ({ ...f, password: e.target.value }))}
                placeholder="Password"
                autoComplete={tab === "signup" ? "new-password" : "current-password"}
                className={`w-full px-4 py-2 rounded-lg border transition focus:outline-none focus:ring-2 ${errors.password ? "border-red-500 focus:ring-red-200" : "border-gray-300 focus:ring-blue-200"}`}
              />
              {errors.password && <div className="text-xs text-red-500 mt-1">{errors.password}</div>}
            </div>
            {tab === "signup" && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                <input
                  type="password"
                  value={fields.confirm}
                  onChange={e => setFields(f => ({ ...f, confirm: e.target.value }))}
                  placeholder="Confirm password"
                  autoComplete="new-password"
                  className={`w-full px-4 py-2 rounded-lg border transition focus:outline-none focus:ring-2 ${errors.confirm ? "border-red-500 focus:ring-red-200" : "border-gray-300 focus:ring-blue-200"}`}
                />
                {errors.confirm && <div className="text-xs text-red-500 mt-1">{errors.confirm}</div>}
              </div>
            )}
            <button
              type="submit"
              className="w-full py-2 rounded-lg font-semibold transition bg-gradient-to-r from-emerald-600 to-blue-600 text-white shadow hover:from-emerald-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-200"
              disabled={loading}
            >
              {loading
                ? tab === "signup"
                  ? "Signing Up..."
                  : "Signing In..."
                : tab === "signup"
                ? "Sign Up"
                : "Sign In"}
            </button>
            <div className="flex items-center my-4">
              <div className="flex-grow border-t border-gray-200" />
              <span className="mx-2 text-gray-400 text-xs">or</span>
              <div className="flex-grow border-t border-gray-200" />
            </div>
            <button
              type="button"
              className="bg-white text-gray-700 border border-gray-300 flex items-center justify-center gap-2 w-full py-2 rounded-lg font-semibold hover:bg-gray-50"
              onClick={async () => {
                setLoading(true);
                setErrors({});
                const googleId = "demo-google-id";
                const res = await fetch(`/api/auth/google`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ name: fields.name || fields.email.split("@")[0], email: fields.email, googleId }),
                });
                const data = await res.json();
                if (!res.ok || !data.token) {
                  setErrors({ form: data.error || "Google sign in failed" });
                  setLoading(false);
                  return;
                }
                localStorage.setItem("token", data.token);
                window.location.href = "/dashboard";
                setLoading(false);
              }}
            >
              <span className="mr-2">
                <svg width="22" height="22" viewBox="0 0 48 48"><g><path fill="#4285F4" d="M24 9.5c3.54 0 6.7 1.23 9.19 3.25l6.85-6.85C35.54 2.34 30.07 0 24 0 14.61 0 6.27 5.7 2.44 14.1l7.98 6.21C12.13 13.16 17.56 9.5 24 9.5z"/><path fill="#34A853" d="M46.09 24.56c0-1.56-.14-3.06-.41-4.5H24v9.05h12.44c-.54 2.9-2.18 5.36-4.64 7.03l7.18 5.59C43.98 37.36 46.09 31.44 46.09 24.56z"/><path fill="#FBBC05" d="M10.42 28.31c-.62-1.86-.98-3.83-.98-5.81s.36-3.95.98-5.81l-7.98-6.21C.8 13.7 0 18.7 0 24s.8 10.3 2.44 14.52l7.98-6.21z"/><path fill="#EA4335" d="M24 48c6.07 0 11.54-2.01 15.81-5.47l-7.18-5.59c-2.01 1.35-4.59 2.15-7.63 2.15-6.44 0-11.87-3.66-14.58-8.81l-7.98 6.21C6.27 42.3 14.61 48 24 48z"/></g></svg>
              </span>
              Continue with Google
            </button>
          </motion.form>
        </AnimatePresence>
      </motion.div>
    </div>
  </div>
  );
}
