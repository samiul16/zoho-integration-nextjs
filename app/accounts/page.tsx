/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import { useState, useEffect, useCallback } from "react";
import { Plus, Search, Building2 } from "lucide-react";
import AccountsTable from "./components/AccountsTable";
import AccountModal from "./components/AccountModal";

export default function AccountsPage() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);

  const fetchAccounts = useCallback(async (pageNum: number) => {
    setLoading(true);
    const res = await fetch(`/api/accounts?page=${pageNum}`);
    const json = await res.json();
    setAccounts(json.data || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAccounts(page);
  }, [page, fetchAccounts]);

  return (
    <div className="p-6">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Accounts</h1>
        <button
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 whitespace-nowrap"
        >
          <Plus size={16} /> <span>Add Account</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-4 bg-white p-2 rounded-lg border border-slate-200">
        <div className="flex items-center px-3 text-slate-400">
          <Search size={18} />
          <input
            className="ml-2 bg-transparent outline-none text-sm w-full"
            placeholder="Search accounts..."
          />
        </div>
      </div>

      <AccountsTable
        accounts={accounts}
        loading={loading}
        page={page}
        setPage={setPage}
        hasMore={false}
      />

      <AccountModal
        open={open}
        setOpen={setOpen}
        onSuccess={() => fetchAccounts(page)}
      />
    </div>
  );
}
