"use client";
import { Lead } from "@/types/lead";
import { Progress } from "@/components/ui/progress";
import Skeleton from "@/components/Skeleton";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

interface Props {
  leads: Lead[];
  loading: boolean;
  page: number;
  setPage: (p: number | ((prev: number) => number)) => void;
  hasMore: boolean;
}

export default function LeadsTable({
  leads,
  loading,
  page,
  setPage,
  hasMore,
}: Props) {
  const router = useRouter();
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Loading Progress add text fetching from Zoho */}
      {loading && (
        <div className="flex flex-col items-center justify-center p-4">
          {/* Text at the top */}
          <span className="text-xs font-medium text-slate-500 uppercase tracking-widest mb-2">
            Fetching from Zoho...
          </span>

          {/* Progress bar below text */}
          <Progress value={50} className="h-1 w-full max-w-sm rounded-full" />
        </div>
      )}

      <div className="h-[400px] overflow-y-auto">
        <table className="w-full text-left border-collapse">
          <thead className="sticky top-0 bg-slate-50 z-10 border-b border-slate-200">
            <tr className="text-[11px] uppercase tracking-wider text-slate-400">
              <th className="p-4">Customer ID</th>
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
                    onClick={() => router.push(`/leads/${l.id}`)}
                  >
                    <td className="p-4 text-sm font-medium">{l.id}</td>
                    <td className="p-4 text-sm font-medium">
                      {l.First_Name} {l.Last_Name}
                    </td>
                    <td className="p-4 text-sm text-slate-600">
                      {l.Company || "-"}
                    </td>
                    <td className="p-4 text-sm text-slate-600">{l.Email}</td>
                    <td className="p-4 text-sm text-slate-600">{l.Phone}</td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
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
            onClick={() => setPage((p) => p + 1)}
            className="p-2 border bg-white rounded-md hover:bg-slate-50 disabled:opacity-50"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
