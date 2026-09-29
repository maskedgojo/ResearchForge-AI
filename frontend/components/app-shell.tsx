import { Sidebar } from "@/components/sidebar";
import { MobileNav } from "@/components/mobile-nav";
import { SourceDrawer } from "@/components/source-drawer";
import { Topbar } from "@/components/topbar";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f8faff]">
      <Sidebar />
      <Topbar />
      <main className="min-h-[calc(100vh-4rem)] px-4 py-6 pb-24 md:px-6 lg:ml-[248px] lg:px-8 lg:py-8">
        {children}
      </main>
      <MobileNav />
      <SourceDrawer />
    </div>
  );
}
