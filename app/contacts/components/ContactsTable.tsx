/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useEffect } from "react";
import { Plus, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import CreateContactModal from "./CreateContactModal";
import Skeleton from "@/components/Skeleton"; // Ensure this path is correct
import { Progress } from "@/components/ui/progress";

type Contact = {
  id: string;
  First_Name: string;
  Last_Name: string;
  Account_Name: { name: string; id: string } | string | null;
  Email: string;
};

export default function ContactsTable() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [formData, setFormData] = useState({
    First_Name: "",
    Last_Name: "",
    Account_Name: "",
    Email: "",
    Phone: "",
    Account_Id: "",
  });

  const router = useRouter();

  const toggleSelect = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const next = new Set(selectedIds);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelectedIds(next);
  };

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/contacts");
      const json = await res.json();
      if (res.ok) setContacts(json.data || []);
    } catch (error) {
      console.error("Failed to fetch contacts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleCreate = async () => {
    if (!formData.First_Name || !formData.Last_Name || !formData.Email) {
      setError("Please fill in all required fields.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.status === 409 && data.code === "DUPLICATE_EMAIL") {
        toast.error("Duplicate Contact", {
          description: "This email already exists in Zoho CRM.",
        });
        return;
      }

      if (!res.ok) throw new Error(data.message || "Failed to create contact.");

      router.push(`/contacts/${data.record.id}?isSuccess=true`);
      setOpen(false);
      fetchContacts();
      setFormData({
        First_Name: "",
        Last_Name: "",
        Account_Name: "",
        Email: "",
        Phone: "",
        Account_Id: "",
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-full">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4 bg-white p-2 rounded-lg border border-slate-200">
          <div className="flex items-center px-3 text-slate-400 w-full md:w-auto">
            <Search size={18} />
            <input
              className="ml-2 bg-transparent outline-none text-sm text-black w-full"
              placeholder="Search contacts..."
            />
          </div>
          <button
            onClick={() => setOpen(true)}
            className="flex items-center gap-2 bg-[#1e293b] text-white px-3 py-2 md:px-4 rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors"
          >
            <Plus size={16} />{" "}
            <span className="hidden md:inline">Add Contact</span>
          </button>
        </div>

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

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-x-auto">
          <table className="w-full min-w-[600px] text-left border-collapse">
            <thead>
              <tr className="text-[11px] uppercase tracking-wider text-slate-400 bg-slate-50 border-b border-slate-200">
                <th className="p-4 w-10">
                  <input type="checkbox" className="rounded" disabled />
                </th>
                <th className="p-4">Customer</th>
                <th className="p-4">Account</th>
                <th className="p-4">Email</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-slate-100">
                    <td className="p-4">
                      <Skeleton className="w-4 h-4" />
                    </td>
                    <td className="p-4 flex items-center gap-3">
                      <Skeleton className="w-8 h-8 rounded-full" />
                      <Skeleton className="w-32 h-4" />
                    </td>
                    <td className="p-4">
                      <Skeleton className="w-24 h-4" />
                    </td>
                    <td className="p-4">
                      <Skeleton className="w-40 h-4" />
                    </td>
                  </tr>
                ))
              ) : contacts.length > 0 ? (
                contacts.map((c, idx) => (
                  <tr
                    key={c.id}
                    className={`${
                      idx % 2 === 0 ? "bg-white" : "bg-slate-50/50"
                    } border-b border-slate-100 transition-colors cursor-pointer hover:bg-slate-50`}
                    onClick={() => router.push(`/contacts/${c.id}`)}
                  >
                    <td className="p-4">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(c.id)}
                        onChange={(e) => toggleSelect(c.id, e as any)}
                        className="rounded text-indigo-600"
                      />
                    </td>
                    <td className="p-4 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-500 uppercase shrink-0">
                        {c.First_Name?.[0] || "?"}
                        {c.Last_Name?.[0] || "?"}
                      </div>
                      <span className="font-semibold text-sm truncate">
                        {c.First_Name} {c.Last_Name}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-slate-600 truncate">
                      {typeof c.Account_Name === "object" &&
                      c.Account_Name !== null
                        ? (c.Account_Name as any).name
                        : c.Account_Name}
                    </td>
                    <td className="p-4 text-sm text-slate-600 truncate">
                      {c.Email}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={4}
                    className="p-8 text-center text-slate-400 text-sm"
                  >
                    No contacts found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <CreateContactModal
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
