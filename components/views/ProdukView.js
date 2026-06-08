"use client";
import { useState, useMemo } from "react";

const NEON  = "#00ff88";
const PINK  = "#ff2d78";
const CYAN  = "#00e5ff";
const YLW   = "#ffe033";
const CARD  = "#0d0d20";
const TEXT  = "#e0e8ff";
const MUTED = "rgba(224,232,255,0.4)";
const BORD  = "1px solid rgba(0,255,136,0.1)";

const KATEGORIS = ["Semua","Sneakers","Jacket","Accessories","Bags"];

const KAT_CFG = {
  Sneakers:    { color:NEON, rgb:"0,255,136",  emoji:"👟", grad:"linear-gradient(135deg,rgba(0,255,136,0.2),rgba(0,255,136,0.05))" },
  Jacket:      { color:CYAN, rgb:"0,229,255",  emoji:"🧥", grad:"linear-gradient(135deg,rgba(0,229,255,0.2),rgba(0,229,255,0.05))" },
  Accessories: { color:PINK, rgb:"255,45,120", emoji:"⛓", grad:"linear-gradient(135deg,rgba(255,45,120,0.2),rgba(255,45,120,0.05))" },
  Bags:        { color:YLW,  rgb:"255,224,51", emoji:"🎒", grad:"linear-gradient(135deg,rgba(255,224,51,0.2),rgba(255,224,51,0.05))" },
};

const INIT = [
  { id:1, nama:"Sneakers Neon X1",   kategori:"Sneakers",    harga:650000, stok:12, stokMax:30 },
  { id:2, nama:"Jacket Urban V2",    kategori:"Jacket",      harga:480000, stok:28, stokMax:30 },
  { id:3, nama:"Cap Street Edition", kategori:"Accessories", harga:150000, stok:8,  stokMax:30 },
  { id:4, nama:"Tote Bag Minimal",   kategori:"Bags",        harga:95000,  stok:5,  stokMax:30 },
  { id:5, nama:"Hoodie Cyber Black", kategori:"Jacket",      harga:380000, stok:0,  stokMax:30 },
  { id:6, nama:"Sneakers Neo Volt",  kategori:"Sneakers",    harga:720000, stok:19, stokMax:30 },
  { id:7, nama:"Chain Necklace Set", kategori:"Accessories", harga:125000, stok:3,  stokMax:30 },
  { id:8, nama:"Backpack Urban Pro", kategori:"Bags",        harga:320000, stok:14, stokMax:30 },
];

const BLANK = { nama:"", kategori:"Sneakers", harga:"", stok:"" };

function stokInfo(stok) {
  if (stok === 0) return { label:"Habis",   color:PINK, rgb:"255,45,120" };
  if (stok <= 8)  return { label:"Menipis", color:YLW,  rgb:"255,224,51" };
  return               { label:"Aman",    color:NEON, rgb:"0,255,136" };
}

