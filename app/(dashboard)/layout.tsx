import GlassPane from "@/components/GlassPane";
import { ReactNode } from "react";
import "@/styles/globals.css";
import Sidebar from "@/components/Sidebar";
export default function DashboardRootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html>
      <head />
      <body className="h-screen w-screen candy-mesh text-white p-6">
        <GlassPane className="w-full h-full flex p-6">
          <Sidebar />
          {children}
        </GlassPane>
      </body>
    </html>
  );
}
