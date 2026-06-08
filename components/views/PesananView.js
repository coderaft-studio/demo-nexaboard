"use client";
import { useState, useMemo, useRef } from "react";

const NEON  = "#00ff88";
const PINK  = "#ff2d78";
const CYAN  = "#00e5ff";
const YLW   = "#ffe033";
const CARD  = "#0d0d20";
const TEXT  = "#e0e8ff";
const MUTED = "rgba(224,232,255,0.4)";
const BORD  = "1px solid rgba(0,255,136,0.1)";

const STATUS_FLOW = ["Pending","Proses","Dikirim","Selesai"];

const COLS = [
  { key:"Pending", color:MUTED, rgb:"224,232,255", icon:"◌" },
  { key:"Proses",  color:CYAN,  rgb:"0,229,255",   icon:"◎" },
  { key:"Dikirim", color:YLW,   rgb:"255,224,51",  icon:"◈" },
  { key:"Selesai", color:NEON,  rgb:"0,255,136",   icon:"◉" },
];

const SCFG = {
  Pending: { color:MUTED, rgb:"224,232,255", bg:"rgba(224,232,255,0.06)", brd:"rgba(224,232,255,0.15)" },
  Proses:  { color:CYAN,  rgb:"0,229,255",   bg:"rgba(0,229,255,0.1)",    brd:"rgba(0,229,255,0.3)" },
  Dikirim: { color:YLW,   rgb:"255,224,51",  bg:"rgba(255,224,51,0.1)",   brd:"rgba(255,224,51,0.3)" },
  Selesai: { color:NEON,  rgb:"0,255,136",   bg:"rgba(0,255,136,0.1)",    brd:"rgba(0,255,136,0.3)" },
};

const PRODUCTS = [
  { nama:"Sneakers Neon X1",   harga:650000 },
  { nama:"Jacket Urban V2",    harga:480000 },
  { nama:"Cap Street Edition", harga:150000 },
  { nama:"Tote Bag Minimal",   harga:95000  },
  { nama:"Hoodie Cyber Black", harga:380000 },
  { nama:"Sneakers Neo Volt",  harga:720000 },
  { nama:"Chain Necklace Set", harga:125000 },
  { nama:"Backpack Urban Pro", harga:320000 },
];

const INIT = [
  { id:"#ORD-001", customer:"Budi Santoso",   phone:"0812-3456-7890", product:"Sneakers Neon X1",   qty:2, total:1300000, status:"Selesai", date:"07 Jun", alamat:"Jl. Merdeka No.12, Jakarta" },
  { id:"#ORD-002", customer:"Sari Dewi",      phone:"0821-9876-5432", product:"Jacket Urban V2",    qty:1, total:480000,  status:"Dikirim", date:"07 Jun", alamat:"Jl. Sudirman No.45, Bandung" },
  { id:"#ORD-003", customer:"Ahmad Rizki",    phone:"0857-1234-5678", product:"Cap Street Edition", qty:3, total:450000,  status:"Proses",  date:"06 Jun", alamat:"Jl. Gatot Subroto No.8, Surabaya" },
  { id:"#ORD-004", customer:"Rina Wulandari", phone:"0813-5555-7777", product:"Tote Bag Minimal",   qty:2, total:190000,  status:"Pending", date:"06 Jun", alamat:"Jl. Diponegoro No.3, Yogyakarta" },
  { id:"#ORD-005", customer:"Hendra Jaya",    phone:"0878-2222-3333", product:"Sneakers Neon X1",   qty:1, total:650000,  status:"Pending", date:"05 Jun", alamat:"Jl. Ahmad Yani No.77, Semarang" },
  { id:"#ORD-006", customer:"Dewi Kusuma",    phone:"0819-4444-6666", product:"Hoodie Cyber Black",  qty:2, total:760000,  status:"Selesai", date:"05 Jun", alamat:"Jl. Imam Bonjol No.21, Medan" },
  { id:"#ORD-007", customer:"Fajar Nugroho",  phone:"0853-8888-1111", product:"Sneakers Neo Volt",   qty:1, total:720000,  status:"Dikirim", date:"04 Jun", alamat:"Jl. Pemuda No.56, Bekasi" },
  { id:"#ORD-008", customer:"Nita Sari",      phone:"0877-6543-2109", product:"Chain Necklace Set",  qty:4, total:500000,  status:"Proses",  date:"04 Jun", alamat:"Jl. Asia Afrika No.3, Bandung" },
];

