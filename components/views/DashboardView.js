"use client";
import { useState, useEffect } from "react";

const NEON  = "#00ff88";
const PINK  = "#ff2d78";
const CYAN  = "#00e5ff";
const YLW   = "#ffe033";
const CARD  = "#0d0d20";
const TEXT  = "#e0e8ff";
const MUTED = "rgba(224,232,255,0.4)";
const BORD  = "1px solid rgba(0,255,136,0.1)";

const RANGES = ["hari","minggu","bulan","tahun"];
const RLABEL = { hari:"Hari Ini", minggu:"Minggu Ini", bulan:"Bulan Ini", tahun:"Tahun Ini" };

const RD = {
  hari: {
    stats: [
      { numVal:1850000, prefix:"Rp ", change:"+3.2%",  up:true },
      { numVal:47,      prefix:"",    change:"+1.5%",  up:true },
      { numVal:12,      prefix:"",    change:"-2.0%",  up:false },
      { numVal:89,      prefix:"",    change:"+4.1%",  up:true },
    ],
    chart:[{l:"06:00",v:15,a:"Rp 275k"},{l:"08:00",v:35,a:"Rp 648k"},{l:"10:00",v:60,a:"Rp 1.1jt"},{l:"12:00",v:85,a:"Rp 1.6jt"},{l:"14:00",v:70,a:"Rp 1.3jt"},{l:"16:00",v:90,a:"Rp 1.7jt"},{l:"18:00",v:100,a:"Rp 1.85jt"},{l:"20:00",v:55,a:"Rp 1.0jt"},{l:"22:00",v:25,a:"Rp 462k"}],
    chartTotal:"Rp 1.850.000", target:{ pct:74, label:"Rp 1.85jt / Rp 2.5jt" },
    sparks:[[15,30,25,55,45,80,65,85],[10,22,18,38,28,50,42,55],[5,10,8,15,12,18,14,18],[12,25,20,42,35,62,50,72]],
  },
  minggu: {
    stats:[
      { numVal:12450000, prefix:"Rp ", change:"+8.2%",  up:true },
      { numVal:284,      prefix:"",    change:"+5.5%",  up:true },
      { numVal:67,       prefix:"",    change:"+3.1%",  up:true },
      { numVal:521,      prefix:"",    change:"-1.2%",  up:false },
    ],
    chart:[{l:"Sen",v:65,a:"Rp 8.1jt"},{l:"Sel",v:80,a:"Rp 9.9jt"},{l:"Rab",v:55,a:"Rp 6.8jt"},{l:"Kam",v:90,a:"Rp 11.2jt"},{l:"Jum",v:75,a:"Rp 9.3jt"},{l:"Sab",v:100,a:"Rp 12.4jt"},{l:"Min",v:45,a:"Rp 5.6jt"}],
    chartTotal:"Rp 12.450.000", target:{ pct:83, label:"Rp 12.45jt / Rp 15jt" },
    sparks:[[40,55,48,65,58,72,68,80],[30,45,38,55,50,62,58,70],[20,35,28,42,38,50,45,55],[50,42,55,48,60,52,65,58]],
  },
  bulan: {
    stats:[
      { numVal:48250000, prefix:"Rp ", change:"+12.5%", up:true },
      { numVal:1284,     prefix:"",    change:"+8.2%",  up:true },
      { numVal:342,      prefix:"",    change:"+5.1%",  up:true },
      { numVal:5621,     prefix:"",    change:"-2.4%",  up:false },
    ],
    chart:[{l:"M1",v:60,a:"Rp 36jt"},{l:"M2",v:72,a:"Rp 43jt"},{l:"M3",v:45,a:"Rp 27jt"},{l:"M4",v:85,a:"Rp 51jt"},{l:"M5",v:68,a:"Rp 41jt"},{l:"M6",v:90,a:"Rp 54jt"},{l:"M7",v:78,a:"Rp 47jt"},{l:"M8",v:100,a:"Rp 60jt"}],
    chartTotal:"Rp 48.250.000", target:{ pct:80, label:"Rp 48.25jt / Rp 60jt" },
    sparks:[[35,52,45,68,60,75,72,85],[28,40,35,52,48,60,58,70],[18,30,25,40,36,48,45,56],[45,38,52,44,58,50,62,55]],
  },
  tahun: {
    stats:[
      { numVal:587000000, prefix:"Rp ", change:"+24.3%", up:true },
      { numVal:15420,     prefix:"",    change:"+18.7%", up:true },
      { numVal:4102,      prefix:"",    change:"+22.0%", up:true },
      { numVal:67840,     prefix:"",    change:"+15.8%", up:true },
    ],
    chart:[{l:"Jan",v:55,a:"Rp 43jt"},{l:"Feb",v:62,a:"Rp 49jt"},{l:"Mar",v:70,a:"Rp 55jt"},{l:"Apr",v:58,a:"Rp 46jt"},{l:"Mei",v:75,a:"Rp 59jt"},{l:"Jun",v:85,a:"Rp 67jt"},{l:"Jul",v:72,a:"Rp 57jt"},{l:"Agt",v:90,a:"Rp 71jt"},{l:"Sep",v:95,a:"Rp 75jt"},{l:"Okt",v:88,a:"Rp 69jt"},{l:"Nov",v:100,a:"Rp 79jt"},{l:"Des",v:78,a:"Rp 62jt"}],
    chartTotal:"Rp 587.000.000", target:{ pct:82, label:"Rp 587jt / Rp 720jt" },
    sparks:[[30,45,55,50,65,72,80,90],[25,38,48,42,58,65,72,82],[15,25,35,28,42,52,60,70],[35,48,60,52,68,75,80,88]],
  },
};

