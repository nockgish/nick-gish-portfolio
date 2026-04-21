import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Server-only client — no browser auth, safe to use in Server Components and API routes.
export const supabaseServer = createClient(supabaseUrl, supabaseAnonKey);
