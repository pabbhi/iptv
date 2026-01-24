export async function getPlaylist() {
  const token = localStorage.getItem("supabase_jwt");

  const res = await fetch(
    `${process.env.REACT_APP_SUPABASE_URL}/functions/v1/getPlaylist`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  return res.json();
}
