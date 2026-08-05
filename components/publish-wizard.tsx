"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  clearDraft,
  emptyDraft,
  loadDraft,
  saveDraft,
  type PublishDraft,
} from "@/lib/publish/draft";
import {
  compressImage,
  fileHash,
  validateImageFile,
} from "@/lib/media/compress-image";
import { formatLocationOption, groupLocationsByCity } from "@/lib/locations/display";
import type { Category, Location } from "@/lib/supabase/database.types";

type Subcategory = {
  id: string;
  category_id: string;
  slug: string;
  name_fr: string;
};

const STEPS = [
  "Photos",
  "Catégorie",
  "Détails",
  "Prix",
  "Localisation",
  "Publier",
] as const;

export function PublishWizard({
  categories,
  subcategories,
  locations,
}: {
  categories: Category[];
  subcategories: Subcategory[];
  locations: Location[];
}) {
  const router = useRouter();
  const [draft, setDraft] = useState<PublishDraft>(() =>
    typeof window === "undefined" ? emptyDraft() : loadDraft(),
  );
  const [photos, setPhotos] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    saveDraft({ ...draft, photoNames: photos.map((p) => p.name) });
  }, [draft, photos]);

  const subsForCategory = useMemo(
    () => subcategories.filter((s) => s.category_id === draft.categoryId),
    [subcategories, draft.categoryId],
  );
  const locationsByCity = useMemo(
    () => groupLocationsByCity(locations),
    [locations],
  );

  function update(partial: Partial<PublishDraft>) {
    setDraft((d) => ({ ...d, ...partial }));
  }

  function next() {
    setError(null);
    if (draft.step === 0 && photos.length === 0) {
      setError("Ajoutez au moins une photo.");
      return;
    }
    if (draft.step === 1 && !draft.categoryId) {
      setError("Choisissez une catégorie.");
      return;
    }
    if (draft.step === 2 && (!draft.title.trim() || draft.title.length < 5)) {
      setError("Titre trop court (min. 5 caractères).");
      return;
    }
    if (draft.step === 3) {
      const price = Number(draft.price);
      if (!price || price <= 0) {
        setError("Indiquez un prix valide.");
        return;
      }
    }
    if (draft.step === 4 && !draft.locationId) {
      setError("Choisissez un quartier.");
      return;
    }
    update({ step: Math.min(draft.step + 1, STEPS.length - 1) });
  }

  function back() {
    update({ step: Math.max(draft.step - 1, 0) });
  }

  async function onPhotosSelected(files: FileList | null) {
    if (!files) return;
    setError(null);
    const nextPhotos: File[] = [...photos];
    const hashes = new Set<string>();

    for (const file of Array.from(files)) {
      const validation = validateImageFile(file);
      if (validation) {
        setError(validation);
        continue;
      }
      const compressed = await compressImage(file);
      const blob = compressed instanceof Blob ? compressed : file;
      const hash = await fileHash(blob);
      if (hashes.has(hash)) {
        setError("Photo en double détectée.");
        continue;
      }
      hashes.add(hash);
      nextPhotos.push(
        new File([blob], file.name.replace(/\.\w+$/, ".jpg"), {
          type: "image/jpeg",
        }),
      );
    }

    if (nextPhotos.length > 8) {
      setError("Maximum 8 photos.");
      setPhotos(nextPhotos.slice(0, 8));
      return;
    }
    setPhotos(nextPhotos);
  }

  function publish() {
    startTransition(async () => {
      setError(null);
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/auth?next=/publier");
        return;
      }

      const { data: listing, error: listingError } = await supabase
        .from("listings")
        .insert({
          seller_id: user.id,
          category_id: draft.categoryId,
          subcategory_id: draft.subcategoryId || null,
          location_id: draft.locationId,
          title: draft.title.trim(),
          description: draft.description.trim(),
          price: Number(draft.price),
          currency: draft.currency,
          negociable: draft.negociable,
          status: "active",
          published_at: new Date().toISOString(),
        })
        .select("id")
        .single();

      if (listingError || !listing) {
        setError(listingError?.message ?? "Erreur de publication.");
        return;
      }

      for (let i = 0; i < photos.length; i++) {
        const file = photos[i];
        const path = `${user.id}/${listing.id}/${Date.now()}-${i}.jpg`;
        const { error: uploadError } = await supabase.storage
          .from("listing-media")
          .upload(path, file, { contentType: "image/jpeg", upsert: false });

        if (uploadError) {
          setError(uploadError.message);
          return;
        }

        await supabase.from("listing_media").insert({
          listing_id: listing.id,
          storage_path: path,
          sort_order: i,
          is_cover: i === 0,
        });
      }

      clearDraft();
      router.replace(`/annonce/${listing.id}`);
      router.refresh();
    });
  }

  return (
    <div className="px-4 pt-6 pb-8">
      <h1 className="font-[family-name:var(--soko-font-display)] text-2xl font-semibold">
        Vendre sur Soko
      </h1>
      <p className="mt-1 text-sm text-soko-ink-muted">
        Étape {draft.step + 1} / {STEPS.length} — {STEPS[draft.step]}
      </p>

      <div className="mt-4 flex gap-1">
        {STEPS.map((_, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full ${i <= draft.step ? "bg-soko-forest" : "bg-soko-line"}`}
          />
        ))}
      </div>

      <div className="mt-6 space-y-4">
        {draft.step === 0 ? (
          <>
            <label className="flex h-32 cursor-pointer flex-col items-center justify-center rounded-[var(--soko-radius-md)] border border-dashed border-soko-line bg-soko-surface-warm text-sm text-soko-ink-muted">
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => onPhotosSelected(e.target.files)}
              />
              Ajouter des photos
            </label>
            {photos.length > 0 ? (
              <ul className="text-sm text-soko-ink">
                {photos.map((p) => (
                  <li key={p.name}>{p.name}</li>
                ))}
              </ul>
            ) : null}
          </>
        ) : null}

        {draft.step === 1 ? (
          <>
            <select
              value={draft.categoryId}
              onChange={(e) =>
                update({ categoryId: e.target.value, subcategoryId: "" })
              }
              className="w-full rounded-[var(--soko-radius-md)] border border-soko-line bg-soko-white px-3 py-3"
            >
              <option value="">Catégorie</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name_fr}
                </option>
              ))}
            </select>
            {subsForCategory.length > 0 ? (
              <select
                value={draft.subcategoryId}
                onChange={(e) => update({ subcategoryId: e.target.value })}
                className="w-full rounded-[var(--soko-radius-md)] border border-soko-line bg-soko-white px-3 py-3"
              >
                <option value="">Sous-catégorie (optionnel)</option>
                {subsForCategory.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name_fr}
                  </option>
                ))}
              </select>
            ) : null}
          </>
        ) : null}

        {draft.step === 2 ? (
          <>
            <input
              value={draft.title}
              onChange={(e) => update({ title: e.target.value })}
              placeholder="Titre de l'annonce"
              className="w-full rounded-[var(--soko-radius-md)] border border-soko-line bg-soko-white px-3 py-3"
            />
            <textarea
              value={draft.description}
              onChange={(e) => update({ description: e.target.value })}
              placeholder="Description — état, quartier de remise, détails…"
              rows={5}
              className="w-full rounded-[var(--soko-radius-md)] border border-soko-line bg-soko-white px-3 py-3"
            />
          </>
        ) : null}

        {draft.step === 3 ? (
          <>
            <div className="flex gap-2">
              <input
                type="number"
                value={draft.price}
                onChange={(e) => update({ price: e.target.value })}
                placeholder="Prix"
                className="flex-1 rounded-[var(--soko-radius-md)] border border-soko-line bg-soko-white px-3 py-3 tabular-nums"
              />
              <select
                value={draft.currency}
                onChange={(e) =>
                  update({ currency: e.target.value as "USD" | "CDF" })
                }
                className="rounded-[var(--soko-radius-md)] border border-soko-line bg-soko-white px-3 py-3"
              >
                <option value="USD">USD</option>
                <option value="CDF">CDF</option>
              </select>
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={draft.negociable}
                onChange={(e) => update({ negociable: e.target.checked })}
              />
              Prix négociable
            </label>
          </>
        ) : null}

        {draft.step === 4 ? (
          <select
            value={draft.locationId}
            onChange={(e) => update({ locationId: e.target.value })}
            className="w-full rounded-[var(--soko-radius-md)] border border-soko-line bg-soko-white px-3 py-3"
          >
            <option value="">Ville / commune / quartier</option>
            {[...locationsByCity.entries()].map(([city, cityLocations]) => (
              <optgroup key={city} label={city}>
                {cityLocations.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {formatLocationOption(loc)}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        ) : null}

        {draft.step === 5 ? (
          <div className="rounded-[var(--soko-radius-md)] bg-soko-surface-warm px-4 py-4 text-sm">
            <p className="font-semibold">{draft.title}</p>
            <p className="mt-2 text-soko-ink-muted">{draft.description || "—"}</p>
            <p className="mt-3 font-semibold tabular-nums text-soko-forest">
              {draft.price} {draft.currency}
              {draft.negociable ? " · Négociable" : ""}
            </p>
            <p className="mt-1 text-soko-ink-muted">{photos.length} photo(s)</p>
          </div>
        ) : null}
      </div>

      {error ? <p className="mt-4 text-sm text-soko-danger">{error}</p> : null}

      <div className="mt-6 flex gap-3">
        {draft.step > 0 ? (
          <button
            type="button"
            onClick={back}
            className="h-12 flex-1 rounded-[var(--soko-radius-md)] border border-soko-line font-medium"
          >
            Retour
          </button>
        ) : null}
        {draft.step < STEPS.length - 1 ? (
          <button
            type="button"
            onClick={next}
            className="h-12 flex-1 rounded-[var(--soko-radius-md)] bg-soko-amber font-semibold text-soko-ink"
          >
            Continuer
          </button>
        ) : (
          <button
            type="button"
            onClick={publish}
            disabled={pending}
            className="h-12 flex-1 rounded-[var(--soko-radius-md)] bg-soko-forest font-semibold text-soko-white disabled:opacity-60"
          >
            {pending ? "Publication…" : "Publier l'annonce"}
          </button>
        )}
      </div>
    </div>
  );
}
