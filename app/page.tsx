/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    First_Name: "",
    Last_Name: "",
    Company: "",
    Email: "",
    Phone: "",
  });

  // Check Auth Status
  useEffect(() => {
    fetch("/api/auth/check").then((res) => {
      console.log("res", res);
      setIsAuthenticated(res.ok);
    });
  }, []);

  const fetchLeads = async () => {
    setLoading(true);
    const res = await fetch("/api/leads");
    const json = await res.json();
    if (res.ok) setLeads(json.data);
    setLoading(false);
  };

  if (isAuthenticated === null)
    return (
      <div className="h-screen flex items-center justify-center">
        Loading...
      </div>
    );

  return (
    <main className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            Zoho CRM Manager
          </h1>
          <p className="text-slate-500">Manage your business leads</p>
        </header>

        {!isAuthenticated ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-sm">
            <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              Connect Zoho CRM
            </h2>
            <p className="text-slate-600 mb-8 max-w-sm mx-auto">
              Access your CRM data by authorizing your Zoho account.
            </p>
            <a
              href="/api/auth/zoho"
              className="inline-flex bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-semibold transition-colors"
            >
              Sign in with Zoho
            </a>
          </div>
        ) : (
          <div className="grid gap-8">
            {/* Form Section */}
            <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-4">
                Add New Lead
              </h3>
              <form
                onSubmit={(e) => {
                  e.preventDefault(); /* logic here */
                }}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                <input
                  placeholder="First Name"
                  className="p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  onChange={(e) =>
                    setFormData({ ...formData, First_Name: e.target.value })
                  }
                />
                <input
                  placeholder="Last Name"
                  className="p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  onChange={(e) =>
                    setFormData({ ...formData, Last_Name: e.target.value })
                  }
                />
                <input
                  placeholder="Company"
                  className="p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  onChange={(e) =>
                    setFormData({ ...formData, Company: e.target.value })
                  }
                />
                <input
                  placeholder="Email"
                  type="email"
                  className="p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  onChange={(e) =>
                    setFormData({ ...formData, Email: e.target.value })
                  }
                />
                <button
                  type="submit"
                  className="md:col-span-2 bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-all"
                >
                  Submit Lead
                </button>
              </form>
            </section>

            {/* Leads Table */}
            <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <h3 className="text-lg font-bold text-slate-900">Your Leads</h3>
                <button
                  onClick={fetchLeads}
                  className="text-indigo-600 font-medium hover:text-indigo-800"
                >
                  {loading ? "Refreshing..." : "Refresh Data"}
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-slate-600">
                  <thead className="text-xs uppercase bg-slate-50 text-slate-500">
                    <tr>
                      <th className="p-4">Name</th>
                      <th className="p-4">Email</th>
                      <th className="p-4">Company</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leads.length > 0 ? (
                      leads.map((lead: any) => (
                        <tr
                          key={lead.id}
                          className="border-t border-slate-100 hover:bg-slate-50"
                        >
                          <td className="p-4 font-medium text-slate-900">
                            {lead.First_Name} {lead.Last_Name}
                          </td>
                          <td className="p-4">{lead.Email}</td>
                          <td className="p-4">{lead.Company}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={3} className="p-8 text-center">
                          No leads found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        )}
      </div>
    </main>
  );
}
