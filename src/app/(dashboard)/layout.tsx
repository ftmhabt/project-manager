import GlassPane from "@/components/GlassPane";
import { ReactNode } from "react";
import "@/styles/globals.css";
import Sidebar from "@/components/home/Sidebar";
export default function DashboardRootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html>
      <head />
      <body className="h-screen w-screen candy-mesh text-white p-3 md:p-6">
        <GlassPane className="rounded-4xl w-full h-full flex p-3 md:p-6 pr-0 md:flex-row flex-col-reverse">
          <Sidebar />
          {children}
        </GlassPane>
        <div id="modal"></div>
      </body>
    </html>
  );
}
