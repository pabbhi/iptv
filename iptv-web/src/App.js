import { useEffect, useState } from "react";
import { registerDevice } from "./api/registerDevice";
import { getPlaylist } from "./api/getPlaylist";
import { ping } from "./api/ping"; // device-level keep-alive
import { pingScreen } from "./api/pingScreen"; // screen-level limit enforcement
import { supabase } from "./supabaseClient"; // make sure this path is correct

function App() {
  const [data, setData] = useState(null);
  const [deviceId, setDeviceId] = useState(null);

  // ------------------------
  // STEP 0: VPN check
  // ------------------------
  useEffect(() => {
    const checkVPN = async () => {
      try {
        const { data, error } = await supabase
          .from("settings")
          .select("value")
          .eq("key", "vpn_required")
          .single();

        if (error) {
          console.error("VPN check error:", error);
          return;
        }

        if (data?.value === "on") {
          alert("Please enable VPN");
          // Optional: stop app initialization
          // document.body.innerHTML = "<h1>VPN required</h1>";
        }
      } catch (err) {
        console.error("VPN check failed", err);
      }
    };

    checkVPN();
  }, []);

  // ------------------------
  // STEP 1: Check for maintenance mode
  // ------------------------
  useEffect(() => {
    const checkMaintenance = async () => {
      try {
        const { data, error } = await supabase
          .from("settings")
          .select("value")
          .eq("key", "maintenance")
          .single();

        if (error) {
          console.error("Error fetching maintenance status:", error);
          return;
        }

        if (data?.value === "on") {
          document.body.innerHTML = "<h1>Maintenance mode</h1>";
          return; // stop further app initialization
        }
      } catch (err) {
        console.error("Maintenance check failed", err);
      }
    };

    checkMaintenance();
  }, []);

  // ------------------------
  // STEP 2: Register device & load playlist
  // ------------------------
  useEffect(() => {
    const loadApp = async () => {
      const id = await registerDevice(); // returns deviceId and maybe stores in localStorage
      setDeviceId(id);

      const playlist = await getPlaylist();
      setData(playlist);
    };

    loadApp();
  }, []);

  // ------------------------
  // STEP 3: Device-level keep-alive
  // ------------------------
  useEffect(() => {
    if (!deviceId) return;

    const interval = setInterval(async () => {
      try {
        await ping(deviceId);
      } catch (err) {
        console.error("Device ping failed", err);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [deviceId]);

  // ------------------------
  // STEP 4: Screen-level limit enforcement
  // ------------------------
  useEffect(() => {
    if (!deviceId) return;

    const screenId = crypto.randomUUID();

    const interval = setInterval(async () => {
      try {
        const ok = await pingScreen(deviceId, screenId);
        if (!ok) {
          alert("Screen limit reached");
          window.location.reload();
        }
      } catch (err) {
        console.error("Screen ping failed", err);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [deviceId]);

  // ------------------------
  // STEP 5: Show active announcement
  // ------------------------
  useEffect(() => {
    const fetchAnnouncement = async () => {
      try {
        const { data, error } = await supabase
          .from("announcements")
          .select("*")
          .eq("is_active", true)
          .order("created_at", { ascending: false })
          .limit(1);

        if (error) {
          console.error("Error fetching announcement:", error);
          return;
        }

        if (data?.length) {
          alert(data[0].message); // replace with a UI banner if you like
        }
      } catch (err) {
        console.error("Announcement fetch failed", err);
      }
    };

    fetchAnnouncement();
  }, []);

  // ------------------------
  // STEP 6: Receive messages
  // ------------------------
  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const { data, error } = await supabase
          .from("messages")
          .select("*")
          .eq("is_read", false)
          .limit(1);

        if (error) {
          console.error("Error fetching messages:", error);
          return;
        }

        if (data?.length) {
          const message = data[0];
          alert(message.message);

          // Mark as read
          await supabase
            .from("messages")
            .update({ is_read: true })
            .eq("id", message.id);
        }
      } catch (err) {
        console.error("Message fetch failed", err);
      }
    };

    const interval = setInterval(fetchMessage, 5000); // poll every 5s

    return () => clearInterval(interval);
  }, []);

  // ------------------------
  // RENDER
  // ------------------------
  return (
    <div style={{ background: "black", color: "white", padding: 20 }}>
      <h3>Live Channels: {data?.live?.length || 0}</h3>
      <h3>VODs: {data?.vods?.length || 0}</h3>
      <h3>TV Shows: {data?.shows?.length || 0}</h3>
    </div>
  );
}

export default App;
