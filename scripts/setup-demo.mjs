#!/usr/bin/env node
/**
 * Applies Soko migrations + demo seed to hosted Supabase.
 * Requires SUPABASE_DB_PASSWORD in .env.local (Database password from dashboard).
 */
import { readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import dns from "node:dns";
import pg from "pg";

dns.setDefaultResultOrder("ipv6first");

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

function loadEnv() {
  const path = join(root, ".env.local");
  if (!existsSync(path)) {
    console.error("Missing .env.local");
    process.exit(1);
  }
  const env = {};
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    env[key] = value;
  }
  return env;
}

function projectRef(url) {
  const m = url?.match(/https:\/\/([^.]+)\.supabase\.co/);
  return m?.[1];
}

async function main() {
  const env = loadEnv();
  const ref = projectRef(env.NEXT_PUBLIC_SUPABASE_URL);
  const password = env.SUPABASE_DB_PASSWORD;

  if (!ref) {
    console.error("NEXT_PUBLIC_SUPABASE_URL invalid in .env.local");
    process.exit(1);
  }
  if (!password) {
    console.error(
      "Add SUPABASE_DB_PASSWORD to .env.local (Supabase Dashboard → Settings → Database)",
    );
    process.exit(1);
  }

  const regions = [
    "eu-west-1",
    "eu-central-1",
    "us-east-1",
    "ap-southeast-1",
    "us-west-1",
  ];

  let client;
  let lastError;

  for (const region of regions) {
    const poolerUrl = `postgresql://postgres.${ref}:${encodeURIComponent(password)}@aws-0-${region}.pooler.supabase.com:5432/postgres`;
    const directUrl = `postgresql://postgres:${encodeURIComponent(password)}@db.${ref}.supabase.co:5432/postgres`;
    for (const connectionString of [poolerUrl, directUrl]) {
      const candidate = new pg.Client({
        connectionString,
        ssl: { rejectUnauthorized: false },
      });
      try {
        await candidate.connect();
        client = candidate;
        console.log(`Connected via ${connectionString.includes("pooler") ? `pooler (${region})` : "direct"}`);
        break;
      } catch (err) {
        lastError = err;
        await candidate.end().catch(() => {});
      }
    }
    if (client) break;
  }

  if (!client) {
    console.error("\nSetup failed: could not connect to database.");
    console.error(lastError?.message ?? "Unknown error");
    process.exit(1);
  }

  const files = [
    "supabase/migrations/20260805151938_initial_schema.sql",
    "supabase/migrations/20260805160000_trust_hardening.sql",
    "supabase/migrations/20260805170000_add_city_to_locations.sql",
    "supabase/migrations/20260805180000_auth_display_names.sql",
    "supabase/seed.sql",
  ];

  try {
    for (const file of files) {
      const sql = readFileSync(join(root, file), "utf8");
      console.log(`Running ${file}…`);
      await client.query(sql);
      console.log(`  ✓ ${file}`);
    }

    const { rows } = await client.query(`
      select
        (select count(*) from public.categories) as categories,
        (select count(*) from public.listings where status = 'active') as listings,
        (select count(*) from public.conversations) as conversations,
        (select count(*) from public.messages) as messages,
        (select count(*) from public.favorites) as favorites
    `);

    console.log("\nDemo data ready:");
    console.table(rows[0]);
    console.log("\nOpen http://localhost:3000 — feed should be populated.");
  } catch (err) {
    console.error("\nSetup failed:", err.message);
    if (err.message?.includes("already exists")) {
      console.error("Schema may be partially applied. Run seed only or fix conflicts in SQL editor.");
    }
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();
