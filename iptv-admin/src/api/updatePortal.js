import { supabase } from "../lib/supabase";

export async function updatePortal(id, updates) {
  const { error } = await supabase
    .from("portals")
    .update(updates)
    .eq("id", id);

  if (error) throw error;
}
