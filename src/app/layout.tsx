import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { SplashScreen } from "@/components/SplashScreen";
import { Providers } from "@/components/Providers";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "CN Top - Online Sipariş",
  description: "Kaliteli ürünler, kolay sipariş. Online alışveriş deneyimi.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body
        className={`${plusJakarta.variable} font-sans antialiased`}
      >
        <SplashScreen />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
