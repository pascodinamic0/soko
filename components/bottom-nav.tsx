"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/", label: "Accueil", icon: HomeIcon },
  { href: "/favoris", label: "Favoris", icon: HeartIcon },
  { href: "/publier", label: "Publier", icon: PlusIcon, primary: true },
  { href: "/messages", label: "Messages", icon: ChatIcon },
  { href: "/menu", label: "Menu", icon: MenuIcon },
] as const;

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-soko-line/80 bg-soko-surface/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md"
      aria-label="Navigation principale"
    >
      <ul className="mx-auto flex h-[var(--soko-bottom-nav-height)] max-w-lg items-end justify-between px-2 pb-2 pt-1">
        {tabs.map((tab) => {
          const active =
            tab.href === "/"
              ? pathname === "/"
              : pathname.startsWith(tab.href);
          const Icon = tab.icon;

          if ("primary" in tab && tab.primary) {
            return (
              <li key={tab.href} className="-mt-5 flex flex-1 justify-center">
                <Link
                  href={tab.href}
                  className="flex flex-col items-center gap-1"
                  aria-current={active ? "page" : undefined}
                >
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-soko-amber text-soko-ink shadow-[0_6px_16px_rgb(232_163_23_/_35%)] transition-transform active:scale-95">
                    <Icon className="h-7 w-7" />
                  </span>
                  <span className="text-[11px] font-medium text-soko-ink">
                    {tab.label}
                  </span>
                </Link>
              </li>
            );
          }

          return (
            <li key={tab.href} className="flex flex-1 justify-center">
              <Link
                href={tab.href}
                className={`flex min-w-[3.5rem] flex-col items-center gap-1 px-1 py-1 transition-colors ${
                  active ? "text-soko-forest" : "text-soko-ink-muted"
                }`}
                aria-current={active ? "page" : undefined}
              >
                <Icon className="h-6 w-6" strokeWidth={active ? 2 : 1.5} />
                <span className="text-[11px] font-medium">{tab.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

function HomeIcon({
  className,
  strokeWidth = 1.5,
}: {
  className?: string;
  strokeWidth?: number;
}) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5Z"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
    </svg>
  );
}

function HeartIcon({
  className,
  strokeWidth = 1.5,
}: {
  className?: string;
  strokeWidth?: number;
}) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 5v14M5 12h14"
        stroke="currentColor"
        strokeWidth={2.25}
        strokeLinecap="round"
      />
    </svg>
  );
}

function ChatIcon({
  className,
  strokeWidth = 1.5,
}: {
  className?: string;
  strokeWidth?: number;
}) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M5 18.5 6.2 15A7.5 7.5 0 1 1 9 19.2L5 18.5Z"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MenuIcon({
  className,
  strokeWidth = 1.5,
}: {
  className?: string;
  strokeWidth?: number;
}) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M5 7h14M5 12h14M5 17h10"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </svg>
  );
}
