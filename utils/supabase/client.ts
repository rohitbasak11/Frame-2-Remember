import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    // During static prerendering on Vercel, env vars may not be injected.
    // Return a dummy that won't be used (page is client-side only).
    return null as any;
  }

  return createBrowserClient(url, key);
}
