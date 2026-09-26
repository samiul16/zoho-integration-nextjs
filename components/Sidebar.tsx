"use client";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Users, Building2, UserCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const menu = [
    { name: "Leads", path: "/leads", icon: Users },
    { name: "Contacts", path: "/contacts", icon: UserCircle },
    { name: "Accounts", path: "/accounts", icon: Building2 },
  ];

  return (
    // Inside Sidebar.tsx
    <aside className="w-64 border-r-1 border-slate-100 bg-gray-50 h-screen p-4 flex flex-col">
      {/* Logo Area */}
      <div className="flex items-center gap-3 px-2 mb-10 mt-2">
        <div className="w-8 h-8 bg-black rounded-lg text-white flex items-center justify-center font-bold text-xs">
          W
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-sm leading-none italic">
            W3SCLOUD
          </span>
          <span className="text-[10px] text-slate-400 mt-1">Free Workflow</span>
        </div>
      </div>

      {/* Navigation */}
      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2 mb-2">
        Sales Operations
      </div>
      <nav className="space-y-0.5 mb-8">
        {menu.map((item) => (
          <button
            key={item.name}
            onClick={() => router.push(item.path)}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2 rounded-md text-[13px] font-medium transition-all",
              pathname === item.path
                ? "bg-slate-100 text-black shadow-sm"
                : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
            )}
          >
            <item.icon size={16} strokeWidth={2.5} />
            {item.name}
          </button>
        ))}
      </nav>
    </aside>
  );
}
