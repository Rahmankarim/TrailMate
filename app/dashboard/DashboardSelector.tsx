"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building, Users } from "lucide-react";
export default function DashboardSelector() {
  const [role, setRole] = useState<string | null>(null);
  const [roles, setRoles] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) window.location.href = "/signin";
    try {
      if (token) {
        const payload = JSON.parse(atob(token.split(".")[1]));
        // If both roles selected, show selector
        if (Array.isArray(payload.role)) {
          setRoles(payload.role);
        } else if (payload.role) {
          setRole(payload.role);
        }
      }
    } catch {
      setRole(null);
    }
  }, []);

  // If both roles, show selector
  if (roles.length === 2) {
    return (
      <Card className="max-w-lg mx-auto mt-16 shadow-lg border-0 rounded-2xl bg-white">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-3xl font-bold text-emerald-700">Choose Your Dashboard</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <Button className="w-full flex items-center gap-2 bg-emerald-700 text-white hover:bg-emerald-800" onClick={() => router.push("/dashboard/company")}> <Building className="h-5 w-5" /> Company Dashboard </Button>
          <Button className="w-full flex items-center gap-2 bg-gray-900 text-white hover:bg-gray-800" onClick={() => router.push("/dashboard/guide")}> <Users className="h-5 w-5" /> Guide Dashboard </Button>
        </CardContent>
      </Card>
    );
  }

  // If only one role, redirect
  if (role === "company") {
    router.push("/dashboard/company");
    return null;
  }
  if (role === "guide") {
    router.push("/dashboard/guide");
    return null;
  }
  return null;
}