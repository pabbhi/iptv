export function ping() {
  const deviceKey = localStorage.getItem("deviceKey");

  fetch(`${process.env.REACT_APP_SUPABASE_URL}/functions/v1/ping`, {
    method: "POST",
    body: JSON.stringify({ deviceKey }),
    headers: { "Content-Type": "application/json" }
  });
}