const SMETA = [
  { label:"Total Pendapatan", icon:"◈", color:NEON, rgb:"0,255,136",  spark:[40,55,48,65,58,72,68,80] },
  { label:"Total Pesanan",    icon:"◎", color:CYAN, rgb:"0,229,255",  spark:[30,45,38,55,50,62,58,70] },
  { label:"Pelanggan Baru",   icon:"⬡", color:PINK, rgb:"255,45,120", spark:[20,35,28,42,38,50,45,55] },
  { label:"Produk Terjual",   icon:"⊞", color:YLW,  rgb:"255,224,51", spark:[50,42,55,48,60,52,65,58] },
];

const DONUT = [
  { label:"Selesai", pct:58, color:NEON },
  { label:"Dikirim", pct:22, color:YLW  },
  { label:"Proses",  pct:14, color:CYAN },
  { label:"Pending", pct: 6, color:PINK },
];

const CUSTOMERS = [
  { name:"Budi Santoso",   init:"BS", total:"Rp 2.450.000", n:14, color:NEON, rgb:"0,255,136" },
  { name:"Sari Dewi",      init:"SD", total:"Rp 1.890.000", n:11, color:CYAN, rgb:"0,229,255" },
  { name:"Rina Wulandari", init:"RW", total:"Rp 1.650.000", n:9,  color:PINK, rgb:"255,45,120" },
  { name:"Ahmad Rizki",    init:"AR", total:"Rp 1.230.000", n:7,  color:YLW,  rgb:"255,224,51" },
];

const LOW_STOCK = [
  { name:"Sneakers Neon X1",   stock:12, color:YLW,  rgb:"255,224,51" },
  { name:"Cap Street Edition", stock:8,  color:PINK, rgb:"255,45,120" },
  { name:"Tote Bag Minimal",   stock:5,  color:PINK, rgb:"255,45,120" },
];

const ORDERS = [
  { id:"#ORD-001", customer:"Budi Santoso",   product:"Sneakers Neon X1",   total:"Rp 650.000", status:"Selesai", date:"07 Jun" },
  { id:"#ORD-002", customer:"Sari Dewi",      product:"Jacket Urban V2",    total:"Rp 480.000", status:"Proses",  date:"07 Jun" },
  { id:"#ORD-003", customer:"Ahmad Rizki",    product:"Cap Street Edition", total:"Rp 150.000", status:"Dikirim", date:"06 Jun" },
  { id:"#ORD-004", customer:"Rina Wulandari", product:"Tote Bag Minimal",   total:"Rp 95.000",  status:"Selesai", date:"06 Jun" },
  { id:"#ORD-005", customer:"Hendra Jaya",    product:"Sneakers Neon X1",   total:"Rp 650.000", status:"Pending", date:"05 Jun" },
];

const SCFG = {
  "Selesai":{ color:NEON, bg:"rgba(0,255,136,0.1)",    brd:"rgba(0,255,136,0.3)" },
  "Proses": { color:CYAN, bg:"rgba(0,229,255,0.1)",    brd:"rgba(0,229,255,0.3)" },
  "Dikirim":{ color:YLW,  bg:"rgba(255,224,51,0.1)",   brd:"rgba(255,224,51,0.3)" },
  "Pending":{ color:MUTED, bg:"rgba(224,232,255,0.06)", brd:"rgba(224,232,255,0.15)" },
};

