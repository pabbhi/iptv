import { supabase } from "../lib/supabase";

export async function addPortal(portal) {
  const { data, error } = await supabase
    .from("portals")
    .insert([portal])
    .select();

  if (error) throw error;
  return data;
}
