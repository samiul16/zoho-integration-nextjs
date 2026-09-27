/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Plus, Search } from "lucide-react";
import ContactsTable from "./components/ContactsTable";
import CreateContactModal from "./components/CreateContactModal";

export default function ContactsPage() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const fetchContacts = useCallback(async (pageNum: number) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/contacts?page=${pageNum}`);
      const json = await res.json();
      setContacts(json.data || []);
      setHasMore(json.info?.more_records || false);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchContacts(page);
  }, [page, fetchContacts]);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Contacts</h1>
        <button
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-2 bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 whitespace-nowrap"
        >
          <Plus size={16} /> <span>Add Contact</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-4 bg-white p-2 rounded-lg border border-slate-200">
        <div className="flex items-center px-3 text-slate-400">
          <Search size={18} />
          <input
            className="ml-2 bg-transparent outline-none text-sm w-full"
            placeholder="Search contacts..."
          />
        </div>
      </div>

      <ContactsTable
        contacts={contacts}
        loading={loading}
        page={page}
        setPage={setPage}
        hasMore={hasMore}
        router={router}
      />

      <CreateContactModal
        open={open}
        setOpen={setOpen}
        onRefresh={() => fetchContacts(page)}
      />
    </div>
  );
}
