import { createBrowserClient } from "@supabase/ssr";

export function createSupabaseFrontendClient() {
  return createBrowserClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!
  );
}