"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Building2, Mail, User, Phone } from "lucide-react";
import { Lead } from "@/types/lead";

export default function LeadDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  //retrive query params from url
  const searchParams = new URLSearchParams(window.location.search);
  const isSuccess = searchParams.get("isSuccess");

  useEffect(() => {
    const fetchLead = async () => {
      try {
        const res = await fetch(`/api/leads/${id}`); // Assuming your API supports /api/leads/[id]
        const json = await res.json();
        setLead(json.data);
      } catch (err) {
        console.error("Failed to fetch lead", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLead();
  }, [id]);

  if (loading) return <div className="p-8">Loading details...</div>;
  if (!lead) return <div className="p-8">Lead not found.</div>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <button
        onClick={() => router.back()}
        className="flex items-center text-sm text-slate-500 mb-6 hover:text-black"
      >
        <ArrowLeft size={16} className="mr-2" /> Back to Leads
      </button>

      {isSuccess && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          Lead updated successfully!
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 rounded-full bg-slate-900 text-white flex items-center justify-center text-xl font-bold">
            {lead.First_Name?.[0]}
            {lead.Last_Name?.[0]}
          </div>
          <div>
            <h1 className="text-2xl font-bold">
              {lead.First_Name} {lead.Last_Name}
            </h1>
            <p className="text-slate-500">{lead.Company}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <DetailItem
            icon={<Mail size={18} />}
            label="Email"
            value={lead.Email}
          />
          <DetailItem
            icon={<Phone size={18} />}
            label="Phone"
            value={lead.Phone || "N/A"}
          />
          <DetailItem
            icon={<Building2 size={18} />}
            label="Company"
            value={lead.Company}
          />
          <DetailItem
            icon={<User size={18} />}
            label="Lead ID"
            value={lead.id}
          />
        </div>
      </div>
    </div>
  );
}

function DetailItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg border border-slate-100">
      <div className="text-slate-400">{icon}</div>
      <div>
        <p className="text-[10px] uppercase font-bold text-slate-400">
          {label}
        </p>
        <p className="text-sm font-medium text-slate-700">{value}</p>
      </div>
    </div>
  );
}
