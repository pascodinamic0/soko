"use client";

import { FormEvent } from "react";
import { useRouter } from "next/navigation";

export function SearchForm({
  defaultValue = "",
  className = "",
}: {
  defaultValue?: string;
  className?: string;
}) {
  const router = useRouter();

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const q = String(formData.get("q") ?? "").trim();
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    router.push(`/recherche${params.toString() ? `?${params}` : ""}`);
  }

  return (
    <form onSubmit={onSubmit} className={className}>
      <label className="flex items-center gap-2 rounded-[var(--soko-radius-md)] bg-soko-white px-3 py-3 text-soko-ink shadow-[var(--soko-shadow)]">
        <SearchIcon />
        <span className="sr-only">Rechercher</span>
        <input
          type="search"
          name="q"
          defaultValue={defaultValue}
          placeholder="Rechercher sur Soko…"
          className="w-full bg-transparent text-sm outline-none placeholder:text-soko-ink-muted"
        />
      </label>
    </form>
  );
}

function SearchIcon() {
  return (
    <svg
      className="h-5 w-5 shrink-0 text-soko-ink-muted"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="m16 16 4 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
