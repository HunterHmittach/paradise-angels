import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

//  Belangrijk: auth state listener
export const onAuthStateChange = (callback: () => void) => {
  supabase.auth.onAuthStateChange(() => {
    callback();
  });
};

export default supabase;
