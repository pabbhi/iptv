import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function Devices() {
  const [devices, setDevices] = useState([]);
  const [portals, setPortals] = useState([]);

  async function loadDevices() {
    const { data } = await supabase
      .from("devices")
      .select("*, portals(portal_name)");

    setDevices(data || []);
  }

  async function loadPortals() {
    const { data } = await supabase.from("portals").select("*");
    setPortals(data || []);
  }

  async function assignPortal(deviceId, portalId) {
    await supabase
      .from("devices")
      .update({ portal_id: portalId })
      .eq("id", deviceId);

    loadDevices();
  }

  useEffect(() => {
    loadDevices();
    loadPortals();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>Devices</h2>

      <table border="1" cellPadding="5">
        <thead>
          <tr>
            <th>Device Key</th>
            <th>Type</th>
            <th>Portal</th>
            <th>Assign Portal</th>
          </tr>
        </thead>
        <tbody>
          {devices.map((d) => (
            <tr key={d.id}>
              <td>{d.device_key}</td>
              <td>{d.device_type}</td>
              <td>{d.portals?.portal_name || "None"}</td>
              <td>
                <select
                  onChange={(e) => assignPortal(d.id, e.target.value)}
                  defaultValue=""
                >
                  <option value="">Select</option>
                  {portals.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.portal_name}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
