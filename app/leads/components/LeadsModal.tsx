/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[400px] p-6 rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">
            Create New Lead
          </DialogTitle>
        </DialogHeader>

        {error && (
          <p className="text-red-500 text-xs font-medium bg-red-50 p-2 rounded">
            {error}
          </p>
        )}

        <div className="space-y-3 mt-2">
          {["First_Name", "Last_Name", "Email", "Company", "Phone"].map(
            (field) => {
              const isMandatory = ["First_Name", "Last_Name", "Email"].includes(
                field
              );
              return (
                <input
                  key={field}
                  type={
                    field === "email"
                      ? "email"
                      : field === "Phone"
                      ? "tel"
                      : ("text" as const)
                  }
                  required={isMandatory}
                  placeholder={`${field.replace("_", " ")}${
                    isMandatory ? " *" : ""
                  }`}
                  className="w-full p-2.5 rounded-lg border border-slate-200 text-sm focus:ring-1 focus:ring-black outline-none"
                  value={formData[field as keyof typeof formData] || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, [field]: e.target.value })
                  }
                />
              );
            }
          )}
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
            {submitting ? "Saving..." : "Save Lead"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
