import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { addPortal } from "../api/addPortal";
import { deletePortal } from "../api/deletePortal";
import { updatePortal } from "../api/updatePortal";

export default function Portals() {
  const [portals, setPortals] = useState([]);
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [editingId, setEditingId] = useState(null);

  async function loadPortals() {
    const { data } = await supabase.from("portals").select("*");
    setPortals(data || []);
  }

  async function handleAddOrUpdate() {
    if (!name || !url) return alert("Enter name and url");

    if (editingId) {
      await updatePortal(editingId, {
        portal_name: name,
        portal_url: url,
        dns: url
      });
    } else {
      await addPortal({
        portal_name: name,
        portal_url: url,
        dns: url,
        status: "active"
      });
    }

    setName("");
    setUrl("");
    setEditingId(null);
    loadPortals();
  }

  function handleEdit(portal) {
    setName(portal.portal_name);
    setUrl(portal.portal_url);
    setEditingId(portal.id);
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete portal?")) return;
    await deletePortal(id);
    loadPortals();
  }

  useEffect(() => {
    loadPortals();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>IPTV Admin Panel</h2>

      <div style={{ marginBottom: 20 }}>
        <input
          placeholder="Portal name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          placeholder="Portal URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button onClick={handleAddOrUpdate}>
          {editingId ? "Update Portal" : "Add Portal"}
        </button>
      </div>

      <ul>
        {portals.map((p) => (
          <li key={p.id}>
            {p.portal_name} – {p.portal_url}
            <button onClick={() => handleEdit(p)} style={{ marginLeft: 10 }}>
              Edit
            </button>
            <button
              onClick={() => handleDelete(p.id)}
              style={{ marginLeft: 5 }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
