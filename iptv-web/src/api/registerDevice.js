import { getDeviceKey } from "../utils/device";

export async function registerDevice() {
  const deviceKey = getDeviceKey();

  const res = await fetch(
    `${process.env.REACT_APP_SUPABASE_URL}/functions/v1/registerDevice`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        deviceKey,
        deviceType: "web"
      })
    }
  );

  const data = await res.json();
  localStorage.setItem("supabase_jwt", data.token);
  return data;
}
