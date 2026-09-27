"use client";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"; // Assuming standard Shadcn Dialog

interface AccountModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  // We can add a refresh callback to update the table after creation
  onSuccess: () => void;
}

export default function AccountModal({
  open,
  setOpen,
  onSuccess,
}: AccountModalProps) {
  const [formData, setFormData] = useState({
    Account_Name: "",
    Phone: "",
    Website: "",
    Email: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch("/api/accounts", {
        method: "POST",
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setOpen(false);
        setFormData({ Account_Name: "", Phone: "", Website: "", Email: "" });
        onSuccess(); // Refresh the list
      }
    } catch (err) {
      console.error("Failed to create account", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Account</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase">
              Account Name
            </label>
            <input
              required
              className="w-full mt-1 p-2 border rounded-md text-sm outline-none focus:ring-2 focus:ring-slate-900"
              value={formData.Account_Name}
              onChange={(e) =>
                setFormData({ ...formData, Account_Name: e.target.value })
              }
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase">
                Phone
              </label>
              <input
                className="w-full mt-1 p-2 border rounded-md text-sm"
                value={formData.Phone}
                onChange={(e) =>
                  setFormData({ ...formData, Phone: e.target.value })
                }
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase">
                Website
              </label>
              <input
                className="w-full mt-1 p-2 border rounded-md text-sm"
                value={formData.Website}
                onChange={(e) =>
                  setFormData({ ...formData, Website: e.target.value })
                }
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase">
              Email
            </label>
            <input
              type="email"
              className="w-full mt-1 p-2 border rounded-md text-sm"
              value={formData.Email}
              onChange={(e) =>
                setFormData({ ...formData, Email: e.target.value })
              }
            />
          </div>
          <button
            disabled={submitting}
            className="w-full bg-slate-900 text-white p-2 rounded-md font-medium hover:bg-slate-800 disabled:opacity-50"
          >
            {submitting ? "Creating..." : "Save Account"}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
