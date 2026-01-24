import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function Messages() {
  const [devices, setDevices] = useState([]);
  const [deviceId, setDeviceId] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    supabase.from("devices").select("*").then(({ data }) => setDevices(data));
  }, []);

  async function send() {
    await supabase.from("messages").insert({
      device_id: deviceId,
      message: msg
    });
    setMsg("");
    alert("Sent");
  }

  return (
    <div>
      <h2>Send Message</h2>

      <select onChange={(e) => setDeviceId(e.target.value)}>
        <option value="">Select Device</option>
        {devices.map((d) => (
          <option key={d.id} value={d.id}>{d.device_key}</option>
        ))}
      </select>

      <br /><br />

      <textarea
        value={msg}
        onChange={(e) => setMsg(e.target.value)}
        placeholder="Message"
      />

      <br /><br />
      <button onClick={send}>Send</button>
    </div>
  );
}
