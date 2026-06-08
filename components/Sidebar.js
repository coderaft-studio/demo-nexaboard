"use client";
import { useState } from "react";

const NEON = "#00ff88";
const PINK = "#ff2d78";
const BG   = "#050510";
const TEXT = "#e0e8ff";
const MUTED = "rgba(224,232,255,0.35)";

const menus = [
  { icon: "⊞", label: "Dashboard",   id: "dashboard" },
  { icon: "⬡", label: "Produk",      id: "produk" },
  { icon: "◈", label: "Pesanan",     id: "pesanan" },
  { icon: "◎", label: "Pelanggan",   id: "pelanggan" },
  { icon: "▦", label: "Laporan",     id: "laporan" },
  { icon: "◉", label: "Pengaturan",  id: "pengaturan" },
];

export default function Sidebar({ active, setActive }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className="flex flex-col transition-all duration-300 flex-shrink-0"
      style={{
        width: collapsed ? "64px" : "220px",
        minHeight: "100vh",
        background: BG,
        borderRight: "1px solid rgba(0,255,136,0.08)",
        position: "relative",
        zIndex: 10,
      }}>

      {/* Logo */}
      <div className="h-16 flex items-center px-4 gap-3 flex-shrink-0"
        style={{ borderBottom: "1px solid rgba(0,255,136,0.08)" }}>
        <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center font-black text-sm"
          style={{ background: "rgba(0,255,136,0.12)", border: `1px solid ${NEON}`, color: NEON, boxShadow: `0 0 12px rgba(0,255,136,0.3)` }}>
          CB
        </div>
        {!collapsed && (
          <span className="font-black text-sm tracking-wide" style={{ color: TEXT }}>
            Coderaft<span style={{ color: NEON }}>Board</span>
          </span>
        )}

        {/* Floating toggle pill — nempel di border kanan sidebar */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          style={{
            position: "absolute", right: "-11px", top: "22px",
            width: "22px", height: "22px", borderRadius: "50%",
            background: BG, border: "1px solid rgba(0,255,136,0.3)",
            color: NEON, cursor: "pointer", zIndex: 20, fontSize: "8px",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 0 8px rgba(0,255,136,0.15)",
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = NEON; e.currentTarget.style.boxShadow = `0 0 10px rgba(0,255,136,0.4)`; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(0,255,136,0.3)"; e.currentTarget.style.boxShadow = "0 0 8px rgba(0,255,136,0.15)"; }}>
          {collapsed ? "▶" : "◀"}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-2 space-y-1">
        {menus.map((m) => {
          const isActive = active === m.id;
          return (
            <button key={m.id} onClick={() => setActive(m.id)}
              className="w-full flex items-center gap-3 px-3 py-2.5 transition-all text-left"
              style={{
                background: isActive ? "rgba(0,255,136,0.1)" : "transparent",
                border: "none",
                cursor: "pointer",
                color: isActive ? NEON : MUTED,
                borderLeft: isActive ? `2px solid ${NEON}` : "2px solid transparent",
                boxShadow: isActive ? "inset 0 0 20px rgba(0,255,136,0.05)" : "none",
              }}
              onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = "rgba(0,255,136,0.05)"; e.currentTarget.style.color = TEXT; } }}
              onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = MUTED; } }}>
              <span className="text-base flex-shrink-0" style={{ filter: isActive ? `drop-shadow(0 0 6px ${NEON})` : "none" }}>{m.icon}</span>
              {!collapsed && (
                <span className="text-xs font-semibold tracking-wide">{m.label}</span>
              )}
              {!collapsed && isActive && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full" style={{ background: NEON, boxShadow: `0 0 8px ${NEON}` }} />
              )}
            </button>
          );
        })}
      </nav>

      {/* Divider */}
      <div style={{ height: "1px", background: "rgba(0,255,136,0.06)", margin: "0 16px" }} />

      {/* User */}
      <div className="p-4 flex items-center gap-3" style={{ justifyContent: collapsed ? "center" : "flex-start" }}>
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0"
          style={{ background: "rgba(255,45,120,0.15)", border: `1px solid ${PINK}`, color: PINK, boxShadow: `0 0 10px rgba(255,45,120,0.2)` }}>
          AD
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <div className="text-xs font-semibold truncate" style={{ color: TEXT }}>Admin</div>
            <div className="text-xs truncate" style={{ color: MUTED }}>admin@toko.id</div>
          </div>
        )}
      </div>
    </aside>
  );
}