function NeonInput({ label, ...props }) {
  return (
    <div>
      <label style={{ display:"block", color:MUTED, fontSize:"11px", fontWeight:700, marginBottom:"6px", letterSpacing:"0.08em", textTransform:"uppercase" }}>{label}</label>
      <input {...props} style={{ width:"100%", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(0,255,136,0.2)", color:TEXT, padding:"10px 14px", fontSize:"13px", outline:"none", boxSizing:"border-box" }}
        onFocus={e => e.target.style.borderColor=NEON}
        onBlur={e  => e.target.style.borderColor="rgba(0,255,136,0.2)"} />
    </div>
  );
}

function NeonSelect({ label, value, onChange, children }) {
  return (
    <div>
      <label style={{ display:"block", color:MUTED, fontSize:"11px", fontWeight:700, marginBottom:"6px", letterSpacing:"0.08em", textTransform:"uppercase" }}>{label}</label>
      <select value={value} onChange={onChange} style={{ width:"100%", background:"#0a0a18", border:"1px solid rgba(0,255,136,0.2)", color:TEXT, padding:"10px 14px", fontSize:"13px", outline:"none", boxSizing:"border-box" }}>
        {children}
      </select>
    </div>
  );
}

/* ── Product Card ── */
function ProductCard({ p, onEdit, onDel }) {
  const cfg = KAT_CFG[p.kategori];
  const si  = stokInfo(p.stok);
  const pct = Math.min((p.stok / p.stokMax) * 100, 100);

  return (
    <div style={{ background:CARD, border:"1px solid rgba(0,255,136,0.08)", display:"flex", flexDirection:"column", overflow:"hidden", transition:"all 0.2s", cursor:"default" }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.border    = `1px solid rgba(${cfg.rgb},0.4)`;
        e.currentTarget.style.boxShadow = `0 8px 32px rgba(${cfg.rgb},0.15), 0 0 0 1px rgba(${cfg.rgb},0.1)`;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.border    = "1px solid rgba(0,255,136,0.08)";
        e.currentTarget.style.boxShadow = "none";
      }}>

      {/* Card Header — colored gradient */}
      <div style={{ background:cfg.grad, borderBottom:`1px solid rgba(${cfg.rgb},0.15)`, padding:"24px 20px 20px", position:"relative" }}>
        {/* Category badge */}
        <div style={{ position:"absolute", top:"12px", right:"12px" }}>
          <span style={{ color:cfg.color, background:`rgba(${cfg.rgb},0.12)`, border:`1px solid rgba(${cfg.rgb},0.3)`, padding:"3px 8px", fontSize:"9px", fontWeight:900, letterSpacing:"0.1em", textTransform:"uppercase" }}>
            {p.kategori}
          </span>
        </div>

        {/* Emoji icon */}
        <div style={{ fontSize:"44px", lineHeight:1, marginBottom:"12px", filter:`drop-shadow(0 0 12px rgba(${cfg.rgb},0.5))` }}>
          {cfg.emoji}
        </div>

        {/* Product name */}
        <h3 style={{ color:TEXT, fontWeight:900, fontSize:"15px", letterSpacing:"-0.01em", lineHeight:1.3, marginBottom:0 }}>
          {p.nama}
        </h3>
      </div>

      {/* Card Body */}
      <div style={{ padding:"18px 20px", flex:1, display:"flex", flexDirection:"column", gap:"14px" }}>

        {/* Price */}
        <div>
          <div style={{ color:MUTED, fontSize:"10px", fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:"3px" }}>Harga</div>
          <div style={{ color:cfg.color, fontWeight:900, fontSize:"22px", letterSpacing:"-0.02em", filter:`drop-shadow(0 0 8px rgba(${cfg.rgb},0.4))` }}>
            Rp {p.harga.toLocaleString("id-ID")}
          </div>
        </div>

        {/* Stock bar */}
        <div>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"6px" }}>
            <span style={{ color:MUTED, fontSize:"10px", fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase" }}>Stok</span>
            <div style={{ display:"flex", alignItems:"center", gap:"5px" }}>
              <div style={{ width:"6px", height:"6px", borderRadius:"50%", background:si.color, boxShadow:`0 0 6px ${si.color}` }} />
              <span style={{ color:si.color, fontWeight:900, fontSize:"12px" }}>{p.stok} unit</span>
              <span style={{ color:MUTED, fontSize:"10px" }}>· {si.label}</span>
            </div>
          </div>
          {/* Progress bar */}
          <div style={{ height:"4px", background:"rgba(255,255,255,0.06)", borderRadius:"2px" }}>
            <div style={{ height:"100%", width:`${pct}%`, background: pct===0 ? PINK : pct<=27 ? YLW : cfg.color, boxShadow:`0 0 8px ${pct===0?PINK:pct<=27?YLW:cfg.color}`, borderRadius:"2px", transition:"width 0.4s ease" }} />
          </div>
        </div>

        {/* Status */}
        <div style={{ display:"flex", alignItems:"center", gap:"6px" }}>
          <span style={{ color:p.stok>0?NEON:PINK, background:p.stok>0?"rgba(0,255,136,0.08)":"rgba(255,45,120,0.08)", border:`1px solid ${p.stok>0?"rgba(0,255,136,0.25)":"rgba(255,45,120,0.25)"}`, padding:"3px 10px", fontSize:"10px", fontWeight:700 }}>
            {p.stok > 0 ? "Aktif" : "Habis"}
          </span>
        </div>
      </div>

      {/* Card Footer — actions */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", borderTop:`1px solid rgba(${cfg.rgb},0.1)` }}>
        <button onClick={() => onEdit(p)}
          style={{ padding:"11px", color:CYAN, background:"rgba(0,229,255,0.05)", border:"none", borderRight:"1px solid rgba(0,229,255,0.1)", fontSize:"12px", fontWeight:700, cursor:"pointer", letterSpacing:"0.05em", transition:"all 0.15s" }}
          onMouseEnter={e => e.currentTarget.style.background="rgba(0,229,255,0.15)"}
          onMouseLeave={e => e.currentTarget.style.background="rgba(0,229,255,0.05)"}>
          ✎ Edit
        </button>
        <button onClick={() => onDel(p)}
          style={{ padding:"11px", color:PINK, background:"rgba(255,45,120,0.05)", border:"none", fontSize:"12px", fontWeight:700, cursor:"pointer", letterSpacing:"0.05em", transition:"all 0.15s" }}
          onMouseEnter={e => e.currentTarget.style.background="rgba(255,45,120,0.15)"}
          onMouseLeave={e => e.currentTarget.style.background="rgba(255,45,120,0.05)"}>
          ✕ Hapus
        </button>
      </div>
    </div>
  );
}

/* ── Main ── */
export default function ProdukView() {
  const [list,  setList]  = useState(INIT);
  const [search,setSearch]= useState("");
  const [kat,   setKat]   = useState("Semua");
  const [modal, setModal] = useState(null);
  const [sel,   setSel]   = useState(null);
  const [form,  setForm]  = useState(BLANK);

  const filtered = useMemo(() =>
    list.filter(p =>
      (kat==="Semua" || p.kategori===kat) &&
      p.nama.toLowerCase().includes(search.toLowerCase())
    ), [list, search, kat]);

  const summaryStats = [
    { label:"Total Produk",  val:list.length,                               color:NEON, rgb:"0,255,136",  icon:"⬡" },
    { label:"Produk Aktif",  val:list.filter(p=>p.stok>0).length,           color:CYAN, rgb:"0,229,255",  icon:"◈" },
    { label:"Stok Habis",    val:list.filter(p=>p.stok===0).length,          color:PINK, rgb:"255,45,120", icon:"⚠" },
    { label:"Nilai Stok",    val:"Rp "+list.reduce((a,p)=>a+p.harga*p.stok,0).toLocaleString("id-ID"), color:YLW, rgb:"255,224,51", icon:"◉" },
  ];

  const openAdd  = ()  => { setForm(BLANK); setModal("add"); };
  const openEdit = (p) => { setSel(p); setForm({ nama:p.nama, kategori:p.kategori, harga:String(p.harga), stok:String(p.stok) }); setModal("edit"); };
  const openDel  = (p) => { setSel(p); setModal("delete"); };
  const closeModal = () => { setModal(null); setSel(null); };

  const save = (e) => {
    e.preventDefault();
    const stok = Number(form.stok);
    if (modal === "add") {
      setList(l => [...l, { id:Date.now(), nama:form.nama, kategori:form.kategori, harga:Number(form.harga), stok, stokMax:30 }]);
    } else {
      setList(l => l.map(p => p.id===sel.id ? { ...p, nama:form.nama, kategori:form.kategori, harga:Number(form.harga), stok } : p));
    }
    closeModal();
  };

  const hapus = () => { setList(l => l.filter(p => p.id!==sel.id)); closeModal(); };

  return (
    <div className="space-y-4">

      {/* ── Stats ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {summaryStats.map(s => (
          <div key={s.label} style={{ background:CARD, border:BORD, padding:"16px 18px", display:"flex", alignItems:"center", gap:"12px" }}>
            <div style={{ width:"38px", height:"38px", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"18px", background:`rgba(${s.rgb},0.1)`, border:`1px solid rgba(${s.rgb},0.25)`, color:s.color, flexShrink:0 }}>
              {s.icon}
            </div>
            <div>
              <div style={{ color:s.color, fontWeight:900, fontSize:"18px", lineHeight:1 }}>{s.val}</div>
              <div style={{ color:MUTED, fontSize:"11px", marginTop:"2px" }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Toolbar ── */}
      <div style={{ background:CARD, border:BORD, padding:"14px 18px", display:"flex", flexWrap:"wrap", gap:"10px", alignItems:"center", justifyContent:"space-between" }}>
        <div className="flex flex-wrap gap-2 items-center">
          <div style={{ position:"relative" }}>
            <span style={{ position:"absolute", left:"10px", top:"50%", transform:"translateY(-50%)", color:MUTED, fontSize:"12px" }}>⌕</span>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari produk..."
              style={{ paddingLeft:"30px", paddingRight:"12px", paddingTop:"8px", paddingBottom:"8px", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(0,255,136,0.15)", color:TEXT, fontSize:"12px", outline:"none", width:"190px" }}
              onFocus={e => e.target.style.borderColor=NEON}
              onBlur={e  => e.target.style.borderColor="rgba(0,255,136,0.15)"} />
          </div>
          {KATEGORIS.map(k => (
            <button key={k} onClick={() => setKat(k)} style={{
              padding:"6px 12px", fontSize:"11px", fontWeight:700, cursor:"pointer",
              background: kat===k ? `rgba(${KAT_CFG[k]?.rgb||"0,255,136"},0.12)` : "transparent",
              border: `1px solid ${kat===k ? (KAT_CFG[k]?.color||NEON) : "rgba(0,255,136,0.15)"}`,
              color: kat===k ? (KAT_CFG[k]?.color||NEON) : MUTED,
            }}>
              {k !== "Semua" && KAT_CFG[k]?.emoji + " "}{k}
            </button>
          ))}
        </div>
        <button onClick={openAdd} style={{ background:"rgba(0,255,136,0.15)", border:`1px solid ${NEON}`, color:NEON, padding:"8px 18px", fontSize:"12px", fontWeight:900, cursor:"pointer", letterSpacing:"0.05em", boxShadow:"0 0 16px rgba(0,255,136,0.15)", flexShrink:0 }}>
          + Tambah Produk
        </button>
      </div>

      {/* ── Card Grid ── */}
      {filtered.length === 0 ? (
        <div style={{ background:CARD, border:BORD, padding:"60px", textAlign:"center" }}>
          <div style={{ fontSize:"40px", marginBottom:"12px" }}>🔍</div>
          <div style={{ color:MUTED, fontSize:"13px" }}>Tidak ada produk ditemukan</div>
          <button onClick={() => { setKat("Semua"); setSearch(""); }} style={{ marginTop:"12px", color:NEON, background:"none", border:"none", cursor:"pointer", fontSize:"12px", fontWeight:700 }}>
            Reset filter →
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {filtered.map(p => (
            <ProductCard key={p.id} p={p} onEdit={openEdit} onDel={openDel} />
          ))}
          {/* Add new card */}
          <div onClick={openAdd}
            style={{ background:"rgba(0,255,136,0.03)", border:"1px dashed rgba(0,255,136,0.2)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:"10px", minHeight:"280px", cursor:"pointer", transition:"all 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.background="rgba(0,255,136,0.07)"; e.currentTarget.style.borderColor=NEON; }}
            onMouseLeave={e => { e.currentTarget.style.background="rgba(0,255,136,0.03)"; e.currentTarget.style.borderColor="rgba(0,255,136,0.2)"; }}>
            <div style={{ width:"48px", height:"48px", borderRadius:"50%", border:`1px dashed ${NEON}`, display:"flex", alignItems:"center", justifyContent:"center", color:NEON, fontSize:"24px" }}>+</div>
            <div style={{ color:NEON, fontSize:"12px", fontWeight:700, opacity:0.7 }}>Tambah Produk</div>
          </div>
        </div>
      )}

      {/* ── Add / Edit Modal ── */}
      {(modal==="add" || modal==="edit") && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.8)", zIndex:50, display:"flex", alignItems:"center", justifyContent:"center", padding:"16px" }}
          onClick={e => { if (e.target===e.currentTarget) closeModal(); }}>
          <div style={{ background:"#0a0a18", border:`1px solid ${NEON}`, boxShadow:`0 0 50px rgba(0,255,136,0.12)`, width:"100%", maxWidth:"440px", padding:"28px" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"6px" }}>
              <div style={{ color:TEXT, fontWeight:900, fontSize:"15px" }}>{modal==="add"?"Tambah Produk Baru":"Edit Produk"}</div>
              <button onClick={closeModal} style={{ color:MUTED, background:"none", border:"none", cursor:"pointer", fontSize:"18px" }}>✕</button>
            </div>
            {modal==="edit" && <div style={{ color:MUTED, fontSize:"11px", marginBottom:"18px" }}>{sel?.nama}</div>}
            <div style={{ height:"1px", background:`linear-gradient(to right,${NEON},transparent)`, marginBottom:"22px", marginTop: modal==="add"?"18px":"0" }} />
            <form onSubmit={save} className="space-y-4">
              <NeonInput label="Nama Produk" required placeholder="Sneakers Neon X1..." value={form.nama}
                onChange={e => setForm(p=>({...p, nama:e.target.value}))} />
              <div className="grid grid-cols-2 gap-3">
                <NeonInput label="Harga (Rp)" required type="number" placeholder="650000" value={form.harga}
                  onChange={e => setForm(p=>({...p, harga:e.target.value}))} />
                <NeonInput label="Stok" required type="number" placeholder="12" value={form.stok}
                  onChange={e => setForm(p=>({...p, stok:e.target.value}))} />
              </div>
              <NeonSelect label="Kategori" value={form.kategori} onChange={e => setForm(p=>({...p, kategori:e.target.value}))}>
                {["Sneakers","Jacket","Accessories","Bags"].map(k => <option key={k}>{k}</option>)}
              </NeonSelect>
              <div style={{ display:"flex", gap:"10px", paddingTop:"8px" }}>
                <button type="button" onClick={closeModal} style={{ flex:1, padding:"12px", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(0,255,136,0.15)", color:MUTED, fontWeight:700, fontSize:"13px", cursor:"pointer" }}>
                  Batal
                </button>
                <button type="submit" style={{ flex:1, padding:"12px", background:"rgba(0,255,136,0.15)", border:`1px solid ${NEON}`, color:NEON, fontWeight:900, fontSize:"13px", cursor:"pointer", boxShadow:"0 0 16px rgba(0,255,136,0.15)" }}>
                  {modal==="add"?"Simpan Produk":"Simpan Perubahan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Delete Confirm ── */}
      {modal==="delete" && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.85)", zIndex:50, display:"flex", alignItems:"center", justifyContent:"center", padding:"16px" }}
          onClick={e => { if (e.target===e.currentTarget) closeModal(); }}>
          <div style={{ background:"#0a0a18", border:`1px solid ${PINK}`, boxShadow:`0 0 50px rgba(255,45,120,0.12)`, width:"100%", maxWidth:"360px", padding:"28px", textAlign:"center" }}>
            <div style={{ fontSize:"38px", marginBottom:"10px" }}>⚠</div>
            <div style={{ color:TEXT, fontWeight:900, fontSize:"15px", marginBottom:"4px" }}>Hapus Produk?</div>
            <div style={{ color:PINK, fontWeight:900, fontSize:"13px", marginBottom:"20px" }}>"{sel?.nama}"</div>
            <div style={{ height:"1px", background:`linear-gradient(to right,transparent,${PINK},transparent)`, marginBottom:"16px" }} />
            <p style={{ color:MUTED, fontSize:"11px", marginBottom:"20px" }}>Tindakan ini tidak dapat dibatalkan.</p>
            <div style={{ display:"flex", gap:"10px" }}>
              <button onClick={closeModal} style={{ flex:1, padding:"11px", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(0,255,136,0.15)", color:MUTED, fontWeight:700, fontSize:"12px", cursor:"pointer" }}>
                Batal
              </button>
              <button onClick={hapus} style={{ flex:1, padding:"11px", background:"rgba(255,45,120,0.15)", border:`1px solid ${PINK}`, color:PINK, fontWeight:900, fontSize:"12px", cursor:"pointer", boxShadow:`0 0 16px rgba(255,45,120,0.15)` }}>
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
