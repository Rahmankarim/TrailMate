"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function DashboardSelector() {
  const [role, setRole] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()


  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/auth/me", { credentials: "include" });
        if (!res.ok) {
          router.push("/signin");
          return;
        }
        const data = await res.json();
        const role = data?.user?.role;
        if (role === "company") {
          router.push("/dashboard/company");
        } else if (role === "user") {
          router.push("/dashboard/user");
        } else if (role === "admin") {
          router.push("/dashboard/admin");
        } else {
          router.push("/dashboard");
        }
      } catch {
        router.push("/signin");
      }
    }
    fetchUser();
  }, [router]);

  return (
    <Card className="max-w-lg mx-auto mt-16 shadow-lg border-0 rounded-2xl bg-white">
      <CardHeader className="text-center pb-2">
        <CardTitle className="text-3xl font-bold text-emerald-700">Dashboard Access</CardTitle>
      </CardHeader>
      <CardContent className="text-center">
        <p className="text-gray-600 mb-4">Redirecting to your dashboard...</p>
        <Button onClick={() => router.push("/signin")} variant="outline">
          Back to Sign In
        </Button>
      </CardContent>
    </Card>
  )
}
