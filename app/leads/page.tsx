/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import { useState, useEffect, useCallback } from "react";
import {
  Plus,
  Search,
  Users,
  CheckCircle2,
  Clock,
  AlertCircle,
} from "lucide-react";
import LeadsTable from "./components/LeadsTable";
import LeadModal from "./components/LeadsModal";

export default function LeadsPage() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    company: "",
    lead_source: "",
    status: "",
    description: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchData = useCallback(async (pageNum: number) => {
    setLoading(true);
    const res = await fetch(`/api/leads?page=${pageNum}`);
    const json = await res.json();
    setLeads(json.data || []);
    setHasMore(json.info?.more_records || false);
    setLoading(false);
  }, []);

  const handleCreate = async () => {
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const json = await res.json();
      if (json.success) {
        setOpen(false);
        setFormData({
          first_name: "",
          last_name: "",
          email: "",
          phone: "",
          company: "",
          lead_source: "",
          status: "",
          description: "",
        });
        // Refresh leads list
        fetchData(1);
      } else {
        setError(json.message || "Failed to create lead");
      }
    } catch (err: any) {
      setError(err.message || "Failed to create lead");
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    fetchData(page);
  }, [page, fetchData]);

  return (
    <div className="p-6">
      {/* Stats Bar */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: "New Leads", val: "42", icon: Users },
          { label: "Qualified", val: "18", icon: CheckCircle2 },
          { label: "Avg Response", val: "1.8h", icon: Clock },
          { label: "Hot Leads", val: "9", icon: AlertCircle },
        ].map((item) => (
          <div
            key={item.label}
            className="bg-white p-6 rounded-lg border border-slate-200"
          >
            <div className="flex items-center gap-2 text-slate-400 mb-1">
              <item.icon size={14} />
              <p className="text-[10px] uppercase font-bold">{item.label}</p>
            </div>
            <p className="text-xl font-semibold">{item.val}</p>
          </div>
        ))}
      </div>

      {/* Action Bar */}
      <div className="flex items-center justify-between mb-4 bg-white p-2 rounded-lg border border-slate-200 shadow-sm">
        <div className="flex items-center px-3 text-slate-400 w-full">
          <Search size={18} />
          <input
            className="ml-2 bg-transparent outline-none text-sm w-full"
            placeholder="Search..."
          />
        </div>
        <button
          onClick={() => setOpen(true)}
          className="flex items-center justify-center gap-2 bg-slate-900 text-white px-4 py-4 rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors whitespace-nowrap"
        >
          <Plus size={16} className="shrink-0" />
          <span>Add Lead</span>
        </button>
      </div>

      {/* Table Component */}
      <LeadsTable
        leads={leads as any}
        loading={loading}
        page={page}
        setPage={setPage}
        hasMore={hasMore}
      />

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
