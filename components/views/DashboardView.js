const stats = [
  { label: "Total Pendapatan", value: "Rp 48.250.000", change: "+12.5%", up: true, icon: "💰", color: "bg-violet-50 text-violet-600" },
  { label: "Total Pesanan", value: "1.284", change: "+8.2%", up: true, icon: "🛒", color: "bg-blue-50 text-blue-600" },
  { label: "Pelanggan Baru", value: "342", change: "+5.1%", up: true, icon: "👥", color: "bg-emerald-50 text-emerald-600" },
  { label: "Produk Terjual", value: "5.621", change: "-2.4%", up: false, icon: "📦", color: "bg-amber-50 text-amber-600" },
];

const orders = [
  { id: "#ORD-001", customer: "Budi Santoso", product: "Batik Kawung Premium", total: "Rp 450.000", status: "Selesai", date: "04 Jun 2026" },
  { id: "#ORD-002", customer: "Sari Dewi", product: "Batik Parang Kusumo", total: "Rp 650.000", status: "Proses", date: "04 Jun 2026" },
  { id: "#ORD-003", customer: "Ahmad R.", product: "Batik Mega Mendung", total: "Rp 380.000", status: "Selesai", date: "03 Jun 2026" },
  { id: "#ORD-004", customer: "Rina W.", product: "Batik Sido Mukti", total: "Rp 520.000", status: "Dikirim", date: "03 Jun 2026" },
  { id: "#ORD-005", customer: "Hendra J.", product: "Batik Sekar Jagad", total: "Rp 750.000", status: "Pending", date: "02 Jun 2026" },
];

const statusStyle = {
  "Selesai": "bg-emerald-100 text-emerald-700",
  "Proses": "bg-blue-100 text-blue-700",
  "Dikirim": "bg-amber-100 text-amber-700",
  "Pending": "bg-slate-100 text-slate-600",
};

const barData = [
  { day: "Sen", val: 65 }, { day: "Sel", val: 80 }, { day: "Rab", val: 55 },
  { day: "Kam", val: 90 }, { day: "Jum", val: 75 }, { day: "Sab", val: 100 }, { day: "Min", val: 45 },
];

export default function DashboardView() {
  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-2xl p-5 border border-slate-100 hover:shadow-md transition-shadow">
            <div className={`w-10 h-10 ${s.color} rounded-xl flex items-center justify-center text-xl mb-3`}>{s.icon}</div>
            <div className="text-2xl font-bold text-slate-800 mb-1">{s.value}</div>
            <div className="text-slate-400 text-xs mb-2">{s.label}</div>
            <div className={`text-xs font-semibold ${s.up ? "text-emerald-600" : "text-red-500"}`}>
              {s.change} dari bulan lalu
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-slate-800">Pendapatan Minggu Ini</h3>
              <p className="text-slate-400 text-xs">Total: Rp 12.450.000</p>
            </div>
            <span className="text-xs bg-emerald-100 text-emerald-600 px-3 py-1 rounded-full font-semibold">+12.5%</span>
          </div>
          <div className="flex items-end gap-3 h-36">
            {barData.map((b) => (
              <div key={b.day} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full bg-violet-100 rounded-lg relative overflow-hidden" style={{ height: "100px" }}>
                  <div className="absolute bottom-0 left-0 right-0 bg-violet-500 rounded-lg transition-all"
                    style={{ height: `${b.val}%` }} />
                </div>
                <span className="text-slate-400 text-xs">{b.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top produk */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100">
          <h3 className="font-bold text-slate-800 mb-4">Produk Terlaris</h3>
          <div className="space-y-4">
            {[
              { name: "Batik Kawung", sold: 142, pct: 90 },
              { name: "Batik Parang", sold: 98, pct: 62 },
              { name: "Batik Mega Mendung", sold: 76, pct: 48 },
              { name: "Batik Sido Mukti", sold: 54, pct: 34 },
            ].map((p) => (
              <div key={p.name}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-600 font-medium">{p.name}</span>
                  <span className="text-slate-400">{p.sold} terjual</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full">
                  <div className="h-2 bg-violet-500 rounded-full" style={{ width: `${p.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Orders table */}
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-800">Pesanan Terbaru</h3>
          <button className="text-violet-600 text-sm font-semibold hover:text-violet-500">Lihat Semua →</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                {["ID Pesanan", "Pelanggan", "Produk", "Total", "Status", "Tanggal"].map((h) => (
                  <th key={h} className="text-left px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.map((o) => (
                <tr key={o.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-violet-600 font-semibold text-sm">{o.id}</td>
                  <td className="px-6 py-4 text-slate-700 text-sm font-medium">{o.customer}</td>
                  <td className="px-6 py-4 text-slate-500 text-sm">{o.product}</td>
                  <td className="px-6 py-4 text-slate-700 text-sm font-semibold">{o.total}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusStyle[o.status]}`}>{o.status}</span>
                  </td>
                  <td className="px-6 py-4 text-slate-400 text-sm">{o.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
