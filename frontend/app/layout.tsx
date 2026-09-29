import type { Metadata } from "next";

import "./globals.css";

import { ResearchProvider } from "@/context/research-context";

export const metadata: Metadata = {
  title: "ResearchForge AI",
  description:
    "A multi-agent AI research workspace for evidence-backed, self-refining research reports."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <ResearchProvider>{children}</ResearchProvider>
      </body>
    </html>
  );
}
