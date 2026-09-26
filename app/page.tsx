"use client";
import { Card, CardContent } from "@/components/ui/card";
import LeadsTable from "@/components/LeadsTable"; // Assume you'll update this to shadcn table
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();
  useEffect(() => {
    console.log("Dashboard mounted");
    router.push("/leads");
  }, []);
  return (
    <div className="p-8">
      {/* Header Metrics */}
      {/* <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: "New Leads", val: "42", trend: "+12%" },
          { label: "Qualified", val: "18", trend: "+4.2%" },
          { label: "Avg Response", val: "1.8h", trend: "-15%" },
          { label: "Hot Leads", val: "9", trend: "-2%" },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4 pt-4">
              <p className="text-slate-500 text-xs uppercase">{stat.label}</p>
              <div className="flex items-end gap-2 mt-1">
                <h3 className="text-2xl font-bold">{stat.val}</h3>
                <span className="text-green-500 text-xs font-medium">
                  {stat.trend}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div> */}

      {/* Main Table Container */}
      {/* <div className="bg-white rounded-xl border shadow-sm">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="font-semibold text-lg">Leads 248</h2>
          <button className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium">
            + Add Lead
          </button>
        </div>
        <LeadsTable />
      </div> */}
    </div>
  );
}
