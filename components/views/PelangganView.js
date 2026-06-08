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

const TIER_CFG = {
  VIP:     { color:NEON, rgb:"0,255,136",  bg:"rgba(0,255,136,0.1)",  brd:"rgba(0,255,136,0.3)"  },
  Regular: { color:CYAN, rgb:"0,229,255",  bg:"rgba(0,229,255,0.1)",  brd:"rgba(0,229,255,0.3)"  },
  New:     { color:YLW,  rgb:"255,224,51", bg:"rgba(255,224,51,0.1)", brd:"rgba(255,224,51,0.3)" },
};

const STATUS_CFG = {
  Selesai:{ color:NEON }, Dikirim:{ color:YLW }, Proses:{ color:CYAN }, Pending:{ color:MUTED },
};

const AVAILABLE_TAGS = ["Loyal","Reseller","Wholesale","High Value","At Risk","Aktif","Inactive","Prioritas"];

const TIER_THRESHOLD = { VIP:2000000, Regular:500000 };

function calcTier(total) {
  if (total >= 2000000) return "VIP";
  if (total >= 500000)  return "Regular";
  return "New";
}

function nextTierInfo(total) {
  if (total >= 2000000) return null; // sudah VIP
  if (total >= 500000)  return { next:"VIP",     need:2000000-total, pct:Math.round((total/2000000)*100) };
  return                       { next:"Regular", need:500000-total,  pct:Math.round((total/500000)*100)  };
}

const INIT = [
  { id:1, nama:"Budi Santoso",   phone:"0812-3456-7890", email:"budi.s@email.com",  kota:"Jakarta",    join:"Jan 2026", totalBelanja:2450000, totalOrder:14, lastOrder:"07 Jun", recency:1,  frekuensi:5,  totalItem:28, favorit:"Sneakers Neon X1",   tags:["Loyal","High Value","Prioritas"], rating:5, catatan:"Pelanggan setia sejak awal. Sering beli untuk hadiah ulang tahun.", history:[120,180,240,300,380,450,500,480] },
  { id:2, nama:"Sari Dewi",      phone:"0821-9876-5432", email:"sari.d@email.com",  kota:"Bandung",    join:"Feb 2026", totalBelanja:1890000, totalOrder:11, lastOrder:"07 Jun", recency:1,  frekuensi:7,  totalItem:18, favorit:"Jacket Urban V2",     tags:["Loyal","Reseller"],              rating:5, catatan:"",                                                                   history:[80,130,170,210,260,310,360,380] },
  { id:3, nama:"Ahmad Rizki",    phone:"0857-1234-5678", email:"ahmad.r@email.com", kota:"Surabaya",   join:"Mar 2026", totalBelanja:1230000, totalOrder:7,  lastOrder:"06 Jun", recency:2,  frekuensi:12, totalItem:12, favorit:"Cap Street Edition",  tags:["Aktif"],                         rating:4, catatan:"",                                                                   history:[50,80,110,140,165,195,215,230] },
  { id:4, nama:"Rina Wulandari", phone:"0813-5555-7777", email:"rina.w@email.com",  kota:"Yogyakarta", join:"Mar 2026", totalBelanja:950000,  totalOrder:5,  lastOrder:"06 Jun", recency:2,  frekuensi:18, totalItem:9,  favorit:"Tote Bag Minimal",    tags:["Aktif"],                         rating:4, catatan:"",                                                                   history:[40,65,90,115,135,155,175,190] },
  { id:5, nama:"Hendra Jaya",    phone:"0878-2222-3333", email:"hendra@email.com",  kota:"Semarang",   join:"Apr 2026", totalBelanja:650000,  totalOrder:4,  lastOrder:"05 Jun", recency:3,  frekuensi:25, totalItem:7,  favorit:"Sneakers Neon X1",   tags:["At Risk"],                       rating:3, catatan:"Sudah lama tidak order. Perlu di-follow up.",                         history:[30,50,80,100,120,130,148,145] },
  { id:6, nama:"Dewi Kusuma",    phone:"0819-4444-6666", email:"dewi.k@email.com",  kota:"Medan",      join:"Apr 2026", totalBelanja:760000,  totalOrder:4,  lastOrder:"05 Jun", recency:3,  frekuensi:20, totalItem:7,  favorit:"Hoodie Cyber Black",  tags:["Aktif"],                         rating:4, catatan:"",                                                                   history:[20,45,72,95,115,138,155,162] },
  { id:7, nama:"Fajar Nugroho",  phone:"0853-8888-1111", email:"fajar@email.com",   kota:"Bekasi",     join:"Mei 2026", totalBelanja:720000,  totalOrder:3,  lastOrder:"04 Jun", recency:4,  frekuensi:30, totalItem:5,  favorit:"Sneakers Neo Volt",   tags:["Aktif"],                         rating:4, catatan:"",                                                                   history:[10,35,65,88,112,132,145,152] },
  { id:8, nama:"Nita Sari",      phone:"0877-6543-2109", email:"nita.s@email.com",  kota:"Bandung",    join:"Mei 2026", totalBelanja:500000,  totalOrder:3,  lastOrder:"04 Jun", recency:4,  frekuensi:35, totalItem:4,  favorit:"Chain Necklace Set",  tags:["Aktif"],                         rating:3, catatan:"",                                                                   history:[10,22,42,62,82,92,102,108] },
];

