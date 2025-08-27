"use client";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function EditProfileForm() {
  const [user, setUser] = useState<any>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    // Fetch user profile from API or JWT
    // For demo, just set dummy data
    setUser({ name: "John Doe", email: "john@example.com" });
    setName("John Doe");
    setEmail("john@example.com");
  }, []);

  async function handleEdit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    // Call API to update profile
    setTimeout(() => {
      setSuccess("Profile updated!");
      setLoading(false);
    }, 1000);
  }

  return (
    <Card className="mt-8 shadow-lg border-0 rounded-2xl bg-white">
      <CardHeader className="text-center pb-2">
        <CardTitle className="text-xl font-bold text-gray-900">Edit Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleEdit} className="space-y-4">
          <Input type="text" placeholder="Name" value={name} onChange={e => setName(e.target.value)} required />
          <Input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
          {error && <div className="text-red-600 text-sm text-center">{error}</div>}
          {success && <div className="text-green-600 text-sm text-center">{success}</div>}
          <Button type="submit" className="w-full bg-emerald-700 text-white hover:bg-emerald-800" disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
