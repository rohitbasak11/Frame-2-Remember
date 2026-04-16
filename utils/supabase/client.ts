import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    if (process.env.NODE_ENV === "development") {
      console.error("Supabase environment variables are missing!");
    }
    // Return a dummy client that will fail on use rather than null, 
    // or handle at the call site. For browser client, we can return null if we type it correctly.
    return null;
  }

  return createBrowserClient(url, key);
}
