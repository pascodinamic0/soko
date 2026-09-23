"use client";

export function DemoButtons() {
  async function signIn(role: "buyer" | "seller") {
    const res = await fetch("/demo/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    });
    if (res.ok) {
      window.location.href = role === "seller" ? "/publier" : "/messages";
    } else {
      alert("La connexion démo a échoué. Vérifiez les variables DEMO_*.");
    }
  }

  return (
    <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
      <button
        type="button"
        onClick={() => signIn("buyer")}
        className="h-12 rounded-[var(--soko-radius-md)] bg-soko-forest font-semibold text-soko-white"
      >
        Essayer comme acheteur
      </button>
      <button
        type="button"
        onClick={() => signIn("seller")}
        className="h-12 rounded-[var(--soko-radius-md)] bg-soko-amber font-semibold text-soko-ink"
      >
        Essayer comme vendeur
      </button>
      <p className="col-span-full text-xs text-soko-ink-muted">
        Configurez <code>DEMO_BUYER_EMAIL</code>, <code>DEMO_BUYER_PASSWORD</code>,
        <code> DEMO_SELLER_EMAIL</code>, <code>DEMO_SELLER_PASSWORD</code> pour
        activer la connexion démo.
      </p>
    </div>
  );
}

