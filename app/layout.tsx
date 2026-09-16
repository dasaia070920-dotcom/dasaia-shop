import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

import { CartProvider } from "./context/CartContext";
import { FavoritesProvider } from "./context/FavoritesContext";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export const metadata: Metadata = {
  title: "DASAIA | Moda, Belleza y Accesorios",
  description:
    "Descubre moda, perfumes, cosmética y accesorios con un estilo elegante.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={geist.variable}>
      <body className="bg-[#faf9f7] text-black antialiased">
        <FavoritesProvider>
          <CartProvider>{children}</CartProvider>
        </FavoritesProvider>
      </body>
    </html>
  );
}