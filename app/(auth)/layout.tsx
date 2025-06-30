import GlassPane from "@/components/GlassPane";
import { ReactNode } from "react";
import "@/styles/globals.css";
export default function AuthRootLayout({ children }: { children: ReactNode }) {
  return (
    <html>
      <head />
      <body className="h-screen w-screen pastel-mesh text-white p-6">
        <GlassPane className="w-full h-full flex justify-center items-center">
          {children}
        </GlassPane>
      </body>
    </html>
  );
}
