"use client";
import { useState } from "react";

const NEON  = "#00ff88";
const PINK  = "#ff2d78";
const CYAN  = "#00e5ff";
const YLW   = "#ffe033";
const CARD  = "#0d0d20";
const TEXT  = "#e0e8ff";
const MUTED = "rgba(224,232,255,0.4)";
const BORD  = "1px solid rgba(0,255,136,0.1)";

const MENUS = [
  { id:"toko",     icon:"◈", label:"Profil Toko",  desc:"Info & kontak toko" },
  { id:"akun",     icon:"◎", label:"Akun",          desc:"Profil & identitas" },
  { id:"notif",    icon:"⬡", label:"Notifikasi",    desc:"Atur pemberitahuan",  demo:true },
  { id:"keamanan", icon:"⊞", label:"Keamanan",      desc:"Password & akses",    demo:true },
  { id:"tampilan", icon:"◉", label:"Tampilan",      desc:"Tema & preferensi",   demo:true },
];

/* ── Toggle switch ── */
function Toggle({ value, onChange }) {
  return (
    <div onClick={()=>onChange(!value)} style={{ width:"44px", height:"24px", background:value?"rgba(0,255,136,0.15)":"rgba(255,255,255,0.06)", border:`1px solid ${value?NEON:"rgba(255,255,255,0.1)"}`, borderRadius:"12px", position:"relative", cursor:"pointer", transition:"all 0.2s", flexShrink:0 }}>
      <div style={{ position:"absolute", top:"3px", left:value?"23px":"3px", width:"16px", height:"16px", borderRadius:"50%", background:value?NEON:"rgba(255,255,255,0.3)", boxShadow:value?`0 0 8px ${NEON}`:"none", transition:"all 0.2s" }}/>
    </div>
  );
}

