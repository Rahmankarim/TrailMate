"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Link from "next/link";

export default function SignUpForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, role, companyName }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Sign up failed");
      setLoading(false);
      return;
    }
    if (data.token) {
      localStorage.setItem("token", data.token);
      window.location.href = "/dashboard";
    } else {
      setSuccess("Account created! You can now sign in.");
    }
    setLoading(false);
  }

  return (
    <div className="py-16">
      <Card className="max-w-md mx-auto shadow-2xl border-0 rounded-3xl bg-white px-2 py-4">
      <CardHeader className="flex flex-col items-center pb-2">
        <img src="/placeholder-logo.png" alt="TrailMate Logo" className="w-16 h-16 mb-2 rounded-full shadow" />
        <CardTitle className="text-3xl font-bold text-emerald-700">Sign Up</CardTitle>
        <div className="text-gray-500 text-sm mt-1">Create your account to start your adventure!</div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSignUp} className="space-y-5">
          <Input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            className="bg-gray-50 border-gray-200"
          />
          <Input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="bg-gray-50 border-gray-200"
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className="bg-gray-50 border-gray-200"
          />
          <div className="flex gap-4 justify-center">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" name="role" value="company" checked={role.includes("company")} onChange={e => setRole(role.includes("company") ? role.replace("company","") : role+"company")} className="accent-emerald-700"/>
              <span className="text-gray-700">Company</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" name="role" value="guide" checked={role.includes("guide")} onChange={e => setRole(role.includes("guide") ? role.replace("guide","") : role+"guide")} className="accent-emerald-700"/>
              <span className="text-gray-700">Guide</span>
            </label>
          </div>
          {role.includes("company") && (
            <Input
              type="text"
              placeholder="Company Name"
              value={companyName}
              onChange={e => setCompanyName(e.target.value)}
              required
              className="bg-gray-50 border-gray-200"
            />
          )}
          <Button type="button" variant="outline" className="w-full flex items-center justify-center gap-2 py-2 rounded-xl border-gray-300 hover:bg-gray-50" onClick={async () => {
            setLoading(true);
            setError("");
            // Example: send Google credentials to backend
            const googleId = "demo-google-id";
            const res = await fetch("/api/auth/google", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ name, email, googleId }),
            });
            const data = await res.json();
            if (!res.ok) {
              setError(data.error || "Google sign up failed");
              setLoading(false);
              return;
            }
            localStorage.setItem("token", data.token);
            window.location.href = "/dashboard";
          }}>
            <span className="mr-2"><svg width="20" height="20" viewBox="0 0 48 48"><g><path fill="#4285F4" d="M24 9.5c3.54 0 6.73 1.22 9.24 3.22l6.9-6.9C36.36 2.34 30.55 0 24 0 14.64 0 6.27 5.64 2.44 14.02l8.06 6.27C12.7 13.36 17.89 9.5 24 9.5z"/><path fill="#34A853" d="M46.1 24.5c0-1.64-.15-3.22-.44-4.75H24v9h12.5c-.54 2.9-2.17 5.36-4.6 7.04l7.18 5.59C43.73 37.36 46.1 31.36 46.1 24.5z"/><path fill="#FBBC05" d="M10.5 28.27c-1.13-3.36-1.13-6.98 0-10.34l-8.06-6.27C.64 16.36 0 20.09 0 24c0 3.91.64 7.64 2.44 11.34l8.06-6.27z"/><path fill="#EA4335" d="M24 46c6.55 0 12.36-2.16 16.94-5.91l-7.18-5.59c-2.01 1.35-4.59 2.15-7.76 2.15-6.11 0-11.3-3.86-13.5-9.23l-8.06 6.27C6.27 42.36 14.64 48 24 48z"/></g></svg></span> Sign up with Google
          </Button>
          {error && <div className="text-red-600 text-sm text-center">{error}</div>}
          {success && <div className="text-green-600 text-sm text-center">{success}</div>}
          <Button type="submit" className="w-full bg-emerald-700 text-white font-semibold text-lg py-2 rounded-xl hover:bg-emerald-800 transition-all duration-200" disabled={loading}>
            {loading ? "Signing Up..." : "Sign Up"}
          </Button>
        </form>
        <div className="mt-6 text-center text-gray-600">
          Already have an account? <Link href="/signin" className="text-emerald-700 font-semibold">Sign In</Link>
        </div>
      </CardContent>
    </Card>
    </div>
  );
}
