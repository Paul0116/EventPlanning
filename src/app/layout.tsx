import type { Metadata } from "next";
import type { ReactNode } from "react";
import { RootProviders } from "@/components/root-providers";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Gatherly",
    template: "%s · Gatherly",
  },
  description: "Plan events, tasks, budgets, guests, and schedules in one private workspace.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <a
          href="#main-content"
          className="fixed left-3 top-3 z-50 -translate-y-24 rounded-lg bg-slate-950 px-4 py-2 text-white focus:translate-y-0"
        >
          Skip to content
        </a>
        <RootProviders>{children}</RootProviders>
      </body>
    </html>
  );
}
