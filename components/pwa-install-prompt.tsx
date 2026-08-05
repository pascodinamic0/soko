"use client";

import { useEffect, useState } from "react";

export function PwaInstallPrompt() {
  const [promptEvent, setPromptEvent] = useState<BeforeInstallPromptEvent | null>(
    null,
  );
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }

    function onBeforeInstall(e: Event) {
      e.preventDefault();
      setPromptEvent(e as BeforeInstallPromptEvent);
    }

    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    return () =>
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
  }, []);

  if (!promptEvent || dismissed) return null;

  return (
    <div className="fixed inset-x-4 bottom-24 z-50 mx-auto max-w-lg rounded-[var(--soko-radius-md)] border border-soko-line bg-soko-white p-4 shadow-[var(--soko-shadow)] md:max-w-3xl">
      <p className="text-sm font-semibold text-soko-ink">Installer Soko</p>
      <p className="mt-1 text-xs text-soko-ink-muted">
        Accédez au marché depuis votre écran d&apos;accueil.
      </p>
      <div className="mt-3 flex gap-2">
        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="flex-1 rounded-[var(--soko-radius-sm)] border border-soko-line py-2 text-xs font-medium"
        >
          Plus tard
        </button>
        <button
          type="button"
          onClick={async () => {
            await promptEvent.prompt();
            setPromptEvent(null);
            setDismissed(true);
          }}
          className="flex-1 rounded-[var(--soko-radius-sm)] bg-soko-forest py-2 text-xs font-semibold text-soko-white"
        >
          Installer
        </button>
      </div>
    </div>
  );
}

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
}

declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
  }
}
