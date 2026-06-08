"use client";
import { useState } from "react";

/* ─── Export helpers ─── */
function csvDownload(filename, headers, rows) {
  const allRows = rows !== undefined ? [headers, ...rows] : headers;
  const bom = "﻿";
  const csv = allRows.map(r => r.map(v => `"${String(v).replace(/"/g,'""')}"`).join(",")).join("\n");
  const blob = new Blob([bom + csv], { type:"text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename + ".csv"; a.click();
  URL.revokeObjectURL(url);
}

async function pdfDownload(periodLabel, d, revC, ordC, cusC, avgC) {
  const { default: jsPDF } = await import("jspdf");
  const doc = new jsPDF({ orientation:"portrait", unit:"mm", format:"a4" });
  const W=210, M=16, CW=W-M*2;
  let y = M;

  const txt  = (t,x,yy,size=10,bold=false,color=[0,0,0]) => {
    doc.setFontSize(size);
    doc.setFont("helvetica", bold?"bold":"normal");
    doc.setTextColor(...color);
    doc.text(String(t), x, yy);
  };
  const line = (y2,c=[200,200,200]) => { doc.setDrawColor(...c); doc.setLineWidth(0.3); doc.line(M, y2, W-M, y2); };
  const rect = (x,yy,w,h,fill=[245,250,245]) => { doc.setFillColor(...fill); doc.rect(x,yy,w,h,"F"); };

  // ── Header ──
  rect(0, 0, W, 18, [10,20,10]);
  txt("CoderaftBoard — Laporan Bisnis", M, 10, 13, true, [0,255,136]);
  txt("Dibuat otomatis · "+periodLabel, M, 16, 8, false, [100,200,150]);
  y = 26;

  // ── KPI Summary ──
  txt("RINGKASAN KPI", M, y, 9, true, [0,120,60]); y+=2;
  line(y); y+=5;
  const kpiRows = [
    ["Total Pendapatan", fmt(d.rev), fmt(d.revPrev), revC.str],
    ["Total Pesanan",    d.orders,   d.ordersPrev,   ordC.str],
    ["Pelanggan Baru",   d.customers,d.custPrev,     cusC.str],
    ["Avg. Order Value", fmt(d.avgOrder), fmt(d.avgPrev), avgC.str],
  ];
  const kpiHdr = ["Metrik","Periode Ini","Periode Lalu","Perubahan"];
  const cw4 = CW/4;
  rect(M, y-4, CW, 7, [220,240,220]);
  kpiHdr.forEach((h,i) => txt(h, M+i*cw4+2, y, 8, true, [0,80,40]));
  y += 5;
  kpiRows.forEach((row,ri) => {
    if (ri%2===0) rect(M, y-4, CW, 6, [248,252,248]);
    row.forEach((v,i) => txt(v, M+i*cw4+2, y, 8));
    y += 6;
  });
  y += 4; line(y); y += 6;

  // ── Top Produk ──
  txt("TOP 5 PRODUK TERLARIS", M, y, 9, true, [0,120,60]); y+=2;
  line(y); y+=5;
  const pHdr = ["Rank","Nama Produk","Unit Terjual","Pendapatan"];
  const cw4p = [12,80,35,CW-12-80-35];
  rect(M, y-4, CW, 7, [220,240,220]);
  let cx=M;
  pHdr.forEach((h,i) => { txt(h, cx+2, y, 8, true, [0,80,40]); cx+=cw4p[i]; });
  y += 5;
  d.topProds.forEach((p,ri) => {
    if (ri%2===0) rect(M, y-4, CW, 6, [248,252,248]);
    cx=M;
    [p.name.substring(0,3)+".", p.name, p.sold+" unit", fmt(p.rev)].forEach((v,i) => { txt(v, cx+2, y, 8); cx+=cw4p[i]; });
    y += 6;
  });
  y += 4; line(y); y += 6;

  // ── Kategori ──
  txt("BREAKDOWN KATEGORI", M, y, 9, true, [0,120,60]); y+=2;
  line(y); y+=5;
  const cHdr = ["Kategori","Persentase"];
  const cw2 = [CW*0.5, CW*0.5];
  rect(M, y-4, CW, 7, [220,240,220]);
  cx=M; cHdr.forEach((h,i) => { txt(h, cx+2, y, 8, true, [0,80,40]); cx+=cw2[i]; });
  y += 5;
  d.cats.forEach((c,ri) => {
    if (ri%2===0) rect(M, y-4, CW, 6, [248,252,248]);
    cx=M;
    [c.cat, c.pct+"%"].forEach((v,i) => { txt(v, cx+2, y, 8); cx+=cw2[i]; });
    y += 6;
  });
  y += 4; line(y); y += 6;

  // ── Pelanggan ──
  txt("DATA PELANGGAN", M, y, 9, true, [0,120,60]); y+=2;
  line(y); y+=5;
  const custRows = [
    ["Pelanggan Baru", d.customers, d.custPrev, cusC.str],
    ["Total Aktif",    d.customers+420, "-", "-"],
    ["Retention Rate", d.retention+"%", "-", "-"],
    ["Churn Rate",     (100-parseFloat(d.retention)).toFixed(1)+"%", "-", "-"],
    ["Avg. LTV",       fmt(Math.round(d.rev/d.customers*12)), "-", "-"],
  ];
  const cw4c = CW/4;
  rect(M, y-4, CW, 7, [220,240,220]);
  ["Metrik","Nilai","Periode Lalu","Catatan"].forEach((h,i) => txt(h, M+i*cw4c+2, y, 8, true, [0,80,40]));
  y += 5;
  custRows.forEach((row,ri) => {
    if (ri%2===0) rect(M, y-4, CW, 6, [248,252,248]);
    row.forEach((v,i) => txt(v, M+i*cw4c+2, y, 8));
    y += 6;
  });

  // ── Footer ──
  y = 285;
  line(y, [180,220,180]); y += 4;
  txt("Laporan ini dibuat secara otomatis oleh CoderaftBoard · coderaft-studio.vercel.app", M, y, 7, false, [120,160,120]);

  doc.save(`laporan-coderaftboard-${periodLabel.replace(/\s/g,"-")}.pdf`);
}

const NEON  = "#00ff88";
const PINK  = "#ff2d78";
const CYAN  = "#00e5ff";
const YLW   = "#ffe033";
const CARD  = "#0d0d20";
const TEXT  = "#e0e8ff";
const MUTED = "rgba(224,232,255,0.4)";
const BORD  = "1px solid rgba(0,255,136,0.1)";

const PERIODS = [["bulan","Jun 2026"],["kuartal","Q2 2026"],["tahun","2026"]];

const DATA = {
  bulan: {
    rev:58400000,    revPrev:46800000,
    orders:142,      ordersPrev:120,
    avgOrder:411268, avgPrev:390000,
    customers:51,    custPrev:38,
    retention:"78.4", convRate:"3.2",
    revChart:[14200000,18500000,12800000,12900000],
    custChart:[12,18,10,11],
    topProds:[
      { name:"Sneakers Neon X1", sold:38, rev:24700000, pct:100 },
      { name:"Jacket Urban V2",  sold:24, rev:11520000, pct:63  },
      { name:"Sneakers Neo Volt",sold:21, rev:15120000, pct:55  },
      { name:"Cap Street",       sold:18, rev:2700000,  pct:47  },
      { name:"Backpack Urban",   sold:14, rev:4480000,  pct:37  },
    ],
    cats:[{cat:"Sneakers",pct:42,color:NEON},{cat:"Jacket",pct:28,color:CYAN},{cat:"Accessories",pct:18,color:PINK},{cat:"Bags",pct:12,color:YLW}],
    tiers:[{t:"VIP",n:1,pct:12},{t:"Regular",n:7,pct:69},{t:"New",n:43,pct:19}],
  },
  kuartal: {
    rev:156300000,   revPrev:135800000,
    orders:385,      ordersPrev:342,
    avgOrder:406234, avgPrev:397000,
    customers:131,   custPrev:107,
    retention:"76.8", convRate:"3.8",
    revChart:[51200000,46700000,58400000],
    custChart:[42,38,51],
    topProds:[
      { name:"Sneakers Neon X1", sold:98,  rev:63700000, pct:100 },
      { name:"Jacket Urban V2",  sold:72,  rev:34560000, pct:73  },
      { name:"Sneakers Neo Volt",sold:61,  rev:43920000, pct:62  },
      { name:"Cap Street",       sold:54,  rev:8100000,  pct:55  },
      { name:"Backpack Urban",   sold:42,  rev:13440000, pct:43  },
    ],
    cats:[{cat:"Sneakers",pct:39,color:NEON},{cat:"Jacket",pct:27,color:CYAN},{cat:"Accessories",pct:20,color:PINK},{cat:"Bags",pct:14,color:YLW}],
    tiers:[{t:"VIP",n:1,pct:8},{t:"Regular",n:7,pct:64},{t:"New",n:123,pct:28}],
  },
  tahun: {
    rev:670200000,   revPrev:521000000,
    orders:1664,     ordersPrev:1362,
    avgOrder:402764, avgPrev:382500,
    customers:587,   custPrev:432,
    retention:"74.2", convRate:"4.1",
    revChart:[38500000,42300000,35800000,51200000,46700000,58400000,52100000,61800000,67300000,59400000,74200000,82500000],
    custChart:[28,35,22,42,38,51,44,58,63,49,72,85],
    topProds:[
      { name:"Sneakers Neon X1", sold:142, rev:92300000, pct:100 },
      { name:"Jacket Urban V2",  sold:98,  rev:47040000, pct:69  },
      { name:"Sneakers Neo Volt",sold:86,  rev:61920000, pct:61  },
      { name:"Cap Street",       sold:74,  rev:11100000, pct:52  },
      { name:"Backpack Urban",   sold:58,  rev:18560000, pct:41  },
    ],
    cats:[{cat:"Sneakers",pct:38,color:NEON},{cat:"Jacket",pct:27,color:CYAN},{cat:"Accessories",pct:21,color:PINK},{cat:"Bags",pct:14,color:YLW}],
    tiers:[{t:"VIP",n:1,pct:12},{t:"Regular",n:7,pct:69},{t:"New",n:579,pct:19}],
  },
};

function pctChange(now, prev) {
  const p = (((now-prev)/prev)*100).toFixed(1);
  return { str:(p>0?"+":"")+p+"%", up:parseFloat(p)>=0 };
}

function fmt(n) {
  if (n>=1000000000) return "Rp "+(n/1000000000).toFixed(1)+"M";
  if (n>=1000000)    return "Rp "+(n/1000000).toFixed(1)+"jt";
  if (n>=1000)       return "Rp "+(n/1000).toFixed(0)+"k";
  return "Rp "+n;
}

function Spark({ data, color, rgb, h=40 }) {
  const W=200, H=h, max=Math.max(...data)||1, min=Math.min(...data);
  const rng=max-min||1;
  const xs=data.map((_,i)=>(i/(data.length-1))*W);
  const ys=data.map(p=>H-((p-min)/rng)*(H-6)-3);
  const lineD=xs.map((x,i)=>`${i===0?"M":"L"} ${x.toFixed(1)} ${ys[i].toFixed(1)}`).join(" ");
  const areaD=lineD+` L ${W} ${H} L 0 ${H} Z`;
  const gid=`sp${rgb.replace(/,/g,"")}${h}`;
  return (
    <svg width="100%" height={h} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ display:"block" }}>
      <defs><linearGradient id={gid} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={color} stopOpacity="0.22"/><stop offset="100%" stopColor={color} stopOpacity="0.01"/></linearGradient></defs>
      <path d={areaD} fill={`url(#${gid})`}/>
      <path d={lineD} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ filter:`drop-shadow(0 0 4px ${color})` }}/>
      <circle cx={xs[xs.length-1].toFixed(1)} cy={ys[ys.length-1].toFixed(1)} r="3.5" fill={color} style={{ filter:`drop-shadow(0 0 6px ${color})` }}/>
    </svg>
  );
}

