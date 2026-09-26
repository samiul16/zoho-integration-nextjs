/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Users,
  CheckCircle2,
  Clock,
  AlertCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import LeadModal from "./LeadModal"; // Import the new component

type Lead = {
  id: string;
  First_Name: string;
  Last_Name: string;
  Company: string;
  Email: string;
};

export default function LeadsTable() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    First_Name: "",
    Last_Name: "",
    Company: "",
    Email: "",
    Phone: "",
  });

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const router = useRouter();

  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelectedIds(next);
  };

  const handleCreate = async () => {
    if (
      !formData.First_Name ||
      !formData.Last_Name ||
      !formData.Email ||
      !formData.Company
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (res.status === 409 && data.code === "DUPLICATE_EMAIL") {
        toast.error("Duplicate Lead", {
          description: "This email already exists in Zoho CRM.",
        });
        return;
      }

      if (!res.ok) throw new Error("Failed to create lead.");
      router.push(`/leads/${data.record.id}?isSuccess=true`);
      setOpen(false);
      setFormData({
        First_Name: "",
        Last_Name: "",
        Company: "",
        Email: "",
        Phone: "",
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const fetchLeads = async () => {
    const res = await fetch("/api/leads");
    const json = await res.json();
    if (res.ok) setLeads(json.data);
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  return (
    <div className="w-full max-w-full">
      <div className="grid grid-cols-2 md:grid-cols-4 border border-slate-200 rounded-lg mb-6 bg-white overflow-hidden shadow-sm">
        {[
          { label: "New Leads", val: "42", icon: Users },
          { label: "Qualified", val: "18", icon: CheckCircle2 },
          { label: "Avg Response", val: "1.8h", icon: Clock },
          { label: "Hot Leads", val: "9", icon: AlertCircle },
        ].map((item, i) => (
          <div
            key={item.label}
            className={`p-4 ${i % 2 === 1 ? "" : "border-r"} ${
              i < 2 ? "border-b md:border-b-0" : ""
            } md:border-b-0 md:border-r ${
              i === 3 ? "border-r-0" : "border-slate-200"
            }`}
          >
            <div className="flex items-center gap-2 text-slate-400 mb-1">
              <item.icon size={14} />
              <p className="text-[10px] uppercase font-bold tracking-widest truncate">
                {item.label}
              </p>
            </div>
            <p className="text-xl md:text-2xl font-semibold">{item.val}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between mb-4 bg-white p-2 rounded-lg border border-slate-200">
        <div className="flex items-center px-3 text-slate-400 w-full md:w-auto">
          <Search size={18} />
          <input
            className="ml-2 bg-transparent outline-none text-sm text-black w-full"
            placeholder="Search..."
          />
        </div>
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 bg-[#1e293b] text-white px-3 py-2 md:px-4 rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors whitespace-nowrap"
        >
          <Plus size={16} /> <span className="hidden md:inline">Add Lead</span>
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-x-auto">
        <table className="w-full min-w-[600px] text-left border-collapse">
          <thead>
            <tr className="text-[11px] uppercase tracking-wider text-slate-400 bg-slate-50 border-b border-slate-200">
              <th className="p-4 w-10">
                <input type="checkbox" className="rounded" />
              </th>
              <th className="p-4">Customer</th>
              <th className="p-4">Company</th>
              <th className="p-4">Email</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((l: Lead, idx: number) => (
              <tr
                key={l.id}
                className={`${
                  idx % 2 === 0 ? "bg-white" : "bg-slate-50/50"
                } border-b border-slate-100 transition-colors cursor-pointer`}
                onClick={() => router.push(`/leads/${l.id}`)}
              >
                <td className="p-4">
                  <input
                    type="checkbox"
                    checked={selectedIds.has(l.id)}
                    onChange={() => toggleSelect(l.id)}
                    className="rounded text-indigo-600"
                  />
                </td>
                <td className="p-4 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-500 uppercase shrink-0">
                    {l.First_Name?.[0] || "?"}
                    {l.Last_Name?.[0] || "?"}
                  </div>
                  <span className="font-semibold text-sm truncate">
                    {l.First_Name} {l.Last_Name}
                  </span>
                </td>
                <td className="p-4 text-sm text-slate-600 truncate">
                  {l.Company}
                </td>
                <td className="p-4 text-sm text-slate-600 truncate">
                  {l.Email}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <LeadModal
        open={open}
        setOpen={setOpen}
        formData={formData}
        setFormData={setFormData}
        handleCreate={handleCreate}
        submitting={submitting}
        error={error}
      />
    </div>
  );
}
