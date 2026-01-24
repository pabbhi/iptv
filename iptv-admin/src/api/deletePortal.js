import { supabase } from "../lib/supabase";

export async function deletePortal(id) {
  const { error } = await supabase
    .from("portals")
    .delete()
    .eq("id", id);

  if (error) throw error;
}
