import { createClient, SupabaseClient } from "@supabase/supabase-js";

let instance: SupabaseClient | null = null;

export function getSupabaseBrowserClient(): SupabaseClient {
  if (instance) return instance;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error(
      "Faltan variables NEXT_PUBLIC_SUPABASE_URL o NEXT_PUBLIC_SUPABASE_ANON_KEY",
    );
  }

  instance = createClient(url, key);

  return instance;
}
