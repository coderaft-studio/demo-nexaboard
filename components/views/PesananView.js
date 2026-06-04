"use client";
import { useState } from "react";

const initialOrders = [
  { id: "#ORD-001", customer: "Budi Santoso", phone: "0812-3456-7890", product: "Batik Kawung Premium", qty: 2, total: 900000, status: "Selesai", date: "04 Jun 2026", alamat: "Jl. Merdeka No.12, Jakarta" },
  { id: "#ORD-002", customer: "Sari Dewi", phone: "0821-9876-5432", product: "Batik Parang Kusumo", qty: 1, total: 650000, status: "Dikirim", date: "04 Jun 2026", alamat: "Jl. Sudirman No.45, Bandung" },
  { id: "#ORD-003", customer: "Ahmad Rizky", phone: "0857-1234-5678", product: "Batik Mega Mendung", qty: 3, total: 1140000, status: "Proses", date: "03 Jun 2026", alamat: "Jl. Gatot Subroto No.8, Surabaya" },
  { id: "#ORD-004", customer: "Rina Wulandari", phone: "0813-5555-7777", product: "Batik Sido Mukti", qty: 1, total: 520000, status: "Pending", date: "03 Jun 2026", alamat: "Jl. Diponegoro No.3, Yogyakarta" },
  { id: "#ORD-005", customer: "Hendra Jaya", phone: "0878-2222-3333", product: "Batik Sekar Jagad", qty: 1, total: 750000, status: "Pending", date: "02 Jun 2026", alamat: "Jl. Ahmad Yani No.77, Semarang" },
  { id: "#ORD-006", customer: "Dewi Kusuma", phone: "0819-4444-6666", product: "Batik Truntum Cap", qty: 4, total: 1120000, status: "Selesai", date: "01 Jun 2026", alamat: "Jl. Imam Bonjol No.21, Medan" },
  { id: "#ORD-007", customer: "Fajar Nugroho", phone: "0853-8888-1111", product: "Batik Kawung Premium", qty: 1, total: 450000, status: "Proses", date: "01 Jun 2026", alamat: "Jl. Pemuda No.56, Bekasi" },
];

const statusFlow = ["Pending", "Proses", "Dikirim", "Selesai"];

const statusStyle = {
  Pending:  "bg-slate-100 text-slate-600",
  Proses:   "bg-blue-100 text-blue-700",
  Dikirim:  "bg-amber-100 text-amber-700",
  Selesai:  "bg-emerald-100 text-emerald-700",
};

const statusCount = (orders, s) => orders.filter((o) => o.status === s).length;

export default function PesananView() {
  const [orders, setOrders] = useState(initialOrders);
  const [filter, setFilter] = useState("Semua");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);

  const updateStatus = (id) => {
    setOrders(orders.map((o) => {
      if (o.id !== id) return o;
      const idx = statusFlow.indexOf(o.status);
      if (idx === statusFlow.length - 1) return o;
      return { ...o, status: statusFlow[idx + 1] };
    }));
  };

  const filtered = orders.filter((o) => {
    const matchFilter = filter === "Semua" || o.status === filter;
    const matchSearch = o.customer.toLowerCase().includes(search.toLowerCase()) ||
      o.id.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Status tabs */}
      <div className="grid grid-cols-5 gap-3">
        {["Semua", ...statusFlow].map((s) => (
          <button key={s} onClick={() => setFilter(s)}
            className={`rounded-2xl p-4 text-left border transition-all ${
              filter === s ? "bg-violet-600 border-violet-600 text-white shadow-lg shadow-violet-200" : "bg-white border-slate-100 hover:border-violet-200"
            }`}>
            <div className={`text-2xl font-bold mb-1 ${filter === s ? "text-white" : "text-slate-800"}`}>
              {s === "Semua" ? orders.length : statusCount(orders, s)}
            </div>
            <div className={`text-xs font-medium ${filter === s ? "text-violet-100" : "text-slate-400"}`}>{s}</div>
          </button>
        ))}
      </div>

      {/* Search & toolbar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-100 flex gap-4 items-center">
        <input value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari ID pesanan atau nama pelanggan..."
          className="bg-slate-100 rounded-xl px-4 py-2 text-sm outline-none flex-1 focus:ring-2 focus:ring-violet-200 transition-all" />
        <button className="bg-slate-100 hover:bg-slate-200 text-slate-600 px-4 py-2 rounded-xl text-sm font-medium transition-colors">
          Export CSV
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                {["ID", "Pelanggan", "Produk", "Qty", "Total", "Status", "Tanggal", "Aksi"].map((h) => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((o) => (
                <tr key={o.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-4 text-violet-600 font-bold text-sm whitespace-nowrap">{o.id}</td>
                  <td className="px-5 py-4">
                    <div className="font-semibold text-slate-800 text-sm">{o.customer}</div>
                    <div className="text-slate-400 text-xs">{o.phone}</div>
                  </td>
                  <td className="px-5 py-4 text-slate-600 text-sm max-w-[160px] truncate">{o.product}</td>
                  <td className="px-5 py-4 text-slate-700 text-sm font-medium text-center">{o.qty}</td>
                  <td className="px-5 py-4 text-slate-800 text-sm font-semibold whitespace-nowrap">
                    Rp {o.total.toLocaleString("id")}
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap ${statusStyle[o.status]}`}>
                      {o.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-slate-400 text-xs whitespace-nowrap">{o.date}</td>
                  <td className="px-5 py-4">
                    <div className="flex gap-2">
                      <button onClick={() => setSelected(o)}
                        className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap">
                        Detail
                      </button>
                      {o.status !== "Selesai" && (
                        <button onClick={() => updateStatus(o.id)}
                          className="text-xs bg-violet-50 hover:bg-violet-600 hover:text-white text-violet-600 px-3 py-1.5 rounded-lg font-medium transition-all whitespace-nowrap">
                          → {statusFlow[statusFlow.indexOf(o.status) + 1]}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 border-t border-slate-100 text-xs text-slate-400">
          {filtered.length} pesanan ditemukan
        </div>
      </div>

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-800">Detail Pesanan</h3>
              <button onClick={() => setSelected(null)} className="text-slate-400 hover:text-slate-600 text-xl">✕</button>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                <span className="text-violet-600 font-bold text-lg">{selected.id}</span>
                <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${statusStyle[selected.status]}`}>{selected.status}</span>
              </div>
              {[
                { label: "Pelanggan", val: selected.customer },
                { label: "Telepon", val: selected.phone },
                { label: "Alamat", val: selected.alamat },
                { label: "Produk", val: selected.product },
                { label: "Jumlah", val: `${selected.qty} pcs` },
                { label: "Total", val: `Rp ${selected.total.toLocaleString("id")}` },
                { label: "Tanggal", val: selected.date },
              ].map((item) => (
                <div key={item.label} className="flex gap-4">
                  <span className="text-slate-400 text-sm w-24 flex-shrink-0">{item.label}</span>
                  <span className="text-slate-700 text-sm font-medium">{item.val}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setSelected(null)}
                className="flex-1 border border-slate-200 text-slate-600 py-3 rounded-xl font-semibold hover:bg-slate-50 transition-colors text-sm">
                Tutup
              </button>
              {selected.status !== "Selesai" && (
                <button onClick={() => { updateStatus(selected.id); setSelected(null); }}
                  className="flex-1 bg-violet-600 hover:bg-violet-500 text-white py-3 rounded-xl font-semibold transition-colors text-sm">
                  Update → {statusFlow[statusFlow.indexOf(selected.status) + 1]}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
