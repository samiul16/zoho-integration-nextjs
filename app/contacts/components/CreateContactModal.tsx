/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export default function CreateContactModal({
  open,
  setOpen,
  formData,
  setFormData,
  handleCreate,
  submitting,
  error,
}: any) {
  const [accounts, setAccounts] = useState<
    { id: string; Account_Name: string }[]
  >([]);

  useEffect(() => {
    if (open) {
      fetch("/api/accounts")
        .then((res) => res.json())
        .then((data) => setAccounts(data.data || []));
    }
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 bg-black/20 z-50 flex items-center justify-center p-4">
          <motion.div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Create New Contact</h2>
              <button
                onClick={() => setOpen(false)}
                className="text-slate-400 hover:text-black"
              >
                <X size={20} />
              </button>
            </div>

            {error && (
              <p className="text-red-500 text-xs mb-3 font-medium">{error}</p>
            )}

            <div className="space-y-3">
              <input
                placeholder="First Name"
                className="w-full p-2.5 rounded-lg border text-sm outline-none"
                value={formData.First_Name}
                onChange={(e) =>
                  setFormData({ ...formData, First_Name: e.target.value })
                }
              />
              <input
                placeholder="Last Name"
                className="w-full p-2.5 rounded-lg border text-sm outline-none"
                value={formData.Last_Name}
                onChange={(e) =>
                  setFormData({ ...formData, Last_Name: e.target.value })
                }
              />

              {/* Account Dropdown */}
              <select
                className="w-full p-2.5 rounded-lg border border-slate-200 text-sm outline-none bg-white"
                value={formData.Account_Id}
                onChange={(e) =>
                  setFormData({ ...formData, Account_Id: e.target.value })
                }
              >
                <option value="">Select Account</option>
                {accounts.map((acc) => (
                  <option key={acc.id} value={acc.id}>
                    {acc.Account_Name}
                  </option>
                ))}
              </select>

              <input
                placeholder="Email"
                className="w-full p-2.5 rounded-lg border text-sm outline-none"
                value={formData.Email}
                onChange={(e) =>
                  setFormData({ ...formData, Email: e.target.value })
                }
              />
              <input
                placeholder="Phone"
                className="w-full p-2.5 rounded-lg border text-sm outline-none"
                value={formData.Phone}
                onChange={(e) =>
                  setFormData({ ...formData, Phone: e.target.value })
                }
              />
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setOpen(false)}
                className="w-full py-2.5 rounded-lg text-sm font-medium bg-slate-100 hover:bg-slate-200"
              >
                Cancel
              </button>
              <button
                disabled={submitting}
                className="w-full bg-[#1e293b] text-white py-2.5 rounded-lg text-sm font-medium hover:bg-slate-800 disabled:opacity-50"
                onClick={handleCreate}
              >
                {submitting ? "Saving..." : "Save Contact"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
