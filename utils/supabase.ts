import { useSession } from "@clerk/nextjs";
import { createClient, SupabaseClient  } from "@supabase/supabase-js";
import { useMemo } from "react";


export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
export const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;


if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

export function useClerkSupabaseClient(): SupabaseClient {
  const { session } = useSession();
  

    const supabase = useMemo(() => {
    return createClient(supabaseUrl!, supabaseKey!, {
      global: {
        fetch: async (input, init = {}) => {
          const token = await session?.getToken({ template: "supabase" });
          const headers = new Headers(init.headers);
          if (token) {
            headers.set("Authorization", `Bearer ${token}`);
          }
          return fetch(input, { ...init, headers });
        },
      },
    });
  }, [session]);

  return supabase;
}