const TICKER = [
  { t:"✦ BARU  Pesanan #ORD-006 masuk dari Dewi Kusuma", c:NEON },
  { t:"⚠ STOK  Cap Street Edition tersisa 8 unit",       c:YLW  },
  { t:"✓ LUNAS  Pembayaran ORD-003 dikonfirmasi",         c:CYAN },
  { t:"★ MEMBER  Hendra Jaya bergabung sebagai member",   c:PINK },
  { t:"✦ REVIEW  Budi Santoso memberi bintang 5 ⭐",     c:NEON },
  { t:"📦 KIRIM  Pesanan ORD-004 sudah diserahkan kurir", c:CYAN },
];

const X_LABELS = {
  hari:   ["06:00","08:00","10:00","12:00","14:00","16:00","18:00","20:00"],
  minggu: ["Sen","Sel","Rab","Kam","Jum","Sab","Min","  "],
  bulan:  ["M1","M2","M3","M4","M5","M6","M7","M8"],
  tahun:  ["Jan","Mar","Mei","Jul","Agt","Sep","Okt","Des"],
};

/* ── Sub-components ── */

function AreaSparkline({ pts, color, rgb }) {
  const W=200, H=48, max=Math.max(...pts), min=Math.min(...pts);
  const range = max - min || 1;
  const xs = pts.map((_,i) => (i/(pts.length-1))*W);
  const ys = pts.map(p => H - ((p-min)/range)*(H-8) - 4);
  const lineD = xs.map((x,i) => `${i===0?"M":"L"} ${x.toFixed(1)} ${ys[i].toFixed(1)}`).join(" ");
  const areaD = lineD + ` L ${W} ${H} L 0 ${H} Z`;
  const gid = `ag${rgb.replace(/,/g,"")}`;
  const lastX = xs[xs.length-1].toFixed(1);
  const lastY = ys[ys.length-1].toFixed(1);
  return (
    <svg width="100%" height="48" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ display:"block" }}>
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor={color} stopOpacity="0.28" />
          <stop offset="100%" stopColor={color} stopOpacity="0.01" />
        </linearGradient>
      </defs>
      <path d={areaD} fill={`url(#${gid})`} />
      <path d={lineD} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
        style={{ filter:`drop-shadow(0 0 4px ${color})` }} />
      {/* End dot */}
      <circle cx={lastX} cy={lastY} r="3.5" fill={color} style={{ filter:`drop-shadow(0 0 6px ${color})` }} />
    </svg>
  );
}

