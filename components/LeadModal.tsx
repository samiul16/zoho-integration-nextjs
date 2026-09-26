/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export default function LeadModal({
  open,
  setOpen,
  formData,
  setFormData,
  handleCreate,
  submitting,
  error,
}: any) {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 bg-black/20 z-50 flex items-center justify-center p-4">
          <motion.div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Create New Lead</h2>
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
              {["First_Name", "Last_Name", "Company", "Email", "Phone"].map(
                (field) => (
                  <input
                    key={field}
                    required={field !== "Phone"}
                    placeholder={field.replace("_", " ")}
                    className="w-full p-2.5 rounded-lg border border-slate-200 text-sm focus:ring-1 focus:ring-black outline-none"
                    value={formData[field as keyof typeof formData]}
                    onChange={(e) =>
                      setFormData({ ...formData, [field]: e.target.value })
                    }
                  />
                )
              )}
            </div>

            <div className="flex gap-3 mt-6">
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
                {submitting ? "Saving..." : "Save Lead"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
