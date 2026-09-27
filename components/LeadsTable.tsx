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
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Progress } from "./ui/progress";
import Skeleton from "./Skeleton";
import { Lead } from "@/types/lead";

export default function LeadsTable() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [progress, setProgress] = useState(0);
  const router = useRouter();

  const fetchLeads = useCallback(async (pageNum: number) => {
    setLoading(true);
    setProgress(30);
    console.log("page number in fetch leads", pageNum);
    try {
      const res = await fetch(`/api/leads?page=${pageNum}`);
      const json = await res.json();
      setProgress(100);
      setLeads(json.data || []);
      setHasMore(json.info?.more_records || false);
    } catch (err) {
      console.error("Failed to fetch", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeads(page);
  }, [page, fetchLeads]);

  return (
    <div className="w-full max-w-full">
      {/* 1. Top Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 border border-slate-200 mb-6 bg-white overflow-hidden rounded-lg">
        {[
          { label: "New Leads", val: "42", icon: Users },
          { label: "Qualified", val: "18", icon: CheckCircle2 },
          { label: "Avg Response", val: "1.8h", icon: Clock },
          { label: "Hot Leads", val: "9", icon: AlertCircle },
        ].map((item, i) => (
          <div
            key={item.label}
            className={`p-6 ${i !== 3 ? "border-r border-slate-100" : ""}`}
          >
            <div className="flex items-center gap-2 text-slate-400 mb-1">
              <item.icon size={14} />
              <p className="text-[10px] uppercase font-bold tracking-widest">
                {item.label}
              </p>
            </div>
            <p className="text-xl font-semibold">{item.val}</p>
          </div>
        ))}
      </div>

      {/* 2. Search & Add Bar */}
      <div className="flex items-center justify-between mb-4 bg-white p-2 rounded-lg border border-slate-200 shadow-sm">
        <div className="flex items-center px-3 text-slate-400 w-full">
          <Search size={18} />
          <input
            className="ml-2 bg-transparent outline-none text-sm text-black w-full"
            placeholder="Search leads..."
          />
        </div>
        <button
          onClick={() => {
            /* add logic */
          }}
          className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 whitespace-nowrap"
        >
          <Plus size={16} /> Add Lead
        </button>
      </div>

      {/* 3. Progress Bar */}
      {loading && (
        <>
          <div className="flex items-center justify-center">
            <span className="text-xl text-slate-700 mb-2">
              Fetching data from Zoho CRM
            </span>
          </div>
          <Progress value={progress} className="h-1 mb-4" />
        </>
      )}

      {/* 4. Fixed-Height Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="h-[400px] overflow-y-auto">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-slate-50 z-10 border-b border-slate-200">
              <tr className="text-[11px] uppercase tracking-wider text-slate-400">
                <th className="p-4">Customer</th>
                <th className="p-4">Company</th>
                <th className="p-4">Email</th>
                <th className="p-4">Phone</th>
              </tr>
            </thead>
            <tbody>
              {loading
                ? Array.from({ length: 8 }).map((_, i) => (
                    <tr key={i} className="border-b border-slate-50">
                      <td className="p-4">
                        <Skeleton className="h-4 w-32" />
                      </td>
                      <td className="p-4">
                        <Skeleton className="h-4 w-24" />
                      </td>
                      <td className="p-4">
                        <Skeleton className="h-4 w-40" />
                      </td>
                      <td className="p-4">
                        <Skeleton className="h-4 w-24" />
                      </td>
                    </tr>
                  ))
                : leads.map((l: Lead) => (
                    <tr
                      key={l.id}
                      className="border-b border-slate-50 hover:bg-slate-50 cursor-pointer"
                    >
                      <td className="p-4 text-sm font-medium">
                        {l.First_Name} {l.Last_Name}
                      </td>
                      {/* <td className="p-4 text-sm text-slate-600">
                        {l.Account_Name || "-"}
                      </td> */}
                      <td className="p-4 text-sm text-slate-600">{l.Email}</td>
                      <td className="p-4 text-sm text-slate-600">{l.Phone}</td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>

        {/* 5. Pagination Footer */}
        <div className="p-3 border-t border-slate-200 flex items-center justify-between bg-slate-50">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Page {page}
          </span>
          <div className="flex gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="p-2 border bg-white rounded-md hover:bg-slate-50 disabled:opacity-50"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              // disabled={!hasMore}
              onClick={() => setPage((p) => p + 1)}
              className="p-2 border bg-white rounded-md hover:bg-slate-50 disabled:opacity-50"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
