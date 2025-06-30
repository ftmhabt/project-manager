import GlassPane from "@/components/GlassPane";
import { ReactNode } from "react";
import "@/styles/globals.css";
export default function DashboardRootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html>
      <head />
      <body className="h-screen w-screen candy-mesh text-white p-6">
        <GlassPane className="w-full h-full flex justify-center items-center">
          {children}
        </GlassPane>
      </body>
    </html>
  );
}