function SectionLabel({ color, rgb, icon, title }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"10px" }}>
      <div style={{ width:"3px", height:"18px", background:color, boxShadow:`0 0 8px rgba(${rgb},0.6)` }}/>
      <span style={{ color, fontSize:"11px", fontWeight:900, letterSpacing:"0.15em", textTransform:"uppercase" }}>{icon} {title}</span>
    </div>
  );
}

function ExportBtn({ color, rgb, label, onClick }) {
  const [loading, setLoading] = useState(false);
  const handle = async () => {
    if (!onClick) return;
    setLoading(true);
    try { await onClick(); } finally { setLoading(false); }
  };
  return (
    <button onClick={handle} disabled={loading}
      style={{ color, background:`rgba(${rgb},0.06)`, border:`1px solid ${color}44`, padding:"4px 10px", fontSize:"10px", fontWeight:700, cursor:"pointer", letterSpacing:"0.05em", whiteSpace:"nowrap", opacity:loading?0.6:1 }}
      onMouseEnter={e=>{ if(!loading) e.currentTarget.style.background=`rgba(${rgb},0.14)`; }}
      onMouseLeave={e=>e.currentTarget.style.background=`rgba(${rgb},0.06)`}>
      {loading ? "⏳" : "⬇"} {label}
    </button>
  );
}

