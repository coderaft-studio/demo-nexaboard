import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({ subsets: ["latin"] });

export const metadata = {
  title: "CoderaftBoard — Dashboard Manajemen Bisnis",
  description: "Platform dashboard modern untuk UMKM dan toko online. Kelola produk, pesanan, dan laporan dalam satu tampilan.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" className={geist.className}>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
