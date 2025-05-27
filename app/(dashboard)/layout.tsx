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
      <body className="h-screen w-screen bg-[linear-gradient(90deg,#ff0000,#ff9900,#ffff00,#33cc33,#3399ff,#6600cc,#ff3399)] text-white p-6">
        <GlassPane className="w-full h-full flex justify-center items-center">
          {children}
        </GlassPane>
      </body>
    </html>
  );
}
