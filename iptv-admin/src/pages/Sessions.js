import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function Sessions() {
  const [sessions, setSessions] = useState([]);

  async function loadSessions() {
    const { data } = await supabase
      .from("active_sessions")
      .select("*, devices(device_key)");

    setSessions(data || []);
  }

  async function killSession(id) {
    if (!window.confirm("Kill this session?")) return;

    await supabase.from("active_sessions").delete().eq("id", id);
    loadSessions();
  }

  useEffect(() => {
    loadSessions();
    const t = setInterval(loadSessions, 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>Active Sessions</h2>

      <table border="1" cellPadding="5">
        <thead>
          <tr>
            <th>Device</th>
            <th>Screen</th>
            <th>Last Ping</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {sessions.map((s) => (
            <tr key={s.id}>
              <td>{s.devices?.device_key}</td>
              <td>{s.screen_id}</td>
              <td>{new Date(s.last_ping).toLocaleTimeString()}</td>
              <td>
                <button onClick={() => killSession(s.id)}>Kill</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
