"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, FileText, Library, PlusCircle, ShieldCheck } from "lucide-react";

const ITEMS = [
  { href: "/", label: "New", icon: PlusCircle },
  { href: "/findings", label: "Findings", icon: BookOpen },
  { href: "/critique", label: "Critic", icon: ShieldCheck },
  { href: "/report", label: "Report", icon: FileText },
  { href: "/sources", label: "Sources", icon: Library }
] as const;

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 grid grid-cols-5 border-t border-slate-200 bg-white/95 px-1 pb-[max(0.4rem,env(safe-area-inset-bottom))] pt-1.5 backdrop-blur lg:hidden">
      {ITEMS.map((item) => {
        const Icon = item.icon;
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center gap-1 rounded-lg px-1 py-1.5 text-[10px] font-medium ${
              active ? "text-indigo-700" : "text-slate-500"
            }`}
          >
            <Icon size={17} />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