const RECENT_ORDERS = {
  1:[{id:"#ORD-001",product:"Sneakers Neon X1",total:650000,status:"Selesai",date:"07 Jun"},{id:"#ORD-011",product:"Sneakers Neo Volt",total:720000,status:"Selesai",date:"01 Jun"},{id:"#ORD-018",product:"Jacket Urban V2",total:480000,status:"Selesai",date:"25 Mei"}],
  2:[{id:"#ORD-002",product:"Jacket Urban V2",total:480000,status:"Dikirim",date:"07 Jun"},{id:"#ORD-009",product:"Cap Street Edition",total:150000,status:"Selesai",date:"03 Jun"},{id:"#ORD-016",product:"Sneakers Neon X1",total:650000,status:"Selesai",date:"28 Mei"}],
  3:[{id:"#ORD-003",product:"Cap Street Edition",total:450000,status:"Proses",date:"06 Jun"},{id:"#ORD-010",product:"Tote Bag Minimal",total:190000,status:"Selesai",date:"02 Jun"},{id:"#ORD-017",product:"Chain Necklace Set",total:125000,status:"Selesai",date:"26 Mei"}],
  4:[{id:"#ORD-004",product:"Tote Bag Minimal",total:190000,status:"Pending",date:"06 Jun"},{id:"#ORD-012",product:"Chain Necklace Set",total:125000,status:"Selesai",date:"01 Jun"},{id:"#ORD-019",product:"Backpack Urban Pro",total:320000,status:"Selesai",date:"22 Mei"}],
  5:[{id:"#ORD-005",product:"Sneakers Neon X1",total:650000,status:"Pending",date:"05 Jun"},{id:"#ORD-013",product:"Hoodie Cyber Black",total:380000,status:"Selesai",date:"28 Mei"}],
  6:[{id:"#ORD-006",product:"Hoodie Cyber Black",total:760000,status:"Selesai",date:"05 Jun"},{id:"#ORD-014",product:"Sneakers Neon X1",total:650000,status:"Selesai",date:"24 Mei"}],
  7:[{id:"#ORD-007",product:"Sneakers Neo Volt",total:720000,status:"Dikirim",date:"04 Jun"},{id:"#ORD-015",product:"Backpack Urban Pro",total:320000,status:"Selesai",date:"20 Mei"}],
  8:[{id:"#ORD-008",product:"Chain Necklace Set",total:500000,status:"Proses",date:"04 Jun"}],
};

const BLANK = { nama:"", phone:"", email:"", kota:"" };

function initials(name) { return name.split(" ").slice(0,2).map(w=>w[0]).join("").toUpperCase(); }

function NeonInput({ label, ...props }) {
  return (
    <div>
      <label style={{ display:"block", color:MUTED, fontSize:"11px", fontWeight:700, marginBottom:"5px", letterSpacing:"0.08em", textTransform:"uppercase" }}>{label}</label>
      <input {...props} style={{ width:"100%", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(0,255,136,0.2)", color:TEXT, padding:"9px 12px", fontSize:"13px", outline:"none", boxSizing:"border-box" }}
        onFocus={e=>e.target.style.borderColor=NEON} onBlur={e=>e.target.style.borderColor="rgba(0,255,136,0.2)"} />
    </div>
  );
}

function SpendChart({ history, color, rgb }) {
  const W=400, H=56, max=Math.max(...history), min=Math.min(...history), rng=max-min||1;
  const xs=history.map((_,i)=>(i/(history.length-1))*W);
  const ys=history.map(p=>H-((p-min)/rng)*(H-8)-4);
  const lineD=xs.map((x,i)=>`${i===0?"M":"L"} ${x.toFixed(1)} ${ys[i].toFixed(1)}`).join(" ");
  const areaD=lineD+` L ${W} ${H} L 0 ${H} Z`;
  const gid=`sc${rgb.replace(/,/g,"")}`;
  return (
    <svg width="100%" height="56" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ display:"block" }}>
      <defs><linearGradient id={gid} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={color} stopOpacity="0.25"/><stop offset="100%" stopColor={color} stopOpacity="0.01"/></linearGradient></defs>
      <path d={areaD} fill={`url(#${gid})`}/>
      <path d={lineD} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ filter:`drop-shadow(0 0 4px ${color})` }}/>
      <circle cx={xs[xs.length-1].toFixed(1)} cy={ys[ys.length-1].toFixed(1)} r="4" fill={color} style={{ filter:`drop-shadow(0 0 6px ${color})` }}/>
    </svg>
  );
}

