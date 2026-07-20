import { createClient, SupabaseClient } from "@supabase/supabase-js";

let instance: SupabaseClient | null = null;

export function getSupabaseServerClient(): SupabaseClient {
  if (instance) return instance;

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY;

  if (!url || !key) {
    throw new Error("Faltan variables SUPABASE_URL o SUPABASE_SERVICE_KEY");
  }

  instance = createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  return instance;
}
