import { getSupabaseEnv } from "@/lib/supabase/env";

export function mediaUrl(storagePath: string): string {
  if (storagePath.startsWith("http://") || storagePath.startsWith("https://")) {
    return storagePath;
  }

  const { url } = getSupabaseEnv();
  return `${url}/storage/v1/object/public/listing-media/${storagePath}`;
}

export function verificationDocUrl(storagePath: string): string {
  const { url } = getSupabaseEnv();
  return `${url}/storage/v1/object/authenticated/verification-docs/${storagePath}`;
}