function StatChartModal({ meta, stat, range, onClose }) {
  const [hIdx, setHIdx] = useState(null);
  const VW=540, VH=220, PAD={t:18,r:16,b:36,l:62};
  const cW = VW-PAD.l-PAD.r, cH = VH-PAD.t-PAD.b;
  const pts = meta.spark;
  const maxPt=Math.max(...pts), minPt=Math.min(...pts), ptRng=maxPt-minPt||1;
  const scale = stat.numVal / pts[pts.length-1];
  const realVals = pts.map(p => Math.round(p*scale));
  const realMax=Math.max(...realVals), realMin=Math.min(...realVals);
  const realAvg=Math.round(realVals.reduce((a,b)=>a+b,0)/realVals.length);
  const xs = pts.map((_,i) => PAD.l+(i/(pts.length-1))*cW);
  const ys = pts.map(p => PAD.t+cH-((p-minPt)/ptRng)*cH);
  const lineD = xs.map((x,i)=>`${i===0?"M":"L"} ${x.toFixed(1)} ${ys[i].toFixed(1)}`).join(" ");
  const areaD = lineD+` L ${(PAD.l+cW).toFixed(1)} ${(PAD.t+cH).toFixed(1)} L ${PAD.l.toFixed(1)} ${(PAD.t+cH).toFixed(1)} Z`;
  const gid = `mc${meta.rgb.replace(/,/g,"")}`;
  const xLabels = X_LABELS[range] || [];

  const fmtVal = (v) => {
    if (stat.prefix==="Rp ") {
      if (v>=1000000) return `Rp ${(v/1000000).toFixed(1)}jt`;
      if (v>=1000)    return `Rp ${(v/1000).toFixed(0)}k`;
      return `Rp ${v}`;
    }
    return v.toLocaleString("id-ID");
  };

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.88)", zIndex:60, display:"flex", alignItems:"center", justifyContent:"center", padding:"16px" }}
      onClick={e => { if(e.target===e.currentTarget) onClose(); }}>
      <div style={{ background:"#080810", border:`1px solid ${meta.color}`, boxShadow:`0 0 60px rgba(${meta.rgb},0.18), 0 0 120px rgba(${meta.rgb},0.06)`, width:"100%", maxWidth:"600px" }}>

        {/* Header */}
        <div style={{ padding:"22px 24px 16px", borderBottom:`1px solid rgba(${meta.rgb},0.12)`, display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
          <div style={{ display:"flex", alignItems:"center", gap:"12px" }}>
            <div style={{ width:"42px", height:"42px", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"20px", background:`rgba(${meta.rgb},0.1)`, border:`1px solid rgba(${meta.rgb},0.3)`, color:meta.color }}>
              {meta.icon}
            </div>
            <div>
              <div style={{ color:MUTED, fontSize:"11px", fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:"4px" }}>{meta.label}</div>
              <div style={{ color:meta.color, fontWeight:900, fontSize:"26px", letterSpacing:"-0.03em", filter:`drop-shadow(0 0 12px rgba(${meta.rgb},0.4))`, lineHeight:1 }}>
                {stat.prefix}{stat.numVal.toLocaleString("id-ID")}
              </div>
            </div>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
            <span style={{ fontSize:"11px", fontWeight:700, padding:"4px 10px", color:stat.up?NEON:PINK, background:stat.up?"rgba(0,255,136,0.1)":"rgba(255,45,120,0.1)", border:`1px solid ${stat.up?"rgba(0,255,136,0.3)":"rgba(255,45,120,0.3)"}` }}>
              {stat.up?"↑":"↓"} {stat.change}
            </span>
            <button onClick={onClose} style={{ color:MUTED, background:"none", border:"none", cursor:"pointer", fontSize:"20px", lineHeight:1 }}>✕</button>
          </div>
        </div>

        {/* Chart */}
        <div style={{ padding:"8px 0 0", background:`rgba(${meta.rgb},0.015)` }}>
          <svg width="100%" viewBox={`0 0 ${VW} ${VH}`} preserveAspectRatio="xMidYMid meet"
            style={{ display:"block", cursor:"crosshair" }}
            onMouseMove={e => {
              const rect = e.currentTarget.getBoundingClientRect();
              const mx = (e.clientX-rect.left)*(VW/rect.width);
              let ni=0, md=Infinity;
              xs.forEach((x,i) => { const d=Math.abs(x-mx); if(d<md){md=d;ni=i;} });
              setHIdx(md < cW/pts.length ? ni : null);
            }}
            onMouseLeave={() => setHIdx(null)}>
            <defs>
              <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor={meta.color} stopOpacity="0.25"/>
                <stop offset="100%" stopColor={meta.color} stopOpacity="0.01"/>
              </linearGradient>
            </defs>

            {/* Grid lines + Y labels */}
            {[0,0.25,0.5,0.75,1].map((f,i) => {
              const gy = PAD.t+cH-f*cH;
              const gv = Math.round(realMin+f*(realMax-realMin));
              return (
                <g key={i}>
                  <line x1={PAD.l} y1={gy.toFixed(1)} x2={PAD.l+cW} y2={gy.toFixed(1)}
                    stroke={`rgba(${meta.rgb},0.1)`} strokeWidth="1" strokeDasharray="4 4"/>
                  <text x={PAD.l-8} y={gy+4} textAnchor="end" fill="rgba(224,232,255,0.35)" fontSize="9.5">
                    {fmtVal(gv)}
                  </text>
                </g>
              );
            })}

            {/* X labels */}
            {xs.map((x,i) => (
              <text key={i} x={x.toFixed(1)} y={VH-6} textAnchor="middle" fill="rgba(224,232,255,0.35)" fontSize="9.5">
                {xLabels[i]||""}
              </text>
            ))}

            {/* Area + Line */}
            <path d={areaD} fill={`url(#${gid})`}/>
            <path d={lineD} fill="none" stroke={meta.color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
              style={{ filter:`drop-shadow(0 0 5px ${meta.color})` }}/>

            {/* Data point dots */}
            {xs.map((x,i) => (
              <circle key={i} cx={x.toFixed(1)} cy={ys[i].toFixed(1)} r={hIdx===i?"5.5":"3"}
                fill={hIdx===i ? meta.color : `rgba(${meta.rgb},0.5)`}
                style={{ filter:hIdx===i?`drop-shadow(0 0 8px ${meta.color})`:"none", transition:"r 0.1s" }}/>
            ))}

            {/* Hover: vertical line + tooltip */}
            {hIdx!==null && (
              <g>
                <line x1={xs[hIdx].toFixed(1)} y1={PAD.t} x2={xs[hIdx].toFixed(1)} y2={PAD.t+cH}
                  stroke={meta.color} strokeWidth="1" strokeDasharray="3 3" opacity="0.6"/>
                <g transform={`translate(${Math.min(xs[hIdx]+10, VW-96)},${Math.max(ys[hIdx]-38,PAD.t)})`}>
                  <rect width="88" height="34" rx="2" fill="#080810" stroke={meta.color} strokeWidth="1" opacity="0.95"/>
                  <text x="8" y="13" fill="rgba(224,232,255,0.5)" fontSize="9">{xLabels[hIdx]||`T${hIdx+1}`}</text>
                  <text x="8" y="27" fill={meta.color} fontSize="11" fontWeight="bold">{fmtVal(realVals[hIdx])}</text>
                </g>
              </g>
            )}
          </svg>
        </div>

        {/* Summary row */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", borderTop:`1px solid rgba(${meta.rgb},0.1)` }}>
          {[{l:"Minimum",v:fmtVal(realMin)},{l:"Rata-rata",v:fmtVal(realAvg)},{l:"Maksimum",v:fmtVal(realMax)}].map((s,i)=>(
            <div key={s.l} style={{ padding:"14px 16px", textAlign:"center", borderRight:i<2?`1px solid rgba(${meta.rgb},0.08)`:"none" }}>
              <div style={{ color:meta.color, fontWeight:900, fontSize:"15px" }}>{s.v}</div>
              <div style={{ color:MUTED, fontSize:"10px", marginTop:"3px" }}>{s.l}</div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

function AnimCount({ numVal, prefix="" }) {
  const [c, setC] = useState(0);
  useEffect(() => {
    setC(0);
    let i=0; const steps=40;
    const t = setInterval(() => {
      i++; setC(Math.min(Math.floor((i/steps)*numVal), numVal));
      if (i>=steps) clearInterval(t);
    }, 25);
    return () => clearInterval(t);
  }, [numVal]);
  return <span>{prefix}{c.toLocaleString("id-ID")}</span>;
}

function DonutChart() {
  let cum=0;
  const grad = DONUT.map(d => { const s=cum; cum+=d.pct; return `${d.color} ${s}% ${cum}%`; }).join(", ");
  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:"12px" }}>
      <div style={{ position:"relative", width:"120px", height:"120px" }}>
        <div style={{ width:"120px", height:"120px", borderRadius:"50%", background:`conic-gradient(${grad})`, filter:"drop-shadow(0 0 8px rgba(0,255,136,0.3))" }} />
        <div style={{ position:"absolute", inset:"22px", borderRadius:"50%", background:"#0d0d20", display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column" }}>
          <div style={{ color:NEON, fontWeight:900, fontSize:"16px", lineHeight:1 }}>58%</div>
          <div style={{ color:MUTED, fontSize:"8px", marginTop:"1px" }}>Selesai</div>
        </div>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"5px", width:"100%" }}>
        {DONUT.map(d => (
          <div key={d.label} style={{ display:"flex", alignItems:"center", gap:"5px" }}>
            <div style={{ width:"7px", height:"7px", borderRadius:"50%", background:d.color, boxShadow:`0 0 5px ${d.color}`, flexShrink:0 }} />
            <div>
              <div style={{ color:d.color, fontSize:"10px", fontWeight:700 }}>{d.pct}%</div>
              <div style={{ color:MUTED, fontSize:"9px" }}>{d.label}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Main ── */
export default function DashboardView() {
  const [range,    setRange]   = useState("bulan");
  const [hBar,     setHBar]    = useState(null);
  const [loading,  setLoading] = useState(false);
  const [lastSync, setSync]    = useState("baru saja");
  const [openStat,   setOpenStat]   = useState(null);
  const [hoverStat,  setHoverStat]  = useState(null);
  const [cursorPos,  setCursorPos]  = useState({ x:0, y:0 });

  const data = RD[range];

  const doRefresh = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); setSync("baru saja"); }, 1500);
  };

  return (
    <div className="space-y-4">
      <style>{`
        @keyframes ticker { from{transform:translateX(0)} to{transform:translateX(-50%)} }
        @keyframes spin   { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
      `}</style>

      {/* ── Live Ticker ── */}
      <div style={{ overflow:"hidden", background:"#050510", border:BORD, padding:"8px 0" }}>
        <div style={{ display:"inline-flex", gap:"52px", animation:"ticker 30s linear infinite", whiteSpace:"nowrap" }}>
          {[...TICKER,...TICKER].map((t,i) => (
            <span key={i} style={{ color:t.c, fontSize:"11px", fontWeight:700, letterSpacing:"0.04em" }}>{t.t}</span>
          ))}
        </div>
      </div>

      {/* ── Controls ── */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-1">
          {RANGES.map(r => (
            <button key={r} onClick={() => setRange(r)} style={{
              padding:"6px 14px", fontSize:"11px", fontWeight:700, cursor:"pointer",
              background: range===r ? "rgba(0,255,136,0.12)" : "transparent",
              border: `1px solid ${range===r ? NEON : "rgba(0,255,136,0.2)"}`,
              color: range===r ? NEON : MUTED,
              boxShadow: range===r ? "0 0 12px rgba(0,255,136,0.2)" : "none",
              letterSpacing:"0.05em",
            }}>
              {RLABEL[r]}
            </button>
          ))}
        </div>
        <button onClick={doRefresh} disabled={loading} style={{
          display:"flex", alignItems:"center", gap:"6px", padding:"6px 14px",
          background:"rgba(0,255,136,0.06)", border:"1px solid rgba(0,255,136,0.2)",
          color:MUTED, fontSize:"11px", fontWeight:700, cursor:"pointer",
        }}>
          <span style={{ display:"inline-block", animation: loading ? "spin 0.8s linear infinite" : "none" }}>⟳</span>
          {loading ? "Memuat..." : `Refresh · ${lastSync}`}
        </button>
      </div>

      {/* ── Stats Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {SMETA.map((m, i) => {
          const s = data.stats[i];
          return (
            <div key={m.label}
              onClick={() => setOpenStat(i)}
              style={{ background:CARD, border:BORD, overflow:"hidden", display:"flex", flexDirection:"column", cursor:"pointer", transition:"border-color 0.2s", position:"relative" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor=`rgba(${m.rgb},0.4)`; setHoverStat(i); }}
              onMouseLeave={e => { e.currentTarget.style.borderColor="rgba(0,255,136,0.1)"; setHoverStat(null); }}
              onMouseMove={e => setCursorPos({ x:e.clientX, y:e.clientY })}>
              {/* Top section */}
              <div style={{ padding:"18px 18px 14px" }}>
                {/* Icon + badge */}
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"14px" }}>
                  <span style={{ color:m.color, fontSize:"16px", filter:`drop-shadow(0 0 6px rgba(${m.rgb},0.6))` }}>{m.icon}</span>
                  <span style={{ fontSize:"10px", fontWeight:700, padding:"2px 7px", color:s.up?NEON:PINK, background:s.up?"rgba(0,255,136,0.1)":"rgba(255,45,120,0.1)", border:`1px solid ${s.up?"rgba(0,255,136,0.25)":"rgba(255,45,120,0.25)"}` }}>
                    {s.up?"↑":"↓"} {s.change}
                  </span>
                </div>
                {/* Value */}
                <div style={{ color:TEXT, fontWeight:900, fontSize:"20px", letterSpacing:"-0.02em", lineHeight:1, marginBottom:"5px" }}>
                  <AnimCount numVal={s.numVal} prefix={s.prefix} />
                </div>
                {/* Label — clearly below value */}
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                  <div style={{ color:MUTED, fontSize:"11px", fontWeight:600, letterSpacing:"0.02em" }}>{m.label}</div>
                  <div style={{ color:`rgba(${m.rgb},0.4)`, fontSize:"9px", fontWeight:700, letterSpacing:"0.08em" }}>KLIK ↗</div>
                </div>
              </div>

              {/* Separator */}
              <div style={{ height:"1px", background:`rgba(${m.rgb},0.12)` }} />

              {/* Area chart — edge to edge, no padding */}
              <div style={{ lineHeight:0 }}>
                <AreaSparkline pts={data.sparks[i]} color={m.color} rgb={m.rgb} />
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Chart + Donut + Goal ── */}
      <div className="grid lg:grid-cols-3 gap-3">

        {/* Bar chart */}
        <div className="lg:col-span-2" style={{ background:CARD, border:BORD, padding:"22px" }}>
          <div className="flex justify-between items-start mb-5">
            <div>
              <div style={{ color:TEXT, fontWeight:900, fontSize:"13px" }}>Grafik Pendapatan</div>
              <div style={{ color:MUTED, fontSize:"11px", marginTop:"2px" }}>
                Total: <span style={{ color:NEON }}>{data.chartTotal}</span>
              </div>
            </div>
            <span style={{ color:NEON, background:"rgba(0,255,136,0.1)", border:"1px solid rgba(0,255,136,0.25)", padding:"3px 10px", fontSize:"10px", fontWeight:700 }}>
              {data.stats[0].change} ↑
            </span>
          </div>
          <div className="flex items-end gap-2" style={{ height:"108px" }}>
            {data.chart.map((b, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1.5" style={{ position:"relative" }}
                onMouseEnter={() => setHBar(i)} onMouseLeave={() => setHBar(null)}>
                {hBar === i && (
                  <div style={{ position:"absolute", bottom:"calc(100% + 4px)", left:"50%", transform:"translateX(-50%)", background:"#050510", border:`1px solid ${NEON}`, padding:"3px 8px", whiteSpace:"nowrap", color:NEON, fontSize:"10px", fontWeight:700, zIndex:10, pointerEvents:"none" }}>
                    {b.a}
                  </div>
                )}
                <div style={{ width:"100%", height:"84px", background:"rgba(0,255,136,0.05)", border:"1px solid rgba(0,255,136,0.08)", position:"relative", cursor:"pointer" }}>
                  <div style={{
                    position:"absolute", bottom:0, left:0, right:0, height:`${b.v}%`,
                    background: hBar===i ? `linear-gradient(to top,${NEON},rgba(0,255,136,0.5))` : `linear-gradient(to top,rgba(0,255,136,0.7),rgba(0,255,136,0.2))`,
                    boxShadow: hBar===i ? "0 0 16px rgba(0,255,136,0.6)" : b.v===100 ? "0 0 10px rgba(0,255,136,0.4)" : "none",
                    transition:"all 0.15s",
                  }} />
                </div>
                <span style={{ color:MUTED, fontSize:"9px" }}>{b.l}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Donut + Goal stacked */}
        <div className="flex flex-col gap-3">
          <div style={{ background:CARD, border:BORD, padding:"20px", flex:1 }}>
            <div style={{ color:TEXT, fontWeight:900, fontSize:"12px", marginBottom:"14px" }}>Status Pesanan</div>
            <DonutChart />
          </div>
          <div style={{ background:CARD, border:BORD, padding:"18px" }}>
            <div className="flex justify-between items-center mb-2">
              <div style={{ color:TEXT, fontWeight:900, fontSize:"12px" }}>Target {RLABEL[range]}</div>
              <div style={{ color:NEON, fontWeight:900, fontSize:"14px" }}>{data.target.pct}%</div>
            </div>
            <div style={{ height:"6px", background:"rgba(0,255,136,0.08)", marginBottom:"6px" }}>
              <div style={{ height:"100%", width:`${data.target.pct}%`, background:`linear-gradient(to right,${NEON},rgba(0,255,136,0.5))`, boxShadow:"0 0 10px rgba(0,255,136,0.4)", transition:"width 0.6s ease" }} />
            </div>
            <div style={{ color:MUTED, fontSize:"10px" }}>{data.target.label}</div>
          </div>
        </div>
      </div>

      {/* ── Orders + Customers + Low Stock ── */}
      <div className="grid lg:grid-cols-3 gap-3">

        {/* Orders table */}
        <div className="lg:col-span-2" style={{ background:CARD, border:BORD }}>
          <div className="flex justify-between items-center px-5 py-4" style={{ borderBottom:"1px solid rgba(0,255,136,0.08)" }}>
            <div style={{ color:TEXT, fontWeight:900, fontSize:"13px" }}>Pesanan Terbaru</div>
            <button style={{ color:NEON, background:"none", border:"none", cursor:"pointer", fontSize:"11px", fontWeight:700 }}>Lihat Semua →</button>
          </div>
          <div style={{ overflowX:"auto" }}>
            <table style={{ width:"100%", borderCollapse:"collapse" }}>
              <thead>
                <tr style={{ borderBottom:"1px solid rgba(0,255,136,0.06)" }}>
                  {["ID","Pelanggan","Produk","Total","Status"].map(h => (
                    <th key={h} style={{ textAlign:"left", padding:"10px 16px", color:MUTED, fontSize:"10px", fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ORDERS.map((o, i) => {
                  const s = SCFG[o.status];
                  return (
                    <tr key={o.id} style={{ borderBottom: i<ORDERS.length-1 ? "1px solid rgba(0,255,136,0.04)" : "none" }}>
                      <td style={{ padding:"10px 16px", color:NEON, fontWeight:700, fontSize:"12px" }}>{o.id}</td>
                      <td style={{ padding:"10px 16px", color:TEXT, fontSize:"12px", fontWeight:600 }}>{o.customer}</td>
                      <td style={{ padding:"10px 16px", color:MUTED, fontSize:"12px" }}>{o.product}</td>
                      <td style={{ padding:"10px 16px", color:TEXT, fontSize:"12px", fontWeight:700 }}>{o.total}</td>
                      <td style={{ padding:"10px 16px" }}>
                        <span style={{ color:s.color, background:s.bg, border:`1px solid ${s.brd}`, padding:"2px 8px", fontSize:"10px", fontWeight:700 }}>{o.status}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-3">

          {/* Top Customers */}
          <div style={{ background:CARD, border:BORD, padding:"18px" }}>
            <div style={{ color:TEXT, fontWeight:900, fontSize:"12px", marginBottom:"14px" }}>Top Pelanggan</div>
            <div className="space-y-3">
              {CUSTOMERS.map(c => (
                <div key={c.name} className="flex items-center gap-2.5">
                  <div style={{ width:"28px", height:"28px", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"9px", fontWeight:900, flexShrink:0, background:`rgba(${c.rgb},0.12)`, border:`1px solid ${c.color}`, color:c.color, boxShadow:`0 0 6px rgba(${c.rgb},0.2)` }}>
                    {c.init}
                  </div>
                  <div style={{ flex:1, overflow:"hidden" }}>
                    <div style={{ color:TEXT, fontSize:"11px", fontWeight:600, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{c.name}</div>
                    <div style={{ color:c.color, fontSize:"10px", fontWeight:700 }}>{c.total}</div>
                  </div>
                  <div style={{ color:MUTED, fontSize:"10px", flexShrink:0 }}>{c.n}×</div>
                </div>
              ))}
            </div>
          </div>

          {/* Low Stock */}
          <div style={{ background:CARD, border:"1px solid rgba(255,224,51,0.18)", padding:"18px" }}>
            <div className="flex items-center gap-2 mb-3">
              <span style={{ color:YLW, fontSize:"13px", filter:`drop-shadow(0 0 4px ${YLW})` }}>⚠</span>
              <div style={{ color:TEXT, fontWeight:900, fontSize:"12px" }}>Stok Menipis</div>
            </div>
            <div className="space-y-2.5">
              {LOW_STOCK.map(p => (
                <div key={p.name} className="flex justify-between items-center">
                  <div style={{ color:TEXT, fontSize:"11px", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", flex:1, marginRight:"8px" }}>{p.name}</div>
                  <div style={{ color:p.color, fontSize:"10px", fontWeight:900, flexShrink:0, background:`rgba(${p.rgb},0.1)`, border:`1px solid ${p.color}`, padding:"1px 7px", boxShadow:`0 0 6px rgba(${p.rgb},0.2)` }}>
                    {p.stock} unit
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* ── Cursor tooltip ── */}
      {hoverStat !== null && (
        <div style={{
          position:"fixed",
          left: cursorPos.x + 16,
          top:  cursorPos.y + 16,
          background:"#08080f",
          border:`1px solid ${SMETA[hoverStat].color}`,
          color: SMETA[hoverStat].color,
          padding:"5px 12px",
          fontSize:"11px",
          fontWeight:700,
          letterSpacing:"0.06em",
          whiteSpace:"nowrap",
          pointerEvents:"none",
          zIndex:55,
          boxShadow:`0 0 16px rgba(${SMETA[hoverStat].rgb},0.3)`,
        }}>
          ↗ Klik untuk lihat detail grafik
        </div>
      )}

      {/* ── Stat Chart Modal ── */}
      {openStat !== null && (
        <StatChartModal
          meta={SMETA[openStat]}
          stat={data.stats[openStat]}
          range={range}
          onClose={() => setOpenStat(null)}
        />
      )}
    </div>
  );
}
