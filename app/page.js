"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import Sidebar from "@/components/Sidebar";
import Header  from "@/components/Header";

const NEON = "#00ff88";

const ViewLoader = () => (
  <div style={{ display:"flex", height:"calc(100vh - 128px)", alignItems:"center", justifyContent:"center" }}>
    <div style={{ textAlign:"center" }}>
      <div style={{ width:"32px", height:"32px", border:`2px solid rgba(0,255,136,0.15)`, borderTop:`2px solid ${NEON}`, borderRadius:"50%", animation:"spin 0.7s linear infinite", margin:"0 auto 10px" }}/>
      <div style={{ color:"rgba(0,255,136,0.4)", fontSize:"11px", letterSpacing:"0.1em" }}>MEMUAT</div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  </div>
);

const DashboardView  = dynamic(()=>import("@/components/views/DashboardView"),  { loading:()=><ViewLoader/>, ssr:false });
const ProdukView     = dynamic(()=>import("@/components/views/ProdukView"),     { loading:()=><ViewLoader/>, ssr:false });
const PesananView    = dynamic(()=>import("@/components/views/PesananView"),    { loading:()=><ViewLoader/>, ssr:false });
const PelangganView  = dynamic(()=>import("@/components/views/PelangganView"),  { loading:()=><ViewLoader/>, ssr:false });
const LaporanView    = dynamic(()=>import("@/components/views/LaporanView"),    { loading:()=><ViewLoader/>, ssr:false });
const PengaturanView = dynamic(()=>import("@/components/views/PengaturanView"), { loading:()=><ViewLoader/>, ssr:false });

export default function Home() {
  const [active, setActive] = useState("dashboard");
  const views = {
    dashboard:  <DashboardView />,
    produk:     <ProdukView />,
    pesanan:    <PesananView />,
    pelanggan:  <PelangganView />,
    laporan:    <LaporanView />,
    pengaturan: <PengaturanView />,
  };
  return (
    <div className="flex h-screen overflow-hidden" style={{ background:"#080810" }}>
      <Sidebar active={active} setActive={setActive} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header active={active} />
        <main className="flex-1 overflow-y-auto p-6" style={{ background:"#080810" }}>
          {views[active]}
        </main>
      </div>
    </div>
  );
}