const BLANK = { customer:"", phone:"", product:PRODUCTS[0].nama, qty:"1", alamat:"" };

function initials(name) {
  return name.split(" ").slice(0,2).map(w=>w[0]).join("").toUpperCase();
}

function StatusBadge({ status }) {
  const s = SCFG[status];
  return <span style={{ color:s.color, background:s.bg, border:`1px solid ${s.brd}`, padding:"2px 8px", fontSize:"10px", fontWeight:700 }}>{status}</span>;
}

function StatusStepper({ status }) {
  const cur = STATUS_FLOW.indexOf(status);
  return (
    <div>
      <div style={{ display:"flex", alignItems:"center", marginBottom:"8px" }}>
        {STATUS_FLOW.map((s, i) => {
          const done = i <= cur;
          const isCur = i === cur;
          const cfg = SCFG[s];
          return (
            <div key={s} style={{ display:"flex", alignItems:"center", flex:i<STATUS_FLOW.length-1?1:"none" }}>
              <div style={{ width:"24px", height:"24px", borderRadius:"50%", border:`2px solid ${done?cfg.color:"rgba(255,255,255,0.1)"}`, display:"flex", alignItems:"center", justifyContent:"center", background:done?`rgba(${cfg.rgb},0.12)`:"transparent", boxShadow:isCur?`0 0 12px rgba(${cfg.rgb},0.5)`:"none", flexShrink:0 }}>
                <span style={{ color:done?cfg.color:"rgba(255,255,255,0.2)", fontSize:"10px", fontWeight:900 }}>{done?"✓":i+1}</span>
              </div>
              {i<STATUS_FLOW.length-1 && <div style={{ flex:1, height:"2px", margin:"0 5px", background:i<cur?NEON:"rgba(255,255,255,0.08)", boxShadow:i<cur?`0 0 6px rgba(0,255,136,0.4)`:"none" }} />}
            </div>
          );
        })}
      </div>
      <div style={{ display:"flex" }}>
        {STATUS_FLOW.map((s,i) => {
          const done = i<=cur;
          const cfg = SCFG[s];
          return <div key={s} style={{ flex:i<STATUS_FLOW.length-1?1:"none", fontSize:"9px", fontWeight:700, color:done?cfg.color:MUTED, textAlign:i===0?"left":i===STATUS_FLOW.length-1?"right":"center" }}>{s}</div>;
        })}
      </div>
    </div>
  );
}