/* ── Detail Panel ── */
function DetailPanel({ c, onEdit, onDel, onUpdate }) {
  const tier     = TIER_CFG[calcTier(c.totalBelanja)];
  const nextTier = nextTierInfo(c.totalBelanja);
  const avg      = Math.round(c.totalBelanja / c.totalOrder);
  const orders   = RECENT_ORDERS[c.id] || [];
  const isAktif  = c.recency <= 30;
  const [editNote,   setEditNote]   = useState(false);
  const [noteVal,    setNoteVal]    = useState(c.catatan);
  const [showTagDrop,setTagDrop]    = useState(false);

  const recencyColor = c.recency <= 7 ? NEON : c.recency <= 30 ? YLW : PINK;
  const freqColor    = c.frekuensi <= 7 ? NEON : c.frekuensi <= 14 ? CYAN : YLW;

  const saveNote = () => { onUpdate("catatan", noteVal); setEditNote(false); };
  const setRating = (r) => onUpdate("rating", r);
  const tags = c.tags || [];
  const removeTag = (tag) => onUpdate("tags", tags.filter(t=>t!==tag));
  const addTag    = (tag) => { onUpdate("tags", [...tags, tag]); setTagDrop(false); };
  const availableTags = AVAILABLE_TAGS.filter(t=>!tags.includes(t));

  return (
    <div style={{ height:"100%", overflowY:"auto", display:"flex", flexDirection:"column", gap:"10px", paddingRight:"2px" }}>

      {/* Profile header */}
      <div style={{ background:CARD, border:BORD, borderTop:`3px solid ${tier.color}`, padding:"20px 22px" }}>
        <div style={{ display:"flex", gap:"16px", alignItems:"flex-start" }}>
          <div style={{ width:"58px", height:"58px", borderRadius:"50%", background:`rgba(${tier.rgb},0.12)`, border:`2px solid ${tier.color}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"18px", fontWeight:900, color:tier.color, flexShrink:0, boxShadow:`0 0 18px rgba(${tier.rgb},0.25)` }}>
            {initials(c.nama)}
          </div>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"5px", flexWrap:"wrap" }}>
              <h2 style={{ color:TEXT, fontWeight:900, fontSize:"17px", margin:0 }}>{c.nama}</h2>
              <span style={{ color:tier.color, background:tier.bg, border:`1px solid ${tier.brd}`, padding:"2px 8px", fontSize:"10px", fontWeight:900 }}>{calcTier(c.totalBelanja)}</span>
              <span style={{ color:isAktif?NEON:PINK, background:isAktif?"rgba(0,255,136,0.08)":"rgba(255,45,120,0.08)", border:`1px solid ${isAktif?"rgba(0,255,136,0.25)":"rgba(255,45,120,0.25)"}`, padding:"2px 8px", fontSize:"10px", fontWeight:700 }}>
                {isAktif?"● Aktif":"○ Tidak Aktif"}
              </span>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"3px 16px" }}>
              {[["📱",c.phone],["✉",c.email],["📍",c.kota],["📅","Bergabung "+c.join]].map(([ic,v])=>(
                <div key={v} style={{ display:"flex", alignItems:"center", gap:"5px" }}>
                  <span style={{ fontSize:"10px" }}>{ic}</span>
                  <span style={{ color:MUTED, fontSize:"11px", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ display:"flex", gap:"6px", flexShrink:0 }}>
            <button onClick={onEdit} style={{ color:CYAN, background:"rgba(0,229,255,0.08)", border:"1px solid rgba(0,229,255,0.25)", padding:"6px 14px", fontSize:"11px", fontWeight:700, cursor:"pointer" }}
              onMouseEnter={e=>e.currentTarget.style.background="rgba(0,229,255,0.18)"} onMouseLeave={e=>e.currentTarget.style.background="rgba(0,229,255,0.08)"}>Edit</button>
            <button onClick={onDel} style={{ color:PINK, background:"rgba(255,45,120,0.08)", border:"1px solid rgba(255,45,120,0.25)", padding:"6px 14px", fontSize:"11px", fontWeight:700, cursor:"pointer" }}
              onMouseEnter={e=>e.currentTarget.style.background="rgba(255,45,120,0.18)"} onMouseLeave={e=>e.currentTarget.style.background="rgba(255,45,120,0.08)"}>Hapus</button>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"8px" }}>
        {[
          { label:"Total Belanja",   val:`Rp ${c.totalBelanja.toLocaleString("id-ID")}`, color:tier.color },
          { label:"Total Order",     val:c.totalOrder,                                   color:CYAN },
          { label:"Rata-rata Order", val:`Rp ${avg.toLocaleString("id-ID")}`,            color:NEON },
          { label:"Terakhir Order",  val:c.lastOrder,                                    color:MUTED },
        ].map(s=>(
          <div key={s.label} style={{ background:CARD, border:BORD, padding:"13px 14px" }}>
            <div style={{ color:s.color, fontWeight:900, fontSize:"14px", marginBottom:"3px", letterSpacing:"-0.02em" }}>{s.val}</div>
            <div style={{ color:MUTED, fontSize:"10px" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tier Progress + Insights row */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"8px" }}>

        {/* Tier Progress */}
        <div style={{ background:CARD, border:BORD, padding:"14px 16px" }}>
          <div style={{ color:MUTED, fontSize:"10px", fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:"10px" }}>Progress Tier</div>
          {nextTier ? (
            <>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"6px" }}>
                <span style={{ color:TEXT, fontSize:"11px", fontWeight:700 }}>{calcTier(c.totalBelanja)} → {nextTier.next}</span>
                <span style={{ color:tier.color, fontSize:"11px", fontWeight:900 }}>{nextTier.pct}%</span>
              </div>
              <div style={{ height:"5px", background:"rgba(255,255,255,0.06)", marginBottom:"6px" }}>
                <div style={{ height:"100%", width:`${nextTier.pct}%`, background:tier.color, boxShadow:`0 0 8px ${tier.color}`, transition:"width 0.4s" }} />
              </div>
              <div style={{ color:MUTED, fontSize:"10px" }}>
                Butuh <span style={{ color:tier.color, fontWeight:700 }}>Rp {nextTier.need.toLocaleString("id-ID")}</span> lagi
              </div>
            </>
          ) : (
            <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
              <span style={{ color:NEON, fontSize:"20px", filter:`drop-shadow(0 0 8px ${NEON})` }}>★</span>
              <div>
                <div style={{ color:NEON, fontWeight:900, fontSize:"13px" }}>Tier Tertinggi</div>
                <div style={{ color:MUTED, fontSize:"10px" }}>Pelanggan VIP</div>
              </div>
            </div>
          )}
        </div>

        {/* Insights 4 mini */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"6px" }}>
          {[
            { label:"Produk Favorit", val:(c.favorit||"-").split(" ").slice(0,2).join(" "), color:CYAN, full:c.favorit||"-" },
            { label:"Frekuensi",      val:`${c.frekuensi} hari`,                     color:freqColor,    full:"Rata-rata order" },
            { label:"Recency",        val:`${c.recency} hari lalu`,                  color:recencyColor, full:"Terakhir aktif" },
            { label:"Total Item",     val:`${c.totalItem} pcs`,                      color:YLW,          full:"Semua item dibeli" },
          ].map(s=>(
            <div key={s.label} title={s.full} style={{ background:CARD, border:BORD, padding:"10px 12px" }}>
              <div style={{ color:s.color, fontWeight:900, fontSize:"12px", marginBottom:"2px", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{s.val}</div>
              <div style={{ color:MUTED, fontSize:"9px" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Spending chart */}
      <div style={{ background:CARD, border:BORD, overflow:"hidden" }}>
        <div style={{ padding:"12px 16px 8px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div style={{ color:TEXT, fontWeight:900, fontSize:"12px" }}>Riwayat Belanja</div>
          <div style={{ color:MUTED, fontSize:"10px" }}>8 bulan terakhir</div>
        </div>
        <div style={{ height:"1px", background:`rgba(${tier.rgb},0.1)` }} />
        <SpendChart history={c.history||[0,0,0,0,0,0,0,0]} color={tier.color} rgb={tier.rgb} />
      </div>

      {/* Tags + Rating */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"8px" }}>

        {/* Tags */}
        <div style={{ background:CARD, border:BORD, padding:"14px 16px", position:"relative" }}>
          <div style={{ color:MUTED, fontSize:"10px", fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:"10px" }}>Tags</div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:"5px" }}>
            {tags.map(tag=>(
              <span key={tag} style={{ display:"inline-flex", alignItems:"center", gap:"4px", color:CYAN, background:"rgba(0,229,255,0.08)", border:"1px solid rgba(0,229,255,0.25)", padding:"3px 8px", fontSize:"10px", fontWeight:700 }}>
                {tag}
                <span onClick={()=>removeTag(tag)} style={{ cursor:"pointer", opacity:0.6, fontSize:"11px" }}>×</span>
              </span>
            ))}
            {availableTags.length > 0 && (
              <span onClick={()=>setTagDrop(!showTagDrop)} style={{ display:"inline-flex", alignItems:"center", color:NEON, background:"rgba(0,255,136,0.06)", border:"1px dashed rgba(0,255,136,0.25)", padding:"3px 8px", fontSize:"10px", fontWeight:700, cursor:"pointer" }}>
                + Tambah
              </span>
            )}
          </div>
          {showTagDrop && (
            <div style={{ position:"absolute", top:"100%", left:"16px", zIndex:20, background:"#0a0a18", border:`1px solid ${NEON}`, marginTop:"4px", minWidth:"160px", boxShadow:`0 8px 24px rgba(0,0,0,0.5)` }}>
              {availableTags.map(tag=>(
                <div key={tag} onClick={()=>addTag(tag)} style={{ padding:"8px 14px", color:TEXT, fontSize:"12px", cursor:"pointer", borderBottom:"1px solid rgba(0,255,136,0.05)" }}
                  onMouseEnter={e=>e.currentTarget.style.background="rgba(0,255,136,0.08)"}
                  onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                  {tag}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Rating */}
        <div style={{ background:CARD, border:BORD, padding:"14px 16px" }}>
          <div style={{ color:MUTED, fontSize:"10px", fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:"10px" }}>Rating Kepuasan</div>
          <div style={{ display:"flex", gap:"6px", alignItems:"center", marginBottom:"8px" }}>
            {[1,2,3,4,5].map(star=>(
              <span key={star} onClick={()=>setRating(star)} style={{ fontSize:"22px", cursor:"pointer", color: star <= c.rating ? YLW : "rgba(255,255,255,0.1)", filter: star <= c.rating ? `drop-shadow(0 0 6px ${YLW})` : "none", transition:"all 0.15s" }}>★</span>
            ))}
          </div>
          <div style={{ color:MUTED, fontSize:"10px" }}>
            {["","Sangat Buruk","Buruk","Cukup","Baik","Sangat Baik"][c.rating]} · {c.rating}/5
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div style={{ background:CARD, border:BORD }}>
        <div style={{ padding:"12px 16px", borderBottom:"1px solid rgba(0,255,136,0.08)" }}>
          <div style={{ color:TEXT, fontWeight:900, fontSize:"12px" }}>Pesanan Terakhir</div>
        </div>
        {orders.length===0 ? (
          <div style={{ padding:"20px", textAlign:"center", color:MUTED, fontSize:"12px" }}>Belum ada pesanan</div>
        ) : orders.map((o,i)=>{
          const sc=STATUS_CFG[o.status];
          return (
            <div key={o.id} style={{ display:"flex", alignItems:"center", gap:"10px", padding:"10px 16px", borderBottom:i<orders.length-1?"1px solid rgba(0,255,136,0.05)":"none" }}>
              <span style={{ color:NEON, fontWeight:700, fontSize:"11px", flexShrink:0 }}>{o.id}</span>
              <span style={{ color:TEXT, fontSize:"12px", flex:1, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{o.product}</span>
              <span style={{ color:TEXT, fontWeight:700, fontSize:"12px", flexShrink:0 }}>Rp {o.total.toLocaleString("id-ID")}</span>
              <span style={{ color:sc.color, fontSize:"10px", fontWeight:700, flexShrink:0, border:`1px solid ${sc.color}`, padding:"1px 6px" }}>{o.status}</span>
              <span style={{ color:MUTED, fontSize:"10px", flexShrink:0 }}>{o.date}</span>
            </div>
          );
        })}
      </div>

      {/* Catatan */}
      <div style={{ background:CARD, border:BORD, padding:"14px 16px" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"10px" }}>
          <div style={{ color:MUTED, fontSize:"10px", fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase" }}>Catatan</div>
          {!editNote ? (
            <button onClick={()=>{ setNoteVal(c.catatan); setEditNote(true); }} style={{ color:CYAN, background:"none", border:"none", cursor:"pointer", fontSize:"11px", fontWeight:700 }}>Edit</button>
          ) : (
            <div style={{ display:"flex", gap:"6px" }}>
              <button onClick={()=>setEditNote(false)} style={{ color:MUTED, background:"none", border:"none", cursor:"pointer", fontSize:"11px" }}>Batal</button>
              <button onClick={saveNote} style={{ color:NEON, background:"none", border:"none", cursor:"pointer", fontSize:"11px", fontWeight:700 }}>Simpan</button>
            </div>
          )}
        </div>
        {editNote ? (
          <textarea value={noteVal} onChange={e=>setNoteVal(e.target.value)} rows={3}
            style={{ width:"100%", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(0,255,136,0.3)", color:TEXT, padding:"9px 12px", fontSize:"12px", outline:"none", resize:"none", boxSizing:"border-box", fontFamily:"inherit" }}
            autoFocus />
        ) : (
          <p style={{ color: c.catatan ? TEXT : MUTED, fontSize:"12px", lineHeight:1.6, margin:0, fontStyle: c.catatan ? "normal" : "italic" }}>
            {c.catatan || "Belum ada catatan. Klik Edit untuk menambahkan."}
          </p>
        )}
      </div>

    </div>
  );
}

/* ── Main ── */
export default function PelangganView() {
  const [customers, setCustomers] = useState(INIT);
  const [selId,     setSelId]     = useState(1);
  const [search,    setSearch]    = useState("");
  const [tierF,     setTierF]     = useState("Semua");
  const [modal,     setModal]     = useState(null);
  const [form,      setForm]      = useState(BLANK);

  const filtered = useMemo(()=>
    customers.filter(c=>
      (tierF==="Semua" || calcTier(c.totalBelanja)===tierF) &&
      (c.nama.toLowerCase().includes(search.toLowerCase()) || c.kota.toLowerCase().includes(search.toLowerCase()))
    ), [customers, tierF, search]);

  const sel = customers.find(c=>c.id===selId);

  const counts = useMemo(()=>({
    VIP:     customers.filter(c=>calcTier(c.totalBelanja)==="VIP").length,
    Regular: customers.filter(c=>calcTier(c.totalBelanja)==="Regular").length,
    New:     customers.filter(c=>calcTier(c.totalBelanja)==="New").length,
  }), [customers]);

  const updateField = (field, value) => setCustomers(prev=>prev.map(c=>c.id===selId?{...c,[field]:value}:c));

  const openEdit   = () => { setForm({ nama:sel.nama, phone:sel.phone, email:sel.email, kota:sel.kota }); setModal("edit"); };
  const openDel    = () => setModal("delete");
  const closeModal = () => setModal(null);

  const saveEdit = (e) => { e.preventDefault(); setCustomers(prev=>prev.map(c=>c.id===selId?{...c,...form}:c)); closeModal(); };

  const addCustomer = (e) => {
    e.preventDefault();
    const newId = Math.max(...customers.map(c=>c.id))+1;
    setCustomers(prev=>[...prev,{ id:newId, ...form, join:"Jun 2026", totalBelanja:0, totalOrder:0, lastOrder:"-", recency:0, frekuensi:0, totalItem:0, favorit:"-", tags:["New"], rating:0, catatan:"", history:[0,0,0,0,0,0,0,0] }]);
    setSelId(newId);
    closeModal();
  };

  const deleteCustomer = () => {
    const remaining = customers.filter(c=>c.id!==selId);
    setCustomers(remaining);
    setSelId(remaining[0]?.id || null);
    closeModal();
  };

  return (
    <div style={{ display:"flex", gap:"12px", height:"calc(100vh - 176px)", minHeight:"520px" }}>

      {/* ── Left Panel ── */}
      <div style={{ width:"272px", flexShrink:0, display:"flex", flexDirection:"column", gap:"8px", overflow:"hidden" }}>

        {/* Filter 4 boxes */}
        <div style={{ background:CARD, border:BORD, padding:"12px 14px" }}>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"6px" }}>
            <div onClick={()=>setTierF("Semua")}
              style={{ textAlign:"center", padding:"8px 4px", background:tierF==="Semua"?"rgba(0,255,136,0.1)":"rgba(255,255,255,0.03)", border:`1px solid ${tierF==="Semua"?"rgba(0,255,136,0.35)":"rgba(255,255,255,0.06)"}`, cursor:"pointer" }}>
              <div style={{ color:tierF==="Semua"?NEON:TEXT, fontWeight:900, fontSize:"15px" }}>{customers.length}</div>
              <div style={{ color:tierF==="Semua"?NEON:MUTED, fontSize:"9px", fontWeight:700, marginTop:"2px" }}>Semua</div>
            </div>
            {Object.entries(counts).map(([tier,n])=>{
              const t=TIER_CFG[tier], active=tierF===tier;
              return (
                <div key={tier} onClick={()=>setTierF(active?"Semua":tier)}
                  style={{ textAlign:"center", padding:"8px 4px", background:active?t.bg:"rgba(255,255,255,0.03)", border:`1px solid ${active?t.brd:"rgba(255,255,255,0.06)"}`, cursor:"pointer" }}>
                  <div style={{ color:t.color, fontWeight:900, fontSize:"15px" }}>{n}</div>
                  <div style={{ color:t.color, fontSize:"9px", fontWeight:700, marginTop:"2px", opacity:active?1:0.7 }}>{tier}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Search + Add */}
        <div style={{ display:"flex", gap:"6px" }}>
          <div style={{ position:"relative", flex:1 }}>
            <span style={{ position:"absolute", left:"9px", top:"50%", transform:"translateY(-50%)", color:MUTED, fontSize:"11px" }}>⌕</span>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Cari..."
              style={{ width:"100%", paddingLeft:"26px", paddingRight:"8px", paddingTop:"7px", paddingBottom:"7px", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(0,255,136,0.15)", color:TEXT, fontSize:"12px", outline:"none", boxSizing:"border-box" }}
              onFocus={e=>e.target.style.borderColor=NEON} onBlur={e=>e.target.style.borderColor="rgba(0,255,136,0.15)"} />
          </div>
          <button onClick={()=>{ setForm(BLANK); setModal("add"); }}
            style={{ background:"rgba(0,255,136,0.15)", border:`1px solid ${NEON}`, color:NEON, padding:"7px 12px", fontSize:"13px", fontWeight:900, cursor:"pointer", flexShrink:0 }}>+</button>
        </div>

        {/* Customer list */}
        <div style={{ flex:1, overflowY:"auto", display:"flex", flexDirection:"column", gap:"4px" }}>
          {filtered.length===0 ? (
            <div style={{ textAlign:"center", padding:"32px 16px", color:MUTED, fontSize:"12px" }}>Tidak ditemukan</div>
          ) : filtered.map(c=>{
            const t=TIER_CFG[calcTier(c.totalBelanja)], isSel=c.id===selId;
            return (
              <div key={c.id} onClick={()=>setSelId(c.id)}
                style={{ background:isSel?"rgba(0,255,136,0.06)":CARD, border:isSel?`1px solid rgba(0,255,136,0.25)`:BORD, borderLeft:`3px solid ${isSel?t.color:"transparent"}`, padding:"10px 12px", cursor:"pointer", transition:"all 0.15s", display:"flex", alignItems:"center", gap:"10px" }}
                onMouseEnter={e=>{ if(!isSel) e.currentTarget.style.background="rgba(0,255,136,0.03)"; }}
                onMouseLeave={e=>{ if(!isSel) e.currentTarget.style.background=CARD; }}>
                <div style={{ width:"32px", height:"32px", borderRadius:"50%", background:`rgba(${t.rgb},0.12)`, border:`1px solid rgba(${t.rgb},0.3)`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"10px", fontWeight:900, color:t.color, flexShrink:0 }}>
                  {initials(c.nama)}
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ color:TEXT, fontWeight:700, fontSize:"12px", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{c.nama}</div>
                  <div style={{ color:MUTED, fontSize:"10px", marginTop:"1px" }}>{c.kota} · {c.totalOrder} order</div>
                </div>
                <div style={{ width:"7px", height:"7px", borderRadius:"50%", background:t.color, boxShadow:`0 0 6px ${t.color}`, flexShrink:0 }} />
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Right Panel ── */}
      <div style={{ flex:1, overflow:"hidden" }}>
        {sel ? (
          <DetailPanel c={sel} onEdit={openEdit} onDel={openDel} onUpdate={updateField} />
        ) : (
          <div style={{ height:"100%", display:"flex", alignItems:"center", justifyContent:"center", background:CARD, border:BORD }}>
            <div style={{ textAlign:"center", opacity:0.3 }}>
              <div style={{ fontSize:"40px", marginBottom:"10px" }}>◎</div>
              <div style={{ color:TEXT, fontWeight:700, fontSize:"13px" }}>Pilih pelanggan untuk melihat profil</div>
            </div>
          </div>
        )}
      </div>

      {/* ── Edit / Add Modal ── */}
      {(modal==="edit"||modal==="add") && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.85)", zIndex:50, display:"flex", alignItems:"center", justifyContent:"center", padding:"16px" }}
          onClick={e=>{if(e.target===e.currentTarget)closeModal();}}>
          <div style={{ background:"#0a0a18", border:`1px solid ${NEON}`, boxShadow:"0 0 50px rgba(0,255,136,0.12)", width:"100%", maxWidth:"420px", padding:"26px" }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"16px" }}>
              <div style={{ color:TEXT, fontWeight:900, fontSize:"15px" }}>{modal==="add"?"Tambah Pelanggan":"Edit Pelanggan"}</div>
              <button onClick={closeModal} style={{ color:MUTED, background:"none", border:"none", cursor:"pointer", fontSize:"18px" }}>✕</button>
            </div>
            <div style={{ height:"1px", background:`linear-gradient(to right,${NEON},transparent)`, marginBottom:"20px" }} />
            <form onSubmit={modal==="add"?addCustomer:saveEdit} className="space-y-4">
              <NeonInput label="Nama Lengkap" required placeholder="Nama..." value={form.nama} onChange={e=>setForm(p=>({...p,nama:e.target.value}))} />
              <div className="grid grid-cols-2 gap-3">
                <NeonInput label="No. Telepon" required placeholder="0812-xxx" value={form.phone} onChange={e=>setForm(p=>({...p,phone:e.target.value}))} />
                <NeonInput label="Kota" required placeholder="Jakarta" value={form.kota} onChange={e=>setForm(p=>({...p,kota:e.target.value}))} />
              </div>
              <NeonInput label="Email" type="email" placeholder="email@..." value={form.email} onChange={e=>setForm(p=>({...p,email:e.target.value}))} />
              <div style={{ display:"flex", gap:"10px", paddingTop:"4px" }}>
                <button type="button" onClick={closeModal} style={{ flex:1, padding:"11px", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(0,255,136,0.15)", color:MUTED, fontWeight:700, fontSize:"13px", cursor:"pointer" }}>Batal</button>
                <button type="submit" style={{ flex:1, padding:"11px", background:"rgba(0,255,136,0.15)", border:`1px solid ${NEON}`, color:NEON, fontWeight:900, fontSize:"13px", cursor:"pointer" }}>
                  {modal==="add"?"Tambah":"Simpan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Delete Confirm ── */}
      {modal==="delete" && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.88)", zIndex:50, display:"flex", alignItems:"center", justifyContent:"center", padding:"16px" }}
          onClick={e=>{if(e.target===e.currentTarget)closeModal();}}>
          <div style={{ background:"#0a0a18", border:`1px solid ${PINK}`, boxShadow:`0 0 50px rgba(255,45,120,0.12)`, width:"100%", maxWidth:"340px", padding:"28px", textAlign:"center" }}>
            <div style={{ fontSize:"34px", marginBottom:"10px" }}>⚠</div>
            <div style={{ color:TEXT, fontWeight:900, fontSize:"15px", marginBottom:"4px" }}>Hapus Pelanggan?</div>
            <div style={{ color:PINK, fontWeight:900, fontSize:"13px", marginBottom:"16px" }}>{sel?.nama}</div>
            <div style={{ height:"1px", background:`linear-gradient(to right,transparent,${PINK},transparent)`, marginBottom:"16px" }} />
            <p style={{ color:MUTED, fontSize:"11px", marginBottom:"18px" }}>Semua data pelanggan ini akan dihapus permanen.</p>
            <div style={{ display:"flex", gap:"10px" }}>
              <button onClick={closeModal} style={{ flex:1, padding:"10px", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(0,255,136,0.15)", color:MUTED, fontWeight:700, fontSize:"12px", cursor:"pointer" }}>Batal</button>
              <button onClick={deleteCustomer} style={{ flex:1, padding:"10px", background:"rgba(255,45,120,0.15)", border:`1px solid ${PINK}`, color:PINK, fontWeight:900, fontSize:"12px", cursor:"pointer" }}>Ya, Hapus</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
