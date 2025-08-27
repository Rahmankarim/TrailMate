"use client";
import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import EditProfileForm from "./EditProfileForm";

export default function ProfileDashboard() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Fetch user profile from JWT or API
    const token = localStorage.getItem("token");
    if (!token) window.location.href = "/signin";
    // Optionally fetch user profile from API
  }, []);

  return (
    <Card className="max-w-lg mx-auto mt-16 shadow-lg border-0 rounded-2xl bg-white">
      <CardHeader className="text-center pb-2">
        <CardTitle className="text-3xl font-bold text-gray-900">Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <EditProfileForm />
        <Button className="mt-6 w-full bg-emerald-700 text-white hover:bg-emerald-800" onClick={() => { localStorage.removeItem("token"); window.location.href = "/signin"; }}>Sign Out</Button>
      </CardContent>
    </Card>
  );
}
