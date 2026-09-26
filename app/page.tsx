/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useEffect } from "react";

export default function Home() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    First_Name: "",
    Last_Name: "",
    Company: "",
    Email: "",
    Phone: "",
  });

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/leads");
      const json = await res.json();
      if (res.ok) setLeads(json.data);
      else throw new Error(json.message || "Failed to fetch");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        body: JSON.stringify(formData),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message);

      alert(`Success! Lead created with ID: ${result.record.id}`);
      setFormData({
        First_Name: "",
        Last_Name: "",
        Company: "",
        Email: "",
        Phone: "",
      });
      fetchLeads();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-5xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Zoho CRM Manager</h1>

      {/* Auth Button */}
      <a
        href="/api/auth/zoho"
        className="inline-block bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 mb-8"
      >
        Authenticate Zoho
      </a>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Create Form */}
      <form
        onSubmit={handleCreate}
        className="grid grid-cols-2 gap-4 bg-gray-50 p-6 rounded-lg mb-8 border"
      >
        <input
          placeholder="First Name"
          className="p-2 text-gray-600  border "
          value={formData.First_Name}
          onChange={(e) =>
            setFormData({ ...formData, First_Name: e.target.value })
          }
        />
        <input
          placeholder="Last Name"
          className="p-2 text-gray-600  border "
          required
          value={formData.Last_Name}
          onChange={(e) =>
            setFormData({ ...formData, Last_Name: e.target.value })
          }
        />
        <input
          placeholder="Company"
          className="p-2 text-gray-600  border "
          required
          value={formData.Company}
          onChange={(e) =>
            setFormData({ ...formData, Company: e.target.value })
          }
        />
        <input
          placeholder="Email"
          type="email"
          className="p-2 text-gray-600  border "
          value={formData.Email}
          onChange={(e) => setFormData({ ...formData, Email: e.target.value })}
        />
        <input
          placeholder="Phone"
          className="p-2 text-gray-600  border "
          value={formData.Phone}
          onChange={(e) => setFormData({ ...formData, Phone: e.target.value })}
        />
        <button
          type="submit"
          disabled={loading}
          className="col-span-2 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Processing..." : "Create Lead"}
        </button>
      </form>

      {/* Leads Table */}
      <button
        onClick={fetchLeads}
        className="bg-green-600 text-white px-4 py-2 rounded mb-4"
      >
        Refresh Leads
      </button>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 text-left text-gray-600">Name</th>
              <th className="p-4 text-left text-gray-600">Email</th>
              <th className="p-4 text-left text-gray-600">Company</th>
              <th className="p-4 text-left text-gray-600">Phone</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead: any) => (
              <tr key={lead.id} className="border-t hover:bg-gray-50">
                <td className="p-4 text-gray-800">
                  {lead.First_Name} {lead.Last_Name}
                </td>
                <td className="p-4 text-gray-800">{lead.Email}</td>
                <td className="p-4 text-gray-800">{lead.Company}</td>
                <td className="p-4 text-gray-800">{lead.Phone}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
