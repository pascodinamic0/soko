import { BottomNav } from "@/components/bottom-nav";
import { BrandHeader } from "@/components/brand-header";

export default function TabsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto flex min-h-full w-full max-w-lg flex-1 flex-col md:max-w-3xl">
      <BrandHeader />
      <main className="flex-1 pb-[calc(var(--soko-bottom-nav-offset)+1.5rem)]">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
