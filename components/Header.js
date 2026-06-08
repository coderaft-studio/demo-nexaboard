"use client";
import { useState, useEffect, useRef } from "react";

const NEON  = "#00ff88";
const PINK  = "#ff2d78";
const CYAN  = "#00e5ff";
const YLW   = "#ffe033";
const BG    = "#0a0a18";
const TEXT  = "#e0e8ff";
const MUTED = "rgba(224,232,255,0.35)";
const CARD  = "#0d0d20";

const LABELS = {
  dashboard:"Dashboard", produk:"Manajemen Produk",
  pesanan:"Pesanan", pelanggan:"Pelanggan",
  laporan:"Laporan & Analitik", pengaturan:"Pengaturan",
};

const NOTIFS = [
  { icon:"◈", color:NEON, rgb:"0,255,136",  title:"Pesanan baru masuk",         body:"#ORD-006 dari Dewi Kusuma — Rp 480.000", time:"5 menit lalu" },
  { icon:"⚠", color:YLW,  rgb:"255,224,51", title:"Stok hampir habis",          body:"Cap Street Edition tersisa 8 unit", time:"30 menit lalu" },
  { icon:"✓", color:CYAN, rgb:"0,229,255",  title:"Pembayaran dikonfirmasi",    body:"ORD-003 · Rp 150.000 diterima", time:"1 jam lalu" },
];

export default function Header({ active }) {
  const [notifOpen, setNotifOpen] = useState(false);
  const [unread, setUnread]       = useState(3);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setNotifOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const markRead = () => setUnread(0);

  return (
    <header className="flex items-center justify-between px-6 flex-shrink-0"
      style={{ height:"64px", background:BG, borderBottom:"1px solid rgba(0,255,136,0.08)", position:"relative", zIndex:40 }}>

      {/* Title */}
      <div>
        <h1 className="font-black text-base" style={{ color:TEXT, letterSpacing:"0.02em" }}>{LABELS[active]}</h1>
        <p className="text-xs" style={{ color:MUTED }}>
          <span style={{ color:NEON }}>●</span>&nbsp; Sistem aktif · Jun 2026
        </p>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">

        {/* Search */}
        <div className="relative hidden sm:block">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs" style={{ color:MUTED }}>⌕</span>
          <input placeholder="Cari..." className="pl-8 pr-4 py-2 text-xs outline-none w-44 transition-all"
            style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(0,255,136,0.15)", color:TEXT }}
            onFocus={e => e.target.style.borderColor = "rgba(0,255,136,0.5)"}
            onBlur={e  => e.target.style.borderColor = "rgba(0,255,136,0.15)"} />
        </div>

        {/* Notification */}
        <div ref={ref} style={{ position:"relative" }}>
          <button onClick={() => { setNotifOpen(o => !o); if (!notifOpen) markRead(); }}
            style={{ width:"36px", height:"36px", display:"flex", alignItems:"center", justifyContent:"center", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(0,255,136,0.1)", cursor:"pointer", position:"relative" }}>
            <span style={{ fontSize:"15px" }}>🔔</span>
            {unread > 0 && (
              <span style={{ position:"absolute", top:"-4px", right:"-4px", width:"16px", height:"16px", borderRadius:"50%", background:PINK, color:"#fff", fontSize:"9px", fontWeight:900, display:"flex", alignItems:"center", justifyContent:"center", boxShadow:`0 0 8px ${PINK}` }}>
                {unread}
              </span>
            )}
          </button>

          {/* Dropdown */}
          {notifOpen && (
            <div style={{ position:"absolute", top:"calc(100% + 8px)", right:0, width:"300px", background:CARD, border:"1px solid rgba(0,255,136,0.15)", boxShadow:"0 16px 40px rgba(0,0,0,0.6), 0 0 30px rgba(0,255,136,0.05)", zIndex:100 }}>
              {/* Header */}
              <div className="flex justify-between items-center px-4 py-3" style={{ borderBottom:"1px solid rgba(0,255,136,0.08)" }}>
                <span style={{ color:TEXT, fontWeight:900, fontSize:"12px" }}>Notifikasi</span>
                <button onClick={markRead} style={{ color:NEON, background:"none", border:"none", cursor:"pointer", fontSize:"10px", fontWeight:700 }}>
                  Tandai dibaca
                </button>
              </div>
              {/* Items */}
              {NOTIFS.map((n, i) => (
                <div key={i} className="flex gap-3 px-4 py-3 cursor-pointer transition-all"
                  style={{ borderBottom: i < NOTIFS.length-1 ? "1px solid rgba(0,255,136,0.05)" : "none" }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(0,255,136,0.04)"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  <div style={{ width:"28px", height:"28px", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", background:`rgba(${n.rgb},0.12)`, border:`1px solid rgba(${n.rgb},0.3)`, color:n.color, fontSize:"12px", flexShrink:0 }}>
                    {n.icon}
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ color:TEXT, fontSize:"11px", fontWeight:700, marginBottom:"2px" }}>{n.title}</div>
                    <div style={{ color:MUTED, fontSize:"10px", lineHeight:1.4 }}>{n.body}</div>
                    <div style={{ color:n.color, fontSize:"9px", marginTop:"4px", fontWeight:700 }}>{n.time}</div>
                  </div>
                </div>
              ))}
              {/* Footer */}
              <div className="px-4 py-2.5 text-center" style={{ borderTop:"1px solid rgba(0,255,136,0.08)" }}>
                <button style={{ color:NEON, background:"none", border:"none", cursor:"pointer", fontSize:"11px", fontWeight:700 }}>
                  Lihat semua notifikasi →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Divider */}
        <div style={{ width:"1px", height:"24px", background:"rgba(0,255,136,0.1)" }} />

        {/* Avatar */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 flex items-center justify-center font-black text-xs"
            style={{ background:"rgba(0,255,136,0.12)", border:`1px solid ${NEON}`, color:NEON, boxShadow:"0 0 10px rgba(0,255,136,0.25)" }}>
            AD
          </div>
          <div className="hidden sm:block">
            <div className="text-xs font-semibold" style={{ color:TEXT }}>Admin</div>
            <div style={{ fontSize:"10px", color:MUTED }}>Super Admin</div>
          </div>
        </div>
      </div>
    </header>
  );
}
