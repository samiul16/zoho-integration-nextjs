import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import MobileNav from "@/components/MobileNav"; // Create this helper component

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Zoho CRM Manager",
  description: "Modern CRM Dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} antialiased bg-[#F4F4F5] text-[#18181B]`}
      >
        <div className="flex h-screen overflow-hidden">
          {/* Desktop Sidebar */}
          <div className="hidden md:flex">
            <Sidebar />
          </div>

          <main className="flex-1 flex flex-col h-full overflow-hidden">
            {/* Mobile Header (Visible only on mobile) */}
            <div className="md:hidden">
              <MobileNav />
            </div>

            {/* Main content area */}
            <div className="flex-1 overflow-y-auto p-4 md:p-8">{children}</div>
          </main>
        </div>
      </body>
    </html>
  );
}
