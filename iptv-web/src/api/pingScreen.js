import { supabase } from "../lib/supabase";

export async function pingScreen(deviceId, screenId) {
  const { data } = await supabase.rpc("check_screen_limit", {
    p_device_id: deviceId,
    p_screen_id: screenId
  });

  return data;
}
