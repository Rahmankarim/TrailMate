"use client";
import { useEffect, useState } from "react";

export default function CompanyProfile() {
  const [company, setCompany] = useState<any>(null);
  useEffect(() => {
    async function fetchCompany() {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/company/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setCompany(data.company || null);
    }
    fetchCompany();
  }, []);

  if (!company) return <main className="p-8">Loading...</main>;

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-6">Company Profile</h1>
      <div className="mb-4 text-lg font-semibold">{company.name}</div>
      <div className="mb-2">Email: {company.email}</div>
      <div className="mb-2">Joined: {new Date(company.createdAt).toLocaleDateString()}</div>
      {/* Add more company info as needed */}
    </main>
  );
}
