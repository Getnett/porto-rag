import { createClient } from "@supabase/supabase-js";
import { toast } from "sonner";

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
);

export async function signUp(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      toast.error("Error signing up. Please try again.");
      // TODO : Add logging for error details
      return null;
    }

    return data;
  } catch {
    toast.error("Error signing up. Please try again.");
    // TODO : Add logging for error details
    return null;
  }
}

export async function signIn(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast.error("Error signing in. Please try again.");
      // TODO : Add logging for error details
      return null;
    }

    return data;
  } catch {
    toast.error("Error signing in. Please try again.");

    return null;
  }
}

export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Error signing out. Please try again.");
      // TODO : Add logging for error details
    }
  } catch {
    toast.error("Error signing out. Please try again.");
    // TODO : Add logging for error details
  }
}
