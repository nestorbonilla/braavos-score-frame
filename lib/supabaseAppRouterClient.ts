import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export function createSupabaseAppServerClient(serverComponent = false) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        get(name) {
          return cookies().get(name)?.value;
        },
        set(name, value, options) {
          if (serverComponent) return;
          cookies().set(name, value, options);
        },
        remove(name, options) {
          if (serverComponent) return;
          cookies().set(name, "", options);
        }
      }
    }
  );
}