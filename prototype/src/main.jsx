import React from "react";
import { useState } from "react";
import ReactDOM from "react-dom/client";
import FinPilotAdmin from "../finpilot-admin-portal.jsx";
import FinPilotV3 from "../finpilot-prototype-v3.jsx";

function Launcher() {
  const [view, setView] = useState("admin");

  const buttonStyle = (active) => ({
    border: "none",
    borderRadius: 999,
    padding: "10px 14px",
    fontSize: 13,
    fontWeight: 700,
    cursor: "pointer",
    background: active ? "#0E1C2B" : "#E8EEF2",
    color: active ? "#FFFFFF" : "#0E1C2B",
  });

  return (
    <div style={{ minHeight: "100vh", background: "#DCE5EA", padding: 16, boxSizing: "border-box" }}>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center", marginBottom: 16 }}>
        <div style={{ fontSize: 14, fontWeight: 800, color: "#0E1C2B" }}>FinPilot view</div>
        <button type="button" style={buttonStyle(view === "admin")} onClick={() => setView("admin")}>Admin</button>
        <button type="button" style={buttonStyle(view === "v3")} onClick={() => setView("v3")}>Prototype v3</button>
      </div>

      {view === "admin" && <FinPilotAdmin />}
      {view === "v3" && <FinPilotV3 />}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Launcher />
  </React.StrictMode>
);