function NeonInput({ label, ...props }) {
  return (
    <div>
      <label style={{ display:"block", color:MUTED, fontSize:"11px", fontWeight:700, marginBottom:"5px", letterSpacing:"0.08em", textTransform:"uppercase" }}>{label}</label>
      <input {...props} style={{ width:"100%", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(0,255,136,0.2)", color:TEXT, padding:"9px 12px", fontSize:"13px", outline:"none", boxSizing:"border-box" }}
        onFocus={e=>e.target.style.borderColor=NEON}
        onBlur={e =>e.target.style.borderColor="rgba(0,255,136,0.2)"} />
    </div>
  );
}

/* ── Drop indicator line ── */
function DropLine({ color, rgb }) {
  return (
    <div style={{ position:"relative", height:"3px", background:color, boxShadow:`0 0 10px rgba(${rgb},0.9)`, margin:"2px 0", flexShrink:0 }}>
      <div style={{ position:"absolute", left:0, top:"50%", transform:"translateY(-50%)", width:"10px", height:"10px", borderRadius:"50%", background:color, boxShadow:`0 0 8px rgba(${rgb},0.8)` }} />
    </div>
  );
}

/* ── Kanban Card ── */
function KanbanCard({ o, onDetail, onAdvance, onDragStart, onDragEnd, isDragging, onHoverEnter, onHoverLeave }) {
  const cfg = SCFG[o.status];
  const nextStatus = STATUS_FLOW[STATUS_FLOW.indexOf(o.status)+1];
  const init = initials(o.customer);

  return (
    <div
      data-card="true"
      draggable
      onDragStart={e => onDragStart(e, o)}
      onDragEnd={onDragEnd}
      onClick={()=>{ if(!isDragging) onDetail(o); }}
      style={{ background:"#080812", border:"1px solid rgba(255,255,255,0.06)", borderLeft:`3px solid ${cfg.color}`, padding:"13px 14px", cursor: isDragging ? "grabbing" : "grab", transition:"border 0.15s, box-shadow 0.15s", opacity: isDragging ? 0.3 : 1, userSelect:"none", flexShrink:0 }}
      onMouseEnter={e=>{ onHoverEnter?.(); if(!isDragging){ e.currentTarget.style.background="#0d0d20"; e.currentTarget.style.boxShadow=`0 4px 20px rgba(${cfg.rgb},0.1)`; }}}
      onMouseLeave={e=>{ onHoverLeave?.(); e.currentTarget.style.background="#080812"; e.currentTarget.style.boxShadow="none"; }}>

      {/* Drag handle + date */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"10px" }}>
        <span style={{ color:NEON, fontSize:"11px", fontWeight:900 }}>{o.id}</span>
        <div style={{ display:"flex", alignItems:"center", gap:"6px" }}>
          <span style={{ color:MUTED, fontSize:"9px" }}>{o.date}</span>
          <span style={{ color:`rgba(${cfg.rgb},0.4)`, fontSize:"13px", letterSpacing:"-1px" }}>⠿</span>
        </div>
      </div>

      {/* Customer avatar + name */}
      <div style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"10px" }}>
        <div style={{ width:"30px", height:"30px", borderRadius:"50%", background:`rgba(${cfg.rgb},0.12)`, border:`1px solid rgba(${cfg.rgb},0.3)`, display:"flex", alignItems:"center", justifyContent:"center", color:cfg.color, fontSize:"10px", fontWeight:900, flexShrink:0 }}>
          {init}
        </div>
        <div style={{ overflow:"hidden" }}>
          <div style={{ color:TEXT, fontWeight:700, fontSize:"12px", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{o.customer}</div>
          <div style={{ color:MUTED, fontSize:"10px" }}>{o.phone}</div>
        </div>
      </div>

      {/* Separator */}
      <div style={{ height:"1px", background:`rgba(${cfg.rgb},0.1)`, marginBottom:"8px" }} />

      {/* Product + total */}
      <div style={{ color:MUTED, fontSize:"11px", marginBottom:"4px", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
        {o.product} · {o.qty} pcs
      </div>
      <div style={{ color:cfg.color, fontWeight:900, fontSize:"14px", marginBottom: nextStatus?"10px":"0", filter:`drop-shadow(0 0 6px rgba(${cfg.rgb},0.3))` }}>
        Rp {o.total.toLocaleString("id-ID")}
      </div>

      {/* Advance button */}
      {nextStatus && (
        <button
          onClick={e=>{ e.stopPropagation(); onAdvance(o.id); }}
          style={{ width:"100%", padding:"6px", background:`rgba(${cfg.rgb},0.08)`, border:`1px solid rgba(${cfg.rgb},0.2)`, color:cfg.color, fontSize:"10px", fontWeight:700, cursor:"pointer", letterSpacing:"0.05em", transition:"background 0.15s" }}
          onMouseEnter={e=>e.currentTarget.style.background=`rgba(${cfg.rgb},0.2)`}
          onMouseLeave={e=>e.currentTarget.style.background=`rgba(${cfg.rgb},0.08)`}>
          → {nextStatus}
        </button>
      )}
    </div>
  );
}

/* ── Main ── */
export default function PesananView() {
  const [orders,   setOrders]   = useState(INIT);
  const [search,   setSearch]   = useState("");
  const [modal,    setModal]    = useState(null);
  const [sel,      setSel]      = useState(null);
  const [form,     setForm]     = useState(BLANK);
  const [dragState,  setDragState]  = useState(null);
  const [dropTarget, setDropTarget] = useState(null);
  const [hovCard,    setHovCard]    = useState(false);
  const [curPos,     setCurPos]     = useState({ x:0, y:0 });
  const curPosRef = useRef({ x:0, y:0 });

  const searchedOrders = useMemo(() =>
    !search ? orders : orders.filter(o =>
      o.customer.toLowerCase().includes(search.toLowerCase()) ||
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.product.toLowerCase().includes(search.toLowerCase())
    ), [orders, search]);

  const totalRevenue = useMemo(() =>
    orders.filter(o=>o.status==="Selesai").reduce((a,o)=>a+o.total,0), [orders]);

  const advanceStatus = (id) => {
    setOrders(prev=>prev.map(o=>{
      if(o.id!==id) return o;
      const idx = STATUS_FLOW.indexOf(o.status);
      if(idx>=STATUS_FLOW.length-1) return o;
      return { ...o, status:STATUS_FLOW[idx+1] };
    }));
    if(sel?.id===id) setSel(prev=>({ ...prev, status:STATUS_FLOW[STATUS_FLOW.indexOf(prev.status)+1] }));
  };

  const deleteOrder = () => { setOrders(prev=>prev.filter(o=>o.id!==sel.id)); closeModal(); };

  const addOrder = (e) => {
    e.preventDefault();
    const prod = PRODUCTS.find(p=>form.product.startsWith(p.nama));
    const qty  = Number(form.qty);
    setOrders(prev=>[...prev, {
      id:`#ORD-${String(prev.length+1).padStart(3,"0")}`,
      customer:form.customer, phone:form.phone, product:form.product.split(" —")[0],
      qty, total:(prod?.harga||0)*qty, status:"Pending", date:"08 Jun", alamat:form.alamat,
    }]);
    closeModal();
  };

  /* ── Drag handlers ── */
  const resetDrag = () => { setDragState(null); setDropTarget(null); };

  const checkCursorOverCard = () => {
    const { x, y } = curPosRef.current;
    const el = document.elementFromPoint(x, y);
    setHovCard(!!(el?.closest?.("[data-card]")));
  };

  const handleDragStart = (e, o) => {
    setDragState({ id: o.id, fromCol: o.status });
    setHovCard(false);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragEnd = () => {
    resetDrag();
    setHovCard(false);
    setTimeout(checkCursorOverCard, 60);
  };

  const handleColDragOver = (e, colKey) => {
    e.preventDefault();
    // Query all [data-card] elements inside this column to find insert position
    const cardEls = Array.from(e.currentTarget.querySelectorAll("[data-card]"));
    let insertIdx = cardEls.length; // default: end of column
    for (let i = 0; i < cardEls.length; i++) {
      const rect = cardEls[i].getBoundingClientRect();
      if (e.clientY < rect.top + rect.height / 2) {
        insertIdx = i;
        break;
      }
    }
    setDropTarget(prev =>
      prev?.colKey === colKey && prev?.insertIdx === insertIdx
        ? prev : { colKey, insertIdx }
    );
  };

  const handleColDragLeave = (e) => {
    // Only clear if leaving the column entirely (not just moving between children)
    if (!e.currentTarget.contains(e.relatedTarget)) setDropTarget(null);
  };

  const handleDrop = (e, toColKey) => {
    e.preventDefault();
    if (!dragState || !dropTarget) { resetDrag(); return; }

    const draggedCard = orders.find(o => o.id === dragState.id);
    if (!draggedCard) { resetDrag(); return; }

    // Remove dragged card from list
    let newOrders = orders.filter(o => o.id !== dragState.id);

    // Adjust insertIdx when same column: querySelectorAll included dragged card
    let insertIdx = dropTarget.insertIdx;
    if (dragState.fromCol === toColKey) {
      const colCards = orders.filter(o => o.status === dragState.fromCol);
      const draggedColIdx = colCards.findIndex(o => o.id === dragState.id);
      if (draggedColIdx < insertIdx) insertIdx = Math.max(0, insertIdx - 1);
    }

    // Target column cards (after removing dragged)
    const targetColCards = newOrders.filter(o => o.status === toColKey);
    insertIdx = Math.min(insertIdx, targetColCards.length);

    const updatedCard = { ...draggedCard, status: toColKey };

    if (insertIdx >= targetColCards.length) {
      // Insert after last card of target col
      let lastIdx = -1;
      for (let i = newOrders.length - 1; i >= 0; i--) {
        if (newOrders[i].status === toColKey) { lastIdx = i; break; }
      }
      lastIdx === -1 ? newOrders.push(updatedCard) : newOrders.splice(lastIdx + 1, 0, updatedCard);
    } else {
      // Insert before target card
      const beforeCard = targetColCards[insertIdx];
      const beforeIdx = newOrders.findIndex(o => o.id === beforeCard.id);
      newOrders.splice(beforeIdx, 0, updatedCard);
    }

    setOrders(newOrders);
    resetDrag();
    setHovCard(false);
    setTimeout(checkCursorOverCard, 60);
  };

  const openDetail = (o) => { setSel(o); setModal("detail"); };
  const closeModal = ()  => { setModal(null); setSel(null); setForm(BLANK); };

  return (
    <div className="space-y-4">

      {/* ── Toolbar ── */}
      <div style={{ background:CARD, border:BORD, padding:"13px 18px", display:"flex", flexWrap:"wrap", gap:"10px", alignItems:"center", justifyContent:"space-between" }}>
        <div style={{ display:"flex", gap:"20px", flexWrap:"wrap" }}>
          <div>
            <span style={{ color:MUTED, fontSize:"11px" }}>Total Pesanan · </span>
            <span style={{ color:TEXT, fontWeight:700, fontSize:"13px" }}>{orders.length}</span>
          </div>
          <div>
            <span style={{ color:MUTED, fontSize:"11px" }}>Pendapatan · </span>
            <span style={{ color:NEON, fontWeight:700, fontSize:"13px" }}>Rp {totalRevenue.toLocaleString("id-ID")}</span>
          </div>
        </div>
        <div style={{ display:"flex", gap:"8px", alignItems:"center" }}>
          <div style={{ position:"relative" }}>
            <span style={{ position:"absolute", left:"10px", top:"50%", transform:"translateY(-50%)", color:MUTED, fontSize:"12px" }}>⌕</span>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Cari pesanan..."
              style={{ paddingLeft:"28px", paddingRight:"10px", paddingTop:"7px", paddingBottom:"7px", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(0,255,136,0.15)", color:TEXT, fontSize:"12px", outline:"none", width:"190px" }}
              onFocus={e=>e.target.style.borderColor=NEON}
              onBlur={e =>e.target.style.borderColor="rgba(0,255,136,0.15)"} />
          </div>
          <button onClick={()=>{ setForm(BLANK); setModal("add"); }}
            style={{ background:"rgba(0,255,136,0.15)", border:`1px solid ${NEON}`, color:NEON, padding:"7px 16px", fontSize:"12px", fontWeight:900, cursor:"pointer", boxShadow:"0 0 12px rgba(0,255,136,0.15)", whiteSpace:"nowrap" }}>
            + Pesanan Baru
          </button>
        </div>
      </div>

      {/* ── Kanban Board ── */}
      <div onMouseMove={e => { const p={x:e.clientX,y:e.clientY}; curPosRef.current=p; setCurPos(p); }}
        style={{ display:"grid", gridTemplateColumns:"repeat(4, minmax(220px,1fr))", gap:"12px", overflowX:"auto", paddingBottom:"4px" }}>
        {COLS.map(col => {
          const colOrders = searchedOrders.filter(o=>o.status===col.key);
          return (
            <div key={col.key}
            onDragOver={e => handleColDragOver(e, col.key)}
            onDragLeave={handleColDragLeave}
            onDrop={e => handleDrop(e, col.key)}
            style={{ background: dropTarget?.colKey===col.key ? `rgba(${col.rgb},0.06)` : CARD, border: dropTarget?.colKey===col.key ? `1px solid rgba(${col.rgb},0.45)` : BORD, borderTop:`3px solid ${col.color}`, display:"flex", flexDirection:"column", minHeight:"480px", transition:"background 0.12s, border-color 0.12s", boxShadow: dropTarget?.colKey===col.key ? `inset 0 0 24px rgba(${col.rgb},0.04), 0 0 16px rgba(${col.rgb},0.08)` : "none" }}>

              {/* Column header */}
              <div style={{ padding:"14px 16px", borderBottom:"1px solid rgba(0,255,136,0.08)", display:"flex", alignItems:"center", justifyContent:"space-between", flexShrink:0 }}>
                <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
                  <span style={{ color:col.color, fontSize:"14px", filter:`drop-shadow(0 0 6px rgba(${col.rgb},0.6))` }}>{col.icon}</span>
                  <span style={{ color:TEXT, fontWeight:900, fontSize:"13px" }}>{col.key}</span>
                </div>
                <div style={{ background:`rgba(${col.rgb},0.12)`, border:`1px solid rgba(${col.rgb},0.25)`, color:col.color, fontWeight:900, fontSize:"12px", padding:"2px 9px", minWidth:"28px", textAlign:"center" }}>
                  {colOrders.length}
                </div>
              </div>

              {/* Cards */}
              <div style={{ padding:"10px", display:"flex", flexDirection:"column", gap:"8px", flex:1, overflowY:"auto" }}>
                {colOrders.length === 0 ? (
                  <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:"8px", opacity:0.3 }}>
                    <div style={{ fontSize:"24px" }}>◌</div>
                    <div style={{ color:MUTED, fontSize:"11px" }}>Kosong</div>
                  </div>
                ) : (() => {
                    const els = [];
                    colOrders.forEach((o, idx) => {
                      // DropLine above this card
                      if (dropTarget?.colKey===col.key && dropTarget?.insertIdx===idx)
                        els.push(<DropLine key={`dl-${idx}`} color={col.color} rgb={col.rgb} />);
                      els.push(
                        <KanbanCard key={o.id} o={o}
                          onDetail={openDetail}
                          onAdvance={advanceStatus}
                          onDragStart={handleDragStart}
                          onDragEnd={handleDragEnd}
                          isDragging={dragState?.id===o.id}
                          onHoverEnter={() => setHovCard(true)}
                          onHoverLeave={() => setHovCard(false)} />
                      );
                    });
                    // DropLine at end of column
                    if (dropTarget?.colKey===col.key && dropTarget?.insertIdx===colOrders.length)
                      els.push(<DropLine key="dl-end" color={col.color} rgb={col.rgb} />);
                    return els;
                  })()
                }
              </div>

              {/* Column total */}
              {colOrders.length > 0 && (
                <div style={{ padding:"10px 16px", borderTop:"1px solid rgba(0,255,136,0.06)", flexShrink:0 }}>
                  <div style={{ color:MUTED, fontSize:"10px" }}>
                    Total: <span style={{ color:col.color, fontWeight:700 }}>
                      Rp {colOrders.reduce((a,o)=>a+o.total,0).toLocaleString("id-ID")}
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ── Card cursor tooltip ── */}
      {hovCard && !dragState && (
        <div style={{ position:"fixed", left:curPos.x+14, top:curPos.y+14, background:"#08080f", border:`1px solid ${CYAN}`, color:CYAN, padding:"4px 10px", fontSize:"11px", fontWeight:700, letterSpacing:"0.05em", whiteSpace:"nowrap", pointerEvents:"none", zIndex:55, boxShadow:`0 0 12px rgba(0,229,255,0.25)` }}>
          👆 Klik · ✋ Drag
        </div>
      )}

      {/* ── Detail Modal ── */}
      {modal==="detail" && sel && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.85)", zIndex:50, display:"flex", alignItems:"center", justifyContent:"center", padding:"16px" }}
          onClick={e=>{if(e.target===e.currentTarget)closeModal();}}>
          <div style={{ background:"#0a0a18", border:`1px solid ${SCFG[sel.status].color}`, boxShadow:`0 0 50px rgba(${SCFG[sel.status].rgb},0.12)`, width:"100%", maxWidth:"460px" }}>

            {/* Header */}
            <div style={{ padding:"20px 22px", borderBottom:`1px solid rgba(${SCFG[sel.status].rgb},0.12)`, display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
              <div>
                <div style={{ color:NEON, fontWeight:900, fontSize:"16px" }}>{sel.id}</div>
                <div style={{ color:MUTED, fontSize:"11px", marginTop:"2px" }}>{sel.date} · {sel.customer}</div>
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
                <StatusBadge status={sel.status} />
                <button onClick={closeModal} style={{ color:MUTED, background:"none", border:"none", cursor:"pointer", fontSize:"18px" }}>✕</button>
              </div>
            </div>

            {/* Stepper */}
            <div style={{ padding:"16px 22px", borderBottom:"1px solid rgba(0,255,136,0.06)" }}>
              <StatusStepper status={sel.status} />
            </div>

            {/* Info grid */}
            <div style={{ padding:"16px 22px", borderBottom:"1px solid rgba(0,255,136,0.06)" }}>
              <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                {[
                  { l:"Pelanggan", v:sel.customer },
                  { l:"Telepon",   v:sel.phone },
                  { l:"Produk",    v:sel.product },
                  { l:"Jumlah",    v:`${sel.qty} pcs` },
                  { l:"Total",     v:`Rp ${sel.total.toLocaleString("id-ID")}`, hl:true },
                  { l:"Status",    v:sel.status },
                ].map(item=>(
                  <div key={item.l}>
                    <div style={{ color:MUTED, fontSize:"10px", fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:"2px" }}>{item.l}</div>
                    <div style={{ color:item.hl?NEON:TEXT, fontWeight:item.hl?900:600, fontSize:"13px" }}>{item.v}</div>
                  </div>
                ))}
                <div className="col-span-2">
                  <div style={{ color:MUTED, fontSize:"10px", fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:"2px" }}>Alamat</div>
                  <div style={{ color:TEXT, fontWeight:600, fontSize:"13px" }}>{sel.alamat}</div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div style={{ padding:"14px 22px", display:"flex", gap:"8px" }}>
              <button onClick={()=>setModal("delete")}
                style={{ padding:"9px 14px", background:"rgba(255,45,120,0.08)", border:"1px solid rgba(255,45,120,0.25)", color:PINK, fontWeight:700, fontSize:"12px", cursor:"pointer" }}
                onMouseEnter={e=>e.currentTarget.style.background="rgba(255,45,120,0.18)"}
                onMouseLeave={e=>e.currentTarget.style.background="rgba(255,45,120,0.08)"}>
                Hapus
              </button>
              <div style={{ flex:1 }} />
              <button onClick={closeModal}
                style={{ padding:"9px 14px", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(0,255,136,0.15)", color:MUTED, fontWeight:700, fontSize:"12px", cursor:"pointer" }}>
                Tutup
              </button>
              {sel.status!=="Selesai" && (
                <button onClick={()=>advanceStatus(sel.id)}
                  style={{ padding:"9px 18px", background:"rgba(0,255,136,0.15)", border:`1px solid ${NEON}`, color:NEON, fontWeight:900, fontSize:"12px", cursor:"pointer", boxShadow:"0 0 12px rgba(0,255,136,0.15)" }}>
                  → {STATUS_FLOW[STATUS_FLOW.indexOf(sel.status)+1]}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Add Modal ── */}
      {modal==="add" && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.85)", zIndex:50, display:"flex", alignItems:"center", justifyContent:"center", padding:"16px" }}
          onClick={e=>{if(e.target===e.currentTarget)closeModal();}}>
          <div style={{ background:"#0a0a18", border:`1px solid ${NEON}`, boxShadow:"0 0 50px rgba(0,255,136,0.12)", width:"100%", maxWidth:"440px", padding:"26px" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"16px" }}>
              <div style={{ color:TEXT, fontWeight:900, fontSize:"15px" }}>Pesanan Baru</div>
              <button onClick={closeModal} style={{ color:MUTED, background:"none", border:"none", cursor:"pointer", fontSize:"18px" }}>✕</button>
            </div>
            <div style={{ height:"1px", background:`linear-gradient(to right,${NEON},transparent)`, marginBottom:"20px" }} />
            <form onSubmit={addOrder} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <NeonInput label="Nama Pelanggan" required placeholder="Budi Santoso" value={form.customer} onChange={e=>setForm(p=>({...p,customer:e.target.value}))} />
                <NeonInput label="No. Telepon" required placeholder="0812-xxx" value={form.phone} onChange={e=>setForm(p=>({...p,phone:e.target.value}))} />
              </div>
              <div>
                <label style={{ display:"block", color:MUTED, fontSize:"11px", fontWeight:700, marginBottom:"5px", letterSpacing:"0.08em", textTransform:"uppercase" }}>Produk</label>
                <select value={form.product} onChange={e=>setForm(p=>({...p,product:e.target.value}))}
                  style={{ width:"100%", background:"#0a0a18", border:"1px solid rgba(0,255,136,0.2)", color:TEXT, padding:"9px 12px", fontSize:"13px", outline:"none", boxSizing:"border-box" }}>
                  {PRODUCTS.map(p=><option key={p.nama}>{p.nama} — Rp {p.harga.toLocaleString("id-ID")}</option>)}
                </select>
              </div>
              <NeonInput label="Jumlah (qty)" required type="number" min="1" placeholder="1" value={form.qty} onChange={e=>setForm(p=>({...p,qty:e.target.value}))} />
              <NeonInput label="Alamat Pengiriman" required placeholder="Jl. ..." value={form.alamat} onChange={e=>setForm(p=>({...p,alamat:e.target.value}))} />
              {form.qty && (
                <div style={{ background:"rgba(0,255,136,0.05)", border:"1px solid rgba(0,255,136,0.15)", padding:"9px 14px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <span style={{ color:MUTED, fontSize:"12px" }}>Estimasi Total</span>
                  <span style={{ color:NEON, fontWeight:900, fontSize:"15px" }}>
                    Rp {((PRODUCTS.find(p=>form.product.startsWith(p.nama))?.harga||0)*Number(form.qty)).toLocaleString("id-ID")}
                  </span>
                </div>
              )}
              <div style={{ display:"flex", gap:"10px", paddingTop:"4px" }}>
                <button type="button" onClick={closeModal} style={{ flex:1, padding:"11px", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(0,255,136,0.15)", color:MUTED, fontWeight:700, fontSize:"13px", cursor:"pointer" }}>Batal</button>
                <button type="submit" style={{ flex:1, padding:"11px", background:"rgba(0,255,136,0.15)", border:`1px solid ${NEON}`, color:NEON, fontWeight:900, fontSize:"13px", cursor:"pointer", boxShadow:"0 0 12px rgba(0,255,136,0.15)" }}>Buat Pesanan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Delete Confirm ── */}
      {modal==="delete" && sel && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.9)", zIndex:60, display:"flex", alignItems:"center", justifyContent:"center", padding:"16px" }}
          onClick={e=>{if(e.target===e.currentTarget)closeModal();}}>
          <div style={{ background:"#0a0a18", border:`1px solid ${PINK}`, boxShadow:`0 0 50px rgba(255,45,120,0.15)`, width:"100%", maxWidth:"340px", padding:"28px", textAlign:"center" }}>
            <div style={{ fontSize:"34px", marginBottom:"10px" }}>⚠</div>
            <div style={{ color:TEXT, fontWeight:900, fontSize:"15px", marginBottom:"4px" }}>Hapus Pesanan?</div>
            <div style={{ color:PINK, fontWeight:900, fontSize:"13px", marginBottom:"16px" }}>{sel.id} · {sel.customer}</div>
            <div style={{ height:"1px", background:`linear-gradient(to right,transparent,${PINK},transparent)`, marginBottom:"16px" }} />
            <p style={{ color:MUTED, fontSize:"11px", marginBottom:"18px" }}>Tindakan ini tidak dapat dibatalkan.</p>
            <div style={{ display:"flex", gap:"10px" }}>
              <button onClick={()=>setModal("detail")} style={{ flex:1, padding:"10px", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(0,255,136,0.15)", color:MUTED, fontWeight:700, fontSize:"12px", cursor:"pointer" }}>Batal</button>
              <button onClick={deleteOrder} style={{ flex:1, padding:"10px", background:"rgba(255,45,120,0.15)", border:`1px solid ${PINK}`, color:PINK, fontWeight:900, fontSize:"12px", cursor:"pointer" }}>Ya, Hapus</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
