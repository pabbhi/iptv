import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Portals from "./pages/Portals";
import Devices from "./pages/Devices";
import Sessions from "./pages/Sessions";
import Messages from "./pages/Messages";



function App() {
  return (
    <Router>
      <h1>IPTV Admin Panel</h1>

      <Routes>
        <Route path="/" element={<Portals />} />
        <Route path="/devices" element={<Devices />} />
	<Route path="/sessions" element={<Sessions />} />
	<Route path="/messages" element={<Messages />} />

      </Routes>
    </Router>
  );
}

export default App;
