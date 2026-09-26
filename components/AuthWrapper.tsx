"use client";
import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";

export default function AuthWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [activeTab, setActiveTab] = useState("Leads");

  useEffect(() => {
    fetch("/api/auth/check").then((res) => setIsAuthenticated(res.ok));
  }, []);

  if (isAuthenticated === null)
    return (
      <div className="h-screen flex items-center justify-center">
        Loading...
      </div>
    );

  if (!isAuthenticated) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50">
        <div className="bg-white p-10 rounded-2xl shadow-lg text-center">
          <h1 className="text-2xl font-bold text-slate-800 mb-6">
            Welcome to Zoho Manager
          </h1>
          <a
            href="/api/auth/zoho"
            className="bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700"
          >
            Sign in with Zoho
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* <Sidebar /> */}
      <main className="flex-1">{children}</main>
    </div>
  );
}
