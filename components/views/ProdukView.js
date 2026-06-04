"use client";
import { useState } from "react";

const initialProduk = [
  { id: 1, nama: "Batik Kawung Premium", kategori: "Batik Tulis", harga: 450000, stok: 24, status: "Aktif" },
  { id: 2, nama: "Batik Parang Kusumo", kategori: "Batik Tulis", harga: 650000, stok: 12, status: "Aktif" },
  { id: 3, nama: "Batik Mega Mendung", kategori: "Batik Cap", harga: 380000, stok: 35, status: "Aktif" },
  { id: 4, nama: "Batik Sido Mukti", kategori: "Batik Tulis", harga: 520000, stok: 8, status: "Aktif" },
  { id: 5, nama: "Batik Truntum Cap", kategori: "Batik Cap", harga: 280000, stok: 0, status: "Habis" },
  { id: 6, nama: "Batik Sekar Jagad", kategori: "Batik Tulis", harga: 750000, stok: 5, status: "Aktif" },
];

export default function ProdukView() {
  const [produk, setProduk] = useState(initialProduk);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ nama: "", kategori: "Batik Tulis", harga: "", stok: "" });
  const [search, setSearch] = useState("");

  const filtered = produk.filter((p) =>
    p.nama.toLowerCase().includes(search.toLowerCase())
  );

  const hapus = (id) => setProduk(produk.filter((p) => p.id !== id));

  const tambah = (e) => {
    e.preventDefault();
    setProduk([...produk, {
      id: Date.now(), nama: form.nama, kategori: form.kategori,
      harga: Number(form.harga), stok: Number(form.stok),
      status: Number(form.stok) > 0 ? "Aktif" : "Habis",
    }]);
    setForm({ nama: "", kategori: "Batik Tulis", harga: "", stok: "" });
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="bg-white rounded-2xl p-5 border border-slate-100 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <input value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari produk..." className="bg-slate-100 rounded-xl px-4 py-2 text-sm outline-none w-64 focus:ring-2 focus:ring-violet-200 transition-all" />
        <button onClick={() => setShowModal(true)}
          className="bg-violet-600 hover:bg-violet-500 text-white px-5 py-2 rounded-xl text-sm font-semibold transition-colors flex items-center gap-2">
          + Tambah Produk
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                {["Nama Produk", "Kategori", "Harga", "Stok", "Status", "Aksi"].map((h) => (
                  <th key={h} className="text-left px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-semibold text-slate-800 text-sm">{p.nama}</td>
                  <td className="px-6 py-4 text-slate-500 text-sm">{p.kategori}</td>
                  <td className="px-6 py-4 text-slate-700 text-sm font-medium">Rp {p.harga.toLocaleString("id")}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={p.stok === 0 ? "text-red-500 font-semibold" : "text-slate-700"}>{p.stok}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${p.status === "Aktif" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 flex gap-2">
                    <button className="text-xs bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-1.5 rounded-lg font-medium transition-colors">Edit</button>
                    <button onClick={() => hapus(p.id)} className="text-xs bg-red-50 text-red-500 hover:bg-red-100 px-3 py-1.5 rounded-lg font-medium transition-colors">Hapus</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-3 border-t border-slate-100 text-xs text-slate-400">
          Menampilkan {filtered.length} dari {produk.length} produk
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">
            <h3 className="text-lg font-bold text-slate-800 mb-6">Tambah Produk Baru</h3>
            <form onSubmit={tambah} className="space-y-4">
              {[
                { name: "nama", label: "Nama Produk", placeholder: "Batik Kawung...", type: "text" },
                { name: "harga", label: "Harga (Rp)", placeholder: "450000", type: "number" },
                { name: "stok", label: "Stok", placeholder: "24", type: "number" },
              ].map((f) => (
                <div key={f.name}>
                  <label className="block text-sm font-medium text-slate-600 mb-1">{f.label}</label>
                  <input required name={f.name} type={f.type} placeholder={f.placeholder}
                    value={form[f.name]} onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100" />
                </div>
              ))}
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Kategori</label>
                <select value={form.kategori} onChange={(e) => setForm({ ...form, kategori: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-violet-400">
                  <option>Batik Tulis</option>
                  <option>Batik Cap</option>
                  <option>Batik Kombinasi</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)}
                  className="flex-1 border border-slate-200 text-slate-600 py-3 rounded-xl font-semibold hover:bg-slate-50 transition-colors">
                  Batal
                </button>
                <button type="submit"
                  className="flex-1 bg-violet-600 hover:bg-violet-500 text-white py-3 rounded-xl font-semibold transition-colors">
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
