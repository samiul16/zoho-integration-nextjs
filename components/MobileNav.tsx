"use client";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import Sidebar from "./Sidebar";

export default function MobileNav() {
  const [open, setOpen] = useState(false);
  return (
    <div className="p-4 bg-white border-b flex items-center justify-between">
      <span className="font-bold">W3SCLOUD</span>
      <button onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>

      {open && (
        <div className="fixed inset-0 top-14 bg-white z-50 p-4">
          <Sidebar />
        </div>
      )}
    </div>
  );
}
