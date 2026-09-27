/* eslint-disable @typescript-eslint/no-explicit-any */
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Contact from "@/types/contacts";

export default function ContactsTable({
  contacts,
  loading,
  page,
  setPage,
  hasMore,
  router,
}: {
  contacts: Contact[];
  loading: boolean;
  page: number;
  setPage: (page: number) => void;
  hasMore: boolean;
  router: any;
}) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
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
              <th className="p-4">Customer</th>
              <th className="p-4">Account</th>
              <th className="p-4">Email</th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i}>
                    <td colSpan={3} className="p-4">
                      <Skeleton className="h-4 w-full" />
                    </td>
                  </tr>
                ))
              : contacts.map(
                  (c: {
                    id: string;
                    First_Name: string;
                    Last_Name: string;
                    Account_Name: string | { name: string };
                    Email: string;
                  }) => (
                    <tr
                      key={c.id}
                      className="border-b hover:bg-slate-50 cursor-pointer"
                      onClick={() => router.push(`/contacts/${c.id}`)}
                    >
                      <td className="p-4 text-sm font-medium">
                        {c.First_Name} {c.Last_Name}
                      </td>
                      <td className="p-4 text-sm text-slate-600">
                        {typeof c.Account_Name === "object"
                          ? c.Account_Name?.name
                          : c.Account_Name}
                      </td>
                      <td className="p-4 text-sm text-slate-600">{c.Email}</td>
                    </tr>
                  )
                )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-3 border-t border-slate-200 flex items-center justify-between bg-slate-50">
        <span className="text-[11px] font-bold text-slate-400 uppercase">
          Page {page}
        </span>
        <div className="flex gap-2">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="p-2 border bg-white rounded-md hover:bg-slate-50 disabled:opacity-50"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() => setPage(page + 1)}
            className="p-2 border bg-white rounded-md hover:bg-slate-50 disabled:opacity-50"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