/* ── Neon Input ── */
function NInput({ label, desc, type="text", ...props }) {
  return (
    <div>
      <label style={{ display:"block", color:TEXT, fontSize:"12px", fontWeight:700, marginBottom:"2px" }}>{label}</label>
      {desc && <div style={{ color:MUTED, fontSize:"10px", marginBottom:"5px" }}>{desc}</div>}
      <input type={type} {...props} style={{ width:"100%", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(0,255,136,0.15)", color:TEXT, padding:"9px 12px", fontSize:"13px", outline:"none", boxSizing:"border-box" }}
        onFocus={e=>e.target.style.borderColor=NEON}
        onBlur={e =>e.target.style.borderColor="rgba(0,255,136,0.15)"} />
    </div>
  );
}

/* ── Neon Textarea ── */
function NTextarea({ label, desc, rows=3, ...props }) {
  return (
    <div>
      <label style={{ display:"block", color:TEXT, fontSize:"12px", fontWeight:700, marginBottom:"2px" }}>{label}</label>
      {desc && <div style={{ color:MUTED, fontSize:"10px", marginBottom:"5px" }}>{desc}</div>}
      <textarea rows={rows} {...props} style={{ width:"100%", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(0,255,136,0.15)", color:TEXT, padding:"9px 12px", fontSize:"13px", outline:"none", resize:"none", boxSizing:"border-box", fontFamily:"inherit" }}
        onFocus={e=>e.target.style.borderColor=NEON}
        onBlur={e =>e.target.style.borderColor="rgba(0,255,136,0.15)"} />
    </div>
  );
}

/* ── NSelect ── */
function NSelect({ label, value, onChange, children }) {
  return (
    <div>
      <label style={{ display:"block", color:TEXT, fontSize:"12px", fontWeight:700, marginBottom:"5px" }}>{label}</label>
      <select value={value} onChange={onChange} style={{ width:"100%", background:"#0a0a18", border:"1px solid rgba(0,255,136,0.15)", color:TEXT, padding:"9px 12px", fontSize:"13px", outline:"none", boxSizing:"border-box" }}>
        {children}
      </select>
    </div>
  );
}

/* ── Save Button + Toast ── */
function useSave() {
  const [status, setStatus] = useState(null); // null | "saving" | "saved"
  const save = (cb) => {
    setStatus("saving");
    setTimeout(()=>{ cb?.(); setStatus("saved"); setTimeout(()=>setStatus(null),2000); },600);
  };
  return { status, save };
}

function SaveBar({ status, onSave }) {
  return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", paddingTop:"20px", borderTop:"1px solid rgba(0,255,136,0.08)", marginTop:"8px" }}>
      {status==="saved" ? (
        <span style={{ color:NEON, fontSize:"12px", fontWeight:700 }}>✓ Perubahan disimpan</span>
      ) : <span/>}
      <button onClick={onSave} disabled={status==="saving"}
        style={{ background:"rgba(0,255,136,0.15)", border:`1px solid ${NEON}`, color:NEON, padding:"9px 24px", fontSize:"12px", fontWeight:900, cursor:"pointer", boxShadow:"0 0 12px rgba(0,255,136,0.15)", opacity:status==="saving"?0.6:1, letterSpacing:"0.05em" }}>
        {status==="saving" ? "Menyimpan..." : "Simpan Perubahan"}
      </button>
    </div>
  );
}

/* ── Section Header ── */
function SectionHeader({ icon, title, desc }) {
  return (
    <div style={{ marginBottom:"20px" }}>
      <div style={{ display:"flex", alignItems:"center", gap:"10px", marginBottom:"4px" }}>
        <span style={{ color:NEON, fontSize:"18px", filter:"drop-shadow(0 0 6px rgba(0,255,136,0.6))" }}>{icon}</span>
        <h3 style={{ color:TEXT, fontWeight:900, fontSize:"16px", margin:0 }}>{title}</h3>
      </div>
      <p style={{ color:MUTED, fontSize:"12px", margin:0, paddingLeft:"28px" }}>{desc}</p>
      <div style={{ height:"1px", background:"linear-gradient(to right,rgba(0,255,136,0.4),transparent)", marginTop:"14px" }}/>
    </div>
  );
}

/* ─────────────── SECTIONS ─────────────── */

function TokoSection() {
  const { status, save } = useSave();
  const [form, setForm] = useState({ nama:"CoderaftBoard Store", deskripsi:"Toko fashion urban terpercaya sejak 2024.", kategori:"Fashion", alamat:"Jl. Sudirman No.45", kota:"Jakarta", telepon:"0812-3456-7890", email:"toko@coderaftboard.id", website:"coderaftboard.id", jam:"08:00 - 21:00" });
  const f = k => e => setForm(p=>({...p,[k]:e.target.value}));
  return (
    <div>
      <SectionHeader icon="◈" title="Profil Toko" desc="Informasi publik toko yang ditampilkan ke pelanggan" />
      <div className="grid grid-cols-1 gap-4">
        <div className="grid grid-cols-2 gap-4">
          <NInput label="Nama Toko" value={form.nama} onChange={f("nama")} />
          <NSelect label="Kategori" value={form.kategori} onChange={f("kategori")}>
            {["Fashion","Makanan & Minuman","Elektronik","Kesehatan","Olahraga","Lainnya"].map(k=><option key={k}>{k}</option>)}
          </NSelect>
        </div>
        <NTextarea label="Deskripsi Toko" desc="Tampil di halaman profil publik" value={form.deskripsi} onChange={f("deskripsi")} rows={2} />
        <div className="grid grid-cols-2 gap-4">
          <NInput label="Alamat" value={form.alamat} onChange={f("alamat")} />
          <NInput label="Kota" value={form.kota} onChange={f("kota")} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <NInput label="Telepon" value={form.telepon} onChange={f("telepon")} />
          <NInput label="Email Toko" type="email" value={form.email} onChange={f("email")} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <NInput label="Website" value={form.website} onChange={f("website")} />
          <NInput label="Jam Operasional" value={form.jam} onChange={f("jam")} />
        </div>
      </div>
      <SaveBar status={status} onSave={()=>save()} />
    </div>
  );
}

function AkunSection() {
  const { status, save } = useSave();
  const [form, setForm] = useState({ nama:"Admin", jabatan:"Super Admin", email:"admin@toko.id", telepon:"0812-3456-7890", bio:"" });
  const f = k => e => setForm(p=>({...p,[k]:e.target.value}));
  return (
    <div>
      <SectionHeader icon="◎" title="Akun" desc="Identitas dan informasi akun administrator" />
      {/* Avatar */}
      <div style={{ display:"flex", alignItems:"center", gap:"16px", marginBottom:"24px" }}>
        <div style={{ width:"64px", height:"64px", borderRadius:"50%", background:"rgba(0,255,136,0.12)", border:`2px solid ${NEON}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"20px", fontWeight:900, color:NEON, boxShadow:"0 0 18px rgba(0,255,136,0.2)" }}>
          AD
        </div>
        <div>
          <div style={{ color:TEXT, fontWeight:700, fontSize:"14px" }}>{form.nama}</div>
          <div style={{ color:MUTED, fontSize:"11px" }}>{form.jabatan}</div>
          <button style={{ marginTop:"6px", color:CYAN, background:"none", border:"1px solid rgba(0,229,255,0.25)", padding:"4px 12px", fontSize:"10px", fontWeight:700, cursor:"pointer" }}>
            Ganti Foto
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4">
        <div className="grid grid-cols-2 gap-4">
          <NInput label="Nama Lengkap" value={form.nama} onChange={f("nama")} />
          <NInput label="Jabatan" value={form.jabatan} onChange={f("jabatan")} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <NInput label="Email" type="email" value={form.email} onChange={f("email")} />
          <NInput label="Telepon" value={form.telepon} onChange={f("telepon")} />
        </div>
        <NTextarea label="Bio" desc="Opsional — tampil di profil internal" value={form.bio} onChange={f("bio")} rows={2} placeholder="Tulis bio singkat..." />
      </div>
      <SaveBar status={status} onSave={()=>save()} />
    </div>
  );
}

function NotifSection() {
  const { status, save } = useSave();
  const [notifs, setNotifs] = useState([
    { id:"order_new",    label:"Pesanan Baru",          desc:"Notifikasi saat ada pesanan masuk",              on:true  },
    { id:"order_done",   label:"Pesanan Selesai",        desc:"Notifikasi saat pesanan berhasil diselesaikan",  on:true  },
    { id:"stock_low",    label:"Stok Menipis",           desc:"Peringatan jika stok produk tersisa < 10 unit",  on:true  },
    { id:"cust_new",     label:"Pelanggan Baru",         desc:"Notifikasi saat ada pelanggan baru mendaftar",   on:false },
    { id:"report_weekly",label:"Laporan Mingguan",       desc:"Ringkasan performa bisnis setiap Senin pagi",    on:true  },
    { id:"payment",      label:"Konfirmasi Pembayaran",  desc:"Notifikasi setiap transaksi berhasil diproses",  on:true  },
    { id:"review",       label:"Ulasan Pelanggan",       desc:"Notifikasi saat ada ulasan atau rating masuk",   on:false },
    { id:"promo",        label:"Info Promo & Update",    desc:"Update fitur baru dan penawaran dari Coderaft",  on:false },
  ]);
  const toggle = id => setNotifs(prev=>prev.map(n=>n.id===id?{...n,on:!n.on}:n));
  const allOn = notifs.every(n=>n.on);
  return (
    <div>
      <SectionHeader icon="⬡" title="Notifikasi" desc="Atur jenis pemberitahuan yang ingin Anda terima" />
      {/* Master toggle */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"12px 16px", background:"rgba(0,255,136,0.04)", border:BORD, marginBottom:"16px" }}>
        <div>
          <div style={{ color:TEXT, fontSize:"12px", fontWeight:700 }}>Aktifkan Semua</div>
          <div style={{ color:MUTED, fontSize:"10px" }}>Nyalakan atau matikan semua notifikasi sekaligus</div>
        </div>
        <Toggle value={allOn} onChange={()=>setNotifs(prev=>prev.map(n=>({...n,on:!allOn})))} />
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:"2px" }}>
        {notifs.map((n,i)=>(
          <div key={n.id} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"13px 16px", background:i%2===0?"rgba(255,255,255,0.02)":"transparent", borderBottom:"1px solid rgba(0,255,136,0.04)" }}>
            <div>
              <div style={{ color:TEXT, fontSize:"12px", fontWeight:600 }}>{n.label}</div>
              <div style={{ color:MUTED, fontSize:"10px", marginTop:"2px" }}>{n.desc}</div>
            </div>
            <Toggle value={n.on} onChange={()=>toggle(n.id)} />
          </div>
        ))}
      </div>
      <SaveBar status={status} onSave={()=>save()} />
    </div>
  );
}

function KeamananSection() {
  const { status, save } = useSave();
  const [pw, setPw] = useState({ current:"", new1:"", new2:"" });
  const [twofa, setTwofa] = useState(false);
  const [err, setErr] = useState("");
  const sessions = [
    { device:"Chrome · Windows 11", loc:"Jakarta, ID", time:"Aktif sekarang", current:true },
    { device:"Firefox · MacOS",     loc:"Bandung, ID", time:"2 jam lalu",    current:false },
    { device:"Safari · iPhone",     loc:"Jakarta, ID", time:"1 hari lalu",   current:false },
  ];
  const handleSave = () => {
    if (pw.new1 && pw.new1 !== pw.new2) { setErr("Password baru tidak cocok"); return; }
    if (pw.new1 && pw.new1.length < 8)  { setErr("Password minimal 8 karakter"); return; }
    setErr(""); save();
  };
  return (
    <div>
      <SectionHeader icon="⊞" title="Keamanan" desc="Kelola password dan keamanan akun Anda" />
      {/* Password */}
      <div style={{ marginBottom:"24px" }}>
        <div style={{ color:TEXT, fontSize:"13px", fontWeight:700, marginBottom:"14px" }}>Ubah Password</div>
        <div className="grid grid-cols-1 gap-4">
          <NInput label="Password Saat Ini" type="password" placeholder="••••••••" value={pw.current} onChange={e=>setPw(p=>({...p,current:e.target.value}))} />
          <div className="grid grid-cols-2 gap-4">
            <NInput label="Password Baru" type="password" placeholder="Min. 8 karakter" value={pw.new1} onChange={e=>setPw(p=>({...p,new1:e.target.value}))} />
            <NInput label="Konfirmasi Password" type="password" placeholder="Ulangi password baru" value={pw.new2} onChange={e=>setPw(p=>({...p,new2:e.target.value}))} />
          </div>
          {err && <div style={{ color:PINK, fontSize:"11px", fontWeight:700 }}>⚠ {err}</div>}
        </div>
      </div>
      {/* 2FA */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"14px 16px", background:"rgba(0,255,136,0.04)", border:BORD, marginBottom:"24px" }}>
        <div>
          <div style={{ color:TEXT, fontSize:"12px", fontWeight:700 }}>Two-Factor Authentication (2FA)</div>
          <div style={{ color:MUTED, fontSize:"10px", marginTop:"2px" }}>Lapisan keamanan tambahan saat login</div>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
          {twofa && <span style={{ color:NEON, fontSize:"10px", fontWeight:700 }}>Aktif</span>}
          <Toggle value={twofa} onChange={setTwofa} />
        </div>
      </div>
      {/* Sessions */}
      <div style={{ marginBottom:"8px" }}>
        <div style={{ color:TEXT, fontSize:"13px", fontWeight:700, marginBottom:"12px" }}>Sesi Login Aktif</div>
        <div style={{ display:"flex", flexDirection:"column", gap:"6px" }}>
          {sessions.map((s,i)=>(
            <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"12px 14px", background:s.current?"rgba(0,255,136,0.06)":"rgba(255,255,255,0.02)", border:s.current?`1px solid rgba(0,255,136,0.2)`:BORD }}>
              <div style={{ display:"flex", gap:"10px", alignItems:"center" }}>
                <span style={{ fontSize:"18px" }}>{s.device.includes("iPhone")?"📱":"💻"}</span>
                <div>
                  <div style={{ color:TEXT, fontSize:"12px", fontWeight:600 }}>{s.device}</div>
                  <div style={{ color:MUTED, fontSize:"10px" }}>{s.loc} · {s.time}</div>
                </div>
              </div>
              {s.current
                ? <span style={{ color:NEON, fontSize:"10px", fontWeight:700, border:`1px solid rgba(0,255,136,0.3)`, padding:"2px 8px" }}>Ini Anda</span>
                : <button style={{ color:PINK, background:"none", border:"1px solid rgba(255,45,120,0.25)", padding:"3px 10px", fontSize:"10px", fontWeight:700, cursor:"pointer" }}>Keluar</button>
              }
            </div>
          ))}
        </div>
      </div>
      <SaveBar status={status} onSave={handleSave} />
    </div>
  );
}

function TampilanSection() {
  const { status, save } = useSave();
  const ACCENTS = [
    { color:"#00ff88", label:"Neon Green" },
    { color:"#00e5ff", label:"Cyber Cyan"  },
    { color:"#ff2d78", label:"Neon Pink"   },
    { color:"#ffe033", label:"Electric Yellow"},
    { color:"#bf5fff", label:"Neon Violet" },
    { color:"#ff6600", label:"Neon Orange" },
  ];
  const [accent, setAccent]   = useState("#00ff88");
  const [lang,   setLang]     = useState("id");
  const [font,   setFont]     = useState("medium");
  const [compact,setCompact]  = useState(false);
  const [sidebarLabel, setSidebarLabel] = useState(true);
  return (
    <div>
      <SectionHeader icon="◉" title="Tampilan" desc="Sesuaikan tampilan dashboard sesuai preferensi Anda" />
      {/* Accent color */}
      <div style={{ marginBottom:"22px" }}>
        <div style={{ color:TEXT, fontSize:"12px", fontWeight:700, marginBottom:"4px" }}>Warna Aksen</div>
        <div style={{ color:MUTED, fontSize:"10px", marginBottom:"12px" }}>Warna utama yang digunakan di seluruh dashboard</div>
        <div style={{ display:"flex", gap:"10px", flexWrap:"wrap" }}>
          {ACCENTS.map(a=>(
            <div key={a.color} onClick={()=>setAccent(a.color)}
              style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:"5px", cursor:"pointer" }}>
              <div style={{ width:"36px", height:"36px", borderRadius:"50%", background:a.color, boxShadow:`0 0 ${accent===a.color?"14px":0} ${a.color}`, border:`3px solid ${accent===a.color?a.color:"transparent"}`, outline:accent===a.color?`2px solid rgba(255,255,255,0.3)`:"none", transition:"all 0.2s" }}/>
              <span style={{ color:accent===a.color?a.color:MUTED, fontSize:"9px", fontWeight:700 }}>{a.label}</span>
            </div>
          ))}
        </div>
      </div>
      {/* Font size */}
      <div style={{ marginBottom:"22px" }}>
        <div style={{ color:TEXT, fontSize:"12px", fontWeight:700, marginBottom:"4px" }}>Ukuran Font</div>
        <div style={{ display:"flex", gap:"8px" }}>
          {[["small","Kecil"],["medium","Sedang"],["large","Besar"]].map(([v,l])=>(
            <button key={v} onClick={()=>setFont(v)} style={{ padding:"7px 16px", fontSize:"12px", fontWeight:700, cursor:"pointer", background:font===v?"rgba(0,255,136,0.12)":"transparent", border:`1px solid ${font===v?NEON:"rgba(0,255,136,0.2)"}`, color:font===v?NEON:MUTED }}>
              {l}
            </button>
          ))}
        </div>
      </div>
      {/* Language */}
      <div style={{ marginBottom:"22px" }}>
        <NSelect label="Bahasa" value={lang} onChange={e=>setLang(e.target.value)}>
          <option value="id">🇮🇩 Bahasa Indonesia</option>
          <option value="en">🇺🇸 English</option>
        </NSelect>
      </div>
      {/* Toggles */}
      <div style={{ display:"flex", flexDirection:"column", gap:"12px", marginBottom:"8px" }}>
        {[
          { label:"Mode Kompak", desc:"Kurangi jarak antar elemen untuk lebih banyak konten", val:compact, set:setCompact },
          { label:"Label Sidebar", desc:"Tampilkan teks label di samping icon sidebar", val:sidebarLabel, set:setSidebarLabel },
        ].map(t=>(
          <div key={t.label} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"12px 14px", background:"rgba(255,255,255,0.02)", border:BORD }}>
            <div>
              <div style={{ color:TEXT, fontSize:"12px", fontWeight:600 }}>{t.label}</div>
              <div style={{ color:MUTED, fontSize:"10px", marginTop:"2px" }}>{t.desc}</div>
            </div>
            <Toggle value={t.val} onChange={t.set} />
          </div>
        ))}
      </div>
      <SaveBar status={status} onSave={()=>save()} />
    </div>
  );
}

/* ── Main ── */
export default function PengaturanView() {
  const [active, setActive] = useState("toko");

  const sections = { toko:<TokoSection/>, akun:<AkunSection/>, notif:<NotifSection/>, keamanan:<KeamananSection/>, tampilan:<TampilanSection/> };
  const activeMenu = MENUS.find(m=>m.id===active);

  return (
    <div style={{ display:"flex", gap:"12px", height:"calc(100vh - 176px)", minHeight:"520px" }}>

      {/* ── Left Sidebar ── */}
      <div style={{ width:"220px", flexShrink:0, display:"flex", flexDirection:"column", gap:"4px" }}>
        {/* Header */}
        <div style={{ background:CARD, border:BORD, padding:"14px 16px", marginBottom:"4px" }}>
          <div style={{ color:TEXT, fontWeight:900, fontSize:"13px" }}>Pengaturan</div>
          <div style={{ color:MUTED, fontSize:"10px", marginTop:"2px" }}>Kelola preferensi sistem</div>
        </div>
        {/* Menu items */}
        {MENUS.map(m=>{
          const isActive = active===m.id;
          return (
            <div key={m.id} onClick={()=>setActive(m.id)}
              style={{ background:isActive?"rgba(0,255,136,0.07)":CARD, border:isActive?`1px solid rgba(0,255,136,0.25)`:BORD, borderLeft:`3px solid ${isActive?NEON:"transparent"}`, padding:"12px 14px", cursor:"pointer", transition:"all 0.15s" }}
              onMouseEnter={e=>{ if(!isActive) e.currentTarget.style.background="rgba(0,255,136,0.03)"; }}
              onMouseLeave={e=>{ if(!isActive) e.currentTarget.style.background=CARD; }}>
              <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
                <span style={{ color:isActive?NEON:MUTED, fontSize:"16px", filter:isActive?"drop-shadow(0 0 5px rgba(0,255,136,0.6))":"none", transition:"all 0.15s" }}>{m.icon}</span>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:"6px" }}>
                    <span style={{ color:isActive?TEXT:TEXT, fontWeight:isActive?700:500, fontSize:"12px" }}>{m.label}</span>
                    {m.demo && <span style={{ color:"#ffe033", background:"rgba(255,224,51,0.1)", border:"1px solid rgba(255,224,51,0.3)", padding:"1px 5px", fontSize:"8px", fontWeight:900, letterSpacing:"0.05em", flexShrink:0 }}>DEMO</span>}
                  </div>
                  <div style={{ color:MUTED, fontSize:"10px", marginTop:"1px" }}>{m.desc}</div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Danger zone */}
        <div style={{ marginTop:"auto", paddingTop:"8px" }}>
          <div style={{ background:CARD, border:"1px solid rgba(255,45,120,0.15)", padding:"12px 14px" }}>
            <div style={{ color:PINK, fontSize:"11px", fontWeight:700, marginBottom:"8px" }}>⚠ Zona Berbahaya</div>
            <button style={{ width:"100%", color:PINK, background:"rgba(255,45,120,0.08)", border:"1px solid rgba(255,45,120,0.25)", padding:"7px", fontSize:"11px", fontWeight:700, cursor:"pointer" }}
              onMouseEnter={e=>e.currentTarget.style.background="rgba(255,45,120,0.16)"}
              onMouseLeave={e=>e.currentTarget.style.background="rgba(255,45,120,0.08)"}>
              Reset Semua Data
            </button>
          </div>
        </div>
      </div>

      {/* ── Right Content ── */}
      <div style={{ flex:1, background:CARD, border:BORD, padding:"24px 28px", overflowY:"auto" }}>
        {activeMenu?.demo ? (
          <div style={{ height:"100%", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:"16px", textAlign:"center" }}>
            <div style={{ width:"64px", height:"64px", borderRadius:"50%", background:"rgba(255,224,51,0.1)", border:"2px solid rgba(255,224,51,0.35)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"28px" }}>
              🔒
            </div>
            <div>
              <div style={{ color:YLW, fontWeight:900, fontSize:"16px", marginBottom:"6px" }}>{activeMenu.label}</div>
              <div style={{ color:MUTED, fontSize:"12px", maxWidth:"300px", lineHeight:1.7 }}>
                Fitur ini hanya tersedia di <span style={{ color:YLW, fontWeight:700 }}>versi premium</span>.
              </div>
            </div>
            <span style={{ color:YLW, background:"rgba(255,224,51,0.08)", border:"1px solid rgba(255,224,51,0.25)", padding:"6px 18px", fontSize:"11px", fontWeight:900, letterSpacing:"0.1em" }}>
              ✦ PREMIUM
            </span>
          </div>
        ) : sections[active]}
      </div>
    </div>
  );
}
