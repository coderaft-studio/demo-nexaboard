export default function Header({ active }) {
  const labels = {
    dashboard: "Dashboard", produk: "Manajemen Produk",
    pesanan: "Pesanan", pelanggan: "Pelanggan",
    laporan: "Laporan", pengaturan: "Pengaturan",
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 flex-shrink-0">
      <div>
        <h1 className="text-lg font-bold text-slate-800">{labels[active]}</h1>
        <p className="text-xs text-slate-400">Selamat datang kembali, Admin 👋</p>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative">
          <input placeholder="Cari..." className="bg-slate-100 rounded-xl px-4 py-2 text-sm outline-none w-48 focus:ring-2 focus:ring-violet-200 focus:bg-white transition-all" />
        </div>
        <button className="relative w-9 h-9 bg-slate-100 rounded-xl flex items-center justify-center hover:bg-slate-200 transition-colors">
          🔔
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">3</span>
        </button>
        <div className="w-9 h-9 bg-violet-600 rounded-xl flex items-center justify-center text-white font-bold text-sm">AD</div>
      </div>
    </header>
  );
}
