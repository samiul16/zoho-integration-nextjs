/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function CreateContactModal({ open, setOpen, onRefresh }: any) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    First_Name: "",
    Last_Name: "",
    Account_Name: { id: "" },
    Email: "",
    Phone: "",
  });

  useEffect(() => {
    if (open)
      fetch("/api/accounts")
        .then((r) => r.json())
        .then((d) => setAccounts(d.data || []));
  }, [open]);

  const handleCreate = async () => {
    setSubmitting(true);
    setError(null);
    const res = await fetch("/api/contacts", {
      method: "POST",
      body: JSON.stringify(formData),
    });
    const data = await res.json();

    if (res.status === 409 && data.code === "DUPLICATE_EMAIL") {
      setError("A contact with this email already exists.");
      setSubmitting(false);
      return;
    }

    if (res.status === 400 && data.code === "EMAIL_REQUIRED") {
      setError("Email is required.");
      setSubmitting(false);
      return;
    }

    if (res.status === 400 && data.code === "INVALID_REQUEST") {
      setError("Invalid data. Please check your input.");
      setSubmitting(false);
      return;
    }
    if (!res.ok) {
      setError(data.message || "Failed to create");
      setSubmitting(false);
      return;
    }
    onRefresh();
    setOpen(false);
    setSubmitting(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Contact</DialogTitle>
        </DialogHeader>
        {error && (
          <p className="text-red-500 text-xs bg-red-50 p-2 rounded">{error}</p>
        )}
        <div className="space-y-3">
          <input
            placeholder="First Name *"
            required
            className="w-full p-2.5 rounded-lg border border-slate-200 text-sm focus:ring-1 focus:ring-black outline-none"
            onChange={(e) =>
              setFormData({ ...formData, First_Name: e.target.value })
            }
          />
          <input
            placeholder="Last Name *"
            required
            className="w-full p-2.5 rounded-lg border border-slate-200 text-sm focus:ring-1 focus:ring-black outline-none"
            onChange={(e) =>
              setFormData({ ...formData, Last_Name: e.target.value })
            }
          />
          <select
            className="w-full p-2.5 rounded-lg border border-slate-200 text-sm focus:ring-1 focus:ring-black outline-none"
            onChange={(e) =>
              setFormData({ ...formData, Account_Name: { id: e.target.value } })
            }
          >
            <option value="">Select Account</option>
            {accounts.map((a: any) => (
              <option key={a.id} value={a.id}>
                {a.Account_Name}
              </option>
            ))}
          </select>
          <input
            placeholder="Email *"
            required
            className="w-full p-2.5 rounded-lg border border-slate-200 text-sm focus:ring-1 focus:ring-black outline-none"
            onChange={(e) =>
              setFormData({ ...formData, Email: e.target.value })
            }
          />
          <input
            placeholder="Phone"
            className="w-full p-2.5 rounded-lg border border-slate-200 text-sm focus:ring-1 focus:ring-black outline-none"
            onChange={(e) =>
              setFormData({ ...formData, Phone: e.target.value })
            }
          />
        </div>
        <div className="flex gap-3 mt-4">
          <button
            onClick={() => setOpen(false)}
            className="w-full py-2.5 rounded-lg text-sm font-medium bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            Cancel
          </button>
          <button
            disabled={submitting}
            className="w-full bg-[#1e293b] text-white py-2.5 rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors disabled:opacity-50"
            onClick={handleCreate}
          >
            {submitting ? "Saving..." : "Save Contact"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
