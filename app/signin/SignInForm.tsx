"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Globe } from "lucide-react";
import Link from "next/link";

export default function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth/signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, role, companyName }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Sign in failed");
      setLoading(false);
      return;
    }
  // Redirect to dashboard; token is set in HttpOnly cookie by API
  router.push("/dashboard");
  }

  async function handleGoogleSignIn() {
    // Simulate Google OAuth (replace with real OAuth flow)
    setLoading(true);
    setError("");
    // Example: send Google credentials to backend
    const googleId = "demo-google-id";
    const res = await fetch("/api/auth/google", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: email.split("@")[0], email, googleId }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Google sign in failed");
      setLoading(false);
      return;
    }
  // Redirect to dashboard; token is set in HttpOnly cookie by API
  router.push("/dashboard");
  }

  return (
    <div className="py-16">
      <Card className="max-w-md mx-auto shadow-2xl border-0 rounded-3xl bg-white px-2 py-4">
        <CardHeader className="flex flex-col items-center pb-2">
          <img src="/images/mount.jpg" alt="TrailMate Logo" className="w-16 h-16 mb-2 rounded-full shadow" />
          <CardTitle className="text-3xl font-bold text-emerald-700">Sign In</CardTitle>
          <div className="text-gray-500 text-sm mt-1">Welcome back! Please sign in to continue.</div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignIn} className="space-y-5">
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
            {error && <div className="text-red-600 text-sm text-center">{error}</div>}
            <Button type="submit" className="w-full bg-emerald-700 text-white font-semibold text-lg py-2 rounded-xl hover:bg-emerald-800 transition-all duration-200" disabled={loading}>
              {loading ? "Signing In..." : "Sign In"}
            </Button>
            <div className="flex items-center my-4">
              <div className="flex-grow border-t border-gray-200" />
              <span className="mx-2 text-gray-400 text-xs">or</span>
              <div className="flex-grow border-t border-gray-200" />
            </div>
            <Button type="button" variant="outline" className="w-full flex items-center justify-center gap-2 py-2 rounded-xl border-gray-300 hover:bg-gray-50" onClick={handleGoogleSignIn}>
              <Globe className="h-5 w-5 text-emerald-700" /> Sign in with Google
            </Button>
          </form>
          <div className="mt-6 text-center text-gray-600">
            Don't have an account? <Link href="/signup" className="text-emerald-700 font-semibold">Sign Up</Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
