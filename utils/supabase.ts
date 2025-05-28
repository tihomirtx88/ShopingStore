import { createClient } from "@supabase/supabase-js";


export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
export const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;
console.log("SUPABASE_URL", supabaseUrl);
console.log("SUPABASE_KEY", supabaseKey);

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey);
