"use client"
import { useState } from "react"
import type React from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Shield, Mountain, Lock } from "lucide-react"
import { useRouter } from "next/navigation"

export default function AdminSignIn() {
  const [fields, setFields] = useState({
    email: "",
    password: "",
  })
  const [errors, setErrors] = useState<{ [k: string]: string }>({})
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs: { [k: string]: string } = {}
    if (!fields.email.match(/^[^@]+@[^@]+\.[^@]+$/)) errs.email = "Valid email required"
    if (!fields.password) errs.password = "Password required"

    setErrors(errs)
    if (Object.keys(errs).length) return

    setLoading(true)

    try {
      const res = await fetch("/api/auth/admin/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fields),
      })

      const data = await res.json()

      if (!res.ok || !data.token) {
        setErrors({ form: data.error || "Super admin sign in failed" })
        setLoading(false)
        return
      }

      localStorage.setItem("token", data.token)
      router.push("/dashboard/admin")
    } catch (error) {
      setErrors({ form: "Network error occurred" })
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <Card className="shadow-2xl border border-slate-700 rounded-2xl bg-slate-800">
          <CardHeader className="text-center pb-2">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-red-900/20 rounded-full border border-red-700/30">
                <Shield className="h-8 w-8 text-red-400" />
              </div>
            </div>
            <div className="flex items-center justify-center gap-2 mb-2">
              <Mountain className="h-6 w-6 text-slate-300" />
              <span className="text-xl font-bold text-slate-100">TrailMate</span>
            </div>
            <CardTitle className="text-2xl font-bold text-red-400 flex items-center justify-center gap-2">
              <Lock className="h-5 w-5" />
              Super Admin Portal
            </CardTitle>
            <p className="text-slate-400 text-sm">Restricted Access Only</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {errors.form && (
                <div className="text-xs text-red-400 text-center bg-red-900/20 p-3 rounded-lg border border-red-700/30">
                  {errors.form}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Super Admin Email</label>
                <input
                  type="email"
                  value={fields.email}
                  onChange={(e) => setFields((f) => ({ ...f, email: e.target.value }))}
                  placeholder="rahmankarim2468@gmail.com"
                  className={`w-full px-4 py-3 rounded-lg border transition focus:outline-none focus:ring-2 bg-slate-700 text-slate-100 placeholder-slate-400 ${
                    errors.email ? "border-red-500 focus:ring-red-400/50" : "border-slate-600 focus:ring-red-400/50"
                  }`}
                />
                {errors.email && <div className="text-xs text-red-400 mt-1">{errors.email}</div>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Super Admin Password</label>
                <input
                  type="password"
                  value={fields.password}
                  onChange={(e) => setFields((f) => ({ ...f, password: e.target.value }))}
                  placeholder="Enter super admin password"
                  className={`w-full px-4 py-3 rounded-lg border transition focus:outline-none focus:ring-2 bg-slate-700 text-slate-100 placeholder-slate-400 ${
                    errors.password ? "border-red-500 focus:ring-red-400/50" : "border-slate-600 focus:ring-red-400/50"
                  }`}
                />
                {errors.password && <div className="text-xs text-red-400 mt-1">{errors.password}</div>}
              </div>

              <Button
                type="submit"
                className="w-full py-3 rounded-lg font-semibold transition bg-red-600 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400/50"
                disabled={loading}
              >
                {loading ? "Authenticating..." : "Access Control Panel"}
              </Button>

              <div className="text-center mt-4">
                <a href="/signin" className="text-sm text-slate-400 hover:text-slate-200 transition">
                  ← Back to regular sign in
                </a>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