function ReportCard({ children, style }) {
  return (
    <div style={{ background:CARD, border:BORD, padding:"18px", display:"flex", flexDirection:"column", gap:"12px", ...style }}>
      {children}
    </div>
  );
}

export default function LaporanView() {
  const [period, setPeriod] = useState("tahun");
  const d = DATA[period];
  const periodLabel = PERIODS.find(p=>p[0]===period)[1];

  const revC = pctChange(d.rev,      d.revPrev);
  const ordC = pctChange(d.orders,   d.ordersPrev);
  const cusC = pctChange(d.customers,d.custPrev);
  const avgC = pctChange(d.avgOrder, d.avgPrev);

  return (
    <div className="space-y-5">

      {/* ── Header ── */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:"10px" }}>
        <div>
          <h2 style={{ color:TEXT, fontWeight:900, fontSize:"16px", margin:0 }}>Laporan &amp; Analitik</h2>
          <p style={{ color:MUTED, fontSize:"11px", margin:"3px 0 0" }}>Periode: <span style={{ color:NEON }}>{periodLabel}</span></p>
        </div>
        <div style={{ display:"flex", gap:"6px", flexWrap:"wrap", alignItems:"center" }}>
          <div style={{ display:"flex", gap:"4px" }}>
            {PERIODS.map(([key,lbl])=>(
              <button key={key} onClick={()=>setPeriod(key)} style={{
                padding:"6px 14px", fontSize:"11px", fontWeight:700, cursor:"pointer", letterSpacing:"0.05em",
                background:period===key?"rgba(0,255,136,0.12)":"transparent",
                border:`1px solid ${period===key?NEON:"rgba(0,255,136,0.2)"}`,
                color:period===key?NEON:MUTED,
              }}>{lbl}</button>
            ))}
          </div>
          <div style={{ width:"1px", height:"24px", background:"rgba(0,255,136,0.1)" }}/>
          <ExportBtn color={CYAN} rgb="0,229,255" label="Export PDF"
            onClick={()=>pdfDownload(periodLabel,d,revC,ordC,cusC,avgC)} />
          <ExportBtn color={CYAN} rgb="0,229,255" label="Export CSV"
            onClick={()=>csvDownload(`laporan-${periodLabel}`,[
              ["Metrik","Nilai","Periode Lalu","Perubahan"],
              ["Total Pendapatan",fmt(d.rev),fmt(d.revPrev),revC.str],
              ["Total Pesanan",d.orders,d.ordersPrev,ordC.str],
              ["Pelanggan Baru",d.customers,d.custPrev,cusC.str],
              ["Avg. Order Value",fmt(d.avgOrder),fmt(d.avgPrev),avgC.str],
              ["","","",""],
              ["TOP PRODUK","","",""],
              ["Rank","Nama Produk","Unit","Pendapatan"],
              ...d.topProds.map(p=>[p.rank,p.name,p.sold,fmt(p.rev)]),
              ["","","",""],
              ["KATEGORI","","",""],
              ["Kategori","Persentase","",""],
              ...d.cats.map(c=>[c.cat,c.pct+"%","",""]),
            ])} />
        </div>
      </div>

      {/* ════ PENJUALAN ════ */}
      <div>
        <SectionLabel color={NEON} rgb="0,255,136" icon="◈" title="Penjualan" />
        <div className="grid lg:grid-cols-3 gap-3">

          {/* Revenue */}
          <ReportCard>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
              <div>
                <div style={{ color:MUTED, fontSize:"10px", fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:"6px" }}>Total Pendapatan</div>
                <div style={{ color:NEON, fontWeight:900, fontSize:"22px", letterSpacing:"-0.02em" }}>{fmt(d.rev)}</div>
                <div style={{ display:"flex", alignItems:"center", gap:"6px", marginTop:"4px" }}>
                  <span style={{ color:revC.up?NEON:PINK, fontSize:"11px", fontWeight:700, padding:"1px 6px", background:revC.up?"rgba(0,255,136,0.1)":"rgba(255,45,120,0.1)", border:`1px solid ${revC.up?"rgba(0,255,136,0.25)":"rgba(255,45,120,0.25)"}` }}>
                    {revC.up?"↑":"↓"} {revC.str}
                  </span>
                  <span style={{ color:MUTED, fontSize:"10px" }}>vs periode lalu</span>
                </div>
              </div>
              <ExportBtn color={NEON} rgb="0,255,136" label="CSV"
                onClick={()=>csvDownload(`pendapatan-${periodLabel}`,
                  ["Sub-Periode","Pendapatan"],
                  d.revChart.map((v,i)=>[`P${i+1}`,fmt(v)])
                )} />
            </div>
            <Spark data={d.revChart} color={NEON} rgb="0,255,136" h={44} />
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"8px", paddingTop:"4px", borderTop:"1px solid rgba(0,255,136,0.08)" }}>
              <div><div style={{ color:MUTED, fontSize:"9px", marginBottom:"2px" }}>Periode Lalu</div><div style={{ color:TEXT, fontWeight:700, fontSize:"12px" }}>{fmt(d.revPrev)}</div></div>
              <div><div style={{ color:MUTED, fontSize:"9px", marginBottom:"2px" }}>Selisih</div><div style={{ color:revC.up?NEON:PINK, fontWeight:700, fontSize:"12px" }}>{fmt(Math.abs(d.rev-d.revPrev))}</div></div>
            </div>
          </ReportCard>

          {/* Orders */}
          <ReportCard>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
              <div>
                <div style={{ color:MUTED, fontSize:"10px", fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:"6px" }}>Total Pesanan</div>
                <div style={{ color:CYAN, fontWeight:900, fontSize:"22px" }}>{d.orders.toLocaleString("id-ID")}</div>
                <div style={{ display:"flex", alignItems:"center", gap:"6px", marginTop:"4px" }}>
                  <span style={{ color:ordC.up?NEON:PINK, fontSize:"11px", fontWeight:700, padding:"1px 6px", background:ordC.up?"rgba(0,255,136,0.1)":"rgba(255,45,120,0.1)", border:`1px solid ${ordC.up?"rgba(0,255,136,0.25)":"rgba(255,45,120,0.25)"}` }}>
                    {ordC.up?"↑":"↓"} {ordC.str}
                  </span>
                  <span style={{ color:MUTED, fontSize:"10px" }}>vs periode lalu</span>
                </div>
              </div>
              <ExportBtn color={CYAN} rgb="0,229,255" label="CSV"
                onClick={()=>csvDownload(`pesanan-${periodLabel}`,
                  ["Metrik","Nilai","Periode Lalu"],
                  [["Total Pesanan",d.orders,d.ordersPrev],["Avg. Order Value",fmt(d.avgOrder),fmt(d.avgPrev)]]
                )} />
            </div>
            <Spark data={d.revChart.map(v=>Math.round(v/410000))} color={CYAN} rgb="0,229,255" h={44} />
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"8px", paddingTop:"4px", borderTop:"1px solid rgba(0,229,255,0.08)" }}>
              <div><div style={{ color:MUTED, fontSize:"9px", marginBottom:"2px" }}>Periode Lalu</div><div style={{ color:TEXT, fontWeight:700, fontSize:"12px" }}>{d.ordersPrev}</div></div>
              <div><div style={{ color:MUTED, fontSize:"9px", marginBottom:"2px" }}>Avg. Order Value</div><div style={{ color:TEXT, fontWeight:700, fontSize:"12px" }}>{fmt(d.avgOrder)}</div></div>
            </div>
          </ReportCard>

          {/* Avg + Conversion */}
          <ReportCard>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
              <div>
                <div style={{ color:MUTED, fontSize:"10px", fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:"6px" }}>Avg. Order Value</div>
                <div style={{ color:YLW, fontWeight:900, fontSize:"22px" }}>{fmt(d.avgOrder)}</div>
                <div style={{ display:"flex", alignItems:"center", gap:"6px", marginTop:"4px" }}>
                  <span style={{ color:avgC.up?NEON:PINK, fontSize:"11px", fontWeight:700, padding:"1px 6px", background:avgC.up?"rgba(0,255,136,0.1)":"rgba(255,45,120,0.1)", border:`1px solid ${avgC.up?"rgba(0,255,136,0.25)":"rgba(255,45,120,0.25)"}` }}>
                    {avgC.up?"↑":"↓"} {avgC.str}
                  </span>
                  <span style={{ color:MUTED, fontSize:"10px" }}>vs periode lalu</span>
                </div>
              </div>
              <ExportBtn color={YLW} rgb="255,224,51" label="CSV"
                onClick={()=>csvDownload(`avg-order-${periodLabel}`,
                  ["Metrik","Nilai","Periode Lalu","Perubahan"],
                  [["Avg. Order Value",fmt(d.avgOrder),fmt(d.avgPrev),avgC.str],["Conversion Rate",d.convRate+"%","",""]]
                )} />
            </div>
            <div style={{ background:"rgba(255,224,51,0.05)", border:"1px solid rgba(255,224,51,0.12)", padding:"12px" }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"8px" }}>
                <span style={{ color:MUTED, fontSize:"10px" }}>Conversion Rate</span>
                <span style={{ color:YLW, fontWeight:900, fontSize:"14px" }}>{d.convRate}%</span>
              </div>
              <div style={{ height:"4px", background:"rgba(255,224,51,0.08)" }}>
                <div style={{ height:"100%", width:`${parseFloat(d.convRate)*10}%`, background:YLW, boxShadow:`0 0 8px ${YLW}` }}/>
              </div>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"8px", paddingTop:"4px", borderTop:"1px solid rgba(255,224,51,0.08)" }}>
              <div><div style={{ color:MUTED, fontSize:"9px", marginBottom:"2px" }}>Periode Lalu</div><div style={{ color:TEXT, fontWeight:700, fontSize:"12px" }}>{fmt(d.avgPrev)}</div></div>
              <div><div style={{ color:MUTED, fontSize:"9px", marginBottom:"2px" }}>Selisih</div><div style={{ color:avgC.up?NEON:PINK, fontWeight:700, fontSize:"12px" }}>{fmt(Math.abs(d.avgOrder-d.avgPrev))}</div></div>
            </div>
          </ReportCard>
        </div>
      </div>

      {/* ════ PRODUK ════ */}
      <div>
        <SectionLabel color={CYAN} rgb="0,229,255" icon="⬡" title="Produk" />
        <div className="grid lg:grid-cols-2 gap-3">

          {/* Top Products */}
          <ReportCard>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <div style={{ color:TEXT, fontWeight:900, fontSize:"12px" }}>Top 5 Produk Terlaris</div>
              <ExportBtn color={CYAN} rgb="0,229,255" label="CSV"
                onClick={()=>csvDownload(`top-produk-${periodLabel}`,
                  ["Rank","Nama Produk","Unit Terjual","Pendapatan"],
                  d.topProds.map(p=>[p.rank,p.name,p.sold,fmt(p.rev)])
                )} />
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:"10px" }}>
              {d.topProds.map(p=>(
                <div key={p.name}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"5px" }}>
                    <span style={{ color:TEXT, fontSize:"12px", fontWeight:600 }}>{p.name}</span>
                    <div style={{ display:"flex", gap:"10px" }}>
                      <span style={{ color:MUTED, fontSize:"10px" }}>{p.sold} unit</span>
                      <span style={{ color:CYAN, fontWeight:700, fontSize:"11px" }}>{fmt(p.rev)}</span>
                    </div>
                  </div>
                  <div style={{ height:"3px", background:"rgba(0,229,255,0.06)" }}>
                    <div style={{ height:"100%", width:`${p.pct}%`, background:CYAN, boxShadow:`0 0 5px ${CYAN}`, transition:"width 0.4s" }}/>
                  </div>
                </div>
              ))}
            </div>
          </ReportCard>

          {/* Category Breakdown */}
          <ReportCard>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <div style={{ color:TEXT, fontWeight:900, fontSize:"12px" }}>Breakdown per Kategori</div>
              <ExportBtn color={CYAN} rgb="0,229,255" label="CSV"
                onClick={()=>csvDownload(`kategori-${periodLabel}`,
                  ["Kategori","Persentase"],
                  d.cats.map(c=>[c.cat,c.pct+"%"])
                )} />
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:"10px" }}>
              {d.cats.map(c=>(
                <div key={c.cat}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"5px" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:"7px" }}>
                      <div style={{ width:"8px", height:"8px", borderRadius:"50%", background:c.color, boxShadow:`0 0 6px ${c.color}` }}/>
                      <span style={{ color:TEXT, fontSize:"12px", fontWeight:600 }}>{c.cat}</span>
                    </div>
                    <span style={{ color:c.color, fontWeight:900, fontSize:"12px" }}>{c.pct}%</span>
                  </div>
                  <div style={{ height:"4px", background:"rgba(255,255,255,0.04)" }}>
                    <div style={{ height:"100%", width:`${c.pct}%`, background:c.color, boxShadow:`0 0 5px ${c.color}`, transition:"width 0.4s" }}/>
                  </div>
                </div>
              ))}
            </div>
          </ReportCard>
        </div>
      </div>

      {/* ════ PELANGGAN ════ */}
      <div>
        <SectionLabel color={PINK} rgb="255,45,120" icon="◎" title="Pelanggan" />
        <div className="grid lg:grid-cols-3 gap-3">

          {/* Customer Growth */}
          <ReportCard>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
              <div>
                <div style={{ color:MUTED, fontSize:"10px", fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:"6px" }}>Pelanggan Baru</div>
                <div style={{ color:PINK, fontWeight:900, fontSize:"22px" }}>{d.customers}</div>
                <div style={{ display:"flex", alignItems:"center", gap:"6px", marginTop:"4px" }}>
                  <span style={{ color:cusC.up?NEON:PINK, fontSize:"11px", fontWeight:700, padding:"1px 6px", background:cusC.up?"rgba(0,255,136,0.1)":"rgba(255,45,120,0.1)", border:`1px solid ${cusC.up?"rgba(0,255,136,0.25)":"rgba(255,45,120,0.25)"}` }}>
                    {cusC.up?"↑":"↓"} {cusC.str}
                  </span>
                  <span style={{ color:MUTED, fontSize:"10px" }}>vs periode lalu</span>
                </div>
              </div>
              <ExportBtn color={PINK} rgb="255,45,120" label="CSV"
                onClick={()=>csvDownload(`pelanggan-${periodLabel}`,
                  ["Metrik","Nilai","Periode Lalu","Perubahan"],
                  [["Pelanggan Baru",d.customers,d.custPrev,cusC.str],["Total Aktif",d.customers+420,"-","-"],["Retention Rate",d.retention+"%","-","-"]]
                )} />
            </div>
            <Spark data={d.custChart} color={PINK} rgb="255,45,120" h={44} />
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"8px", paddingTop:"4px", borderTop:"1px solid rgba(255,45,120,0.08)" }}>
              <div><div style={{ color:MUTED, fontSize:"9px", marginBottom:"2px" }}>Periode Lalu</div><div style={{ color:TEXT, fontWeight:700, fontSize:"12px" }}>{d.custPrev}</div></div>
              <div><div style={{ color:MUTED, fontSize:"9px", marginBottom:"2px" }}>Total Aktif</div><div style={{ color:TEXT, fontWeight:700, fontSize:"12px" }}>{d.customers+420}</div></div>
            </div>
          </ReportCard>

          {/* Tier Breakdown */}
          <ReportCard>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <div style={{ color:TEXT, fontWeight:900, fontSize:"12px" }}>Distribusi Tier</div>
              <ExportBtn color={PINK} rgb="255,45,120" label="CSV"
                onClick={()=>csvDownload(`tier-${periodLabel}`,
                  ["Tier","Jumlah User","Persentase"],
                  d.tiers.map(t=>[t.t,t.n,t.pct+"%"])
                )} />
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:"10px", flex:1 }}>
              {[{t:"VIP",color:NEON,rgb:"0,255,136"},{t:"Regular",color:CYAN,rgb:"0,229,255"},{t:"New",color:YLW,rgb:"255,224,51"}].map(({t,color,rgb})=>{
                const tier=d.tiers.find(x=>x.t===t)||{n:0,pct:0};
                return (
                  <div key={t}>
                    <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"5px" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:"7px" }}>
                        <div style={{ width:"8px", height:"8px", borderRadius:"50%", background:color, boxShadow:`0 0 5px ${color}` }}/>
                        <span style={{ color:TEXT, fontSize:"12px", fontWeight:600 }}>{t}</span>
                      </div>
                      <div style={{ display:"flex", gap:"8px" }}>
                        <span style={{ color:MUTED, fontSize:"10px" }}>{tier.n} user</span>
                        <span style={{ color, fontWeight:700, fontSize:"11px" }}>{tier.pct}%</span>
                      </div>
                    </div>
                    <div style={{ height:"4px", background:`rgba(${rgb},0.06)` }}>
                      <div style={{ height:"100%", width:`${tier.pct}%`, background:color, boxShadow:`0 0 5px ${color}`, transition:"width 0.4s" }}/>
                    </div>
                  </div>
                );
              })}
            </div>
          </ReportCard>

          {/* Retention & LTV */}
          <ReportCard>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <div style={{ color:TEXT, fontWeight:900, fontSize:"12px" }}>Retensi &amp; LTV</div>
              <ExportBtn color={PINK} rgb="255,45,120" label="CSV"
                onClick={()=>csvDownload(`retensi-${periodLabel}`,
                  ["Metrik","Nilai","Keterangan"],
                  [["Retention Rate",d.retention+"%","Pelanggan kembali order"],["Churn Rate",(100-parseFloat(d.retention)).toFixed(1)+"%","Tidak kembali"],["Avg. LTV",fmt(Math.round(d.rev/d.customers*12)),"Nilai per pelanggan/tahun"]]
                )} />
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:"10px" }}>
              {[
                { label:"Retention Rate", val:d.retention+"%",  color:NEON, pct:parseFloat(d.retention), desc:"Pelanggan kembali order" },
                { label:"Churn Rate",     val:(100-parseFloat(d.retention)).toFixed(1)+"%", color:PINK, pct:100-parseFloat(d.retention), desc:"Tidak kembali" },
                { label:"Avg. LTV",       val:fmt(Math.round(d.rev/d.customers*12)), color:YLW, pct:65, desc:"Nilai per pelanggan/tahun" },
              ].map(s=>(
                <div key={s.label}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"4px" }}>
                    <div>
                      <div style={{ color:TEXT, fontSize:"12px", fontWeight:600 }}>{s.label}</div>
                      <div style={{ color:MUTED, fontSize:"9px" }}>{s.desc}</div>
                    </div>
                    <div style={{ color:s.color, fontWeight:900, fontSize:"14px" }}>{s.val}</div>
                  </div>
                  <div style={{ height:"3px", background:"rgba(255,255,255,0.04)" }}>
                    <div style={{ height:"100%", width:`${s.pct}%`, background:s.color, boxShadow:`0 0 5px ${s.color}`, transition:"width 0.4s" }}/>
                  </div>
                </div>
              ))}
            </div>
          </ReportCard>
        </div>
      </div>

    </div>
  );
}
