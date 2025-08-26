// src/app/layout.tsx
import type { Metadata } from "next";
import Script from "next/script";
import Analytics from "./analytics";
import "./globals.css";
import Container from "@/components/ui/container";

export const metadata: Metadata = {
  // Pakai BASE_URL dari env saat prod; fallback ke localhost saat dev
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000"),
  title: "AlaStay",
  description: "Platform reservasi penginapan lokal",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const ga = process.env.NEXT_PUBLIC_GA_ID;

  return (
    <html lang="id">
      <body suppressHydrationWarning>
        <header className="sticky top-0 z-10 border-b bg-white/80 backdrop-blur">
          <Container>
            <nav className="flex h-14 items-center gap-4">
              <a href="/" className="font-semibold">AlaStay</a>
              <a href="/penginapan" className="text-sm hover:underline">Penginapan</a>
              <div className="ml-auto text-xs text-gray-500">beta</div>
            </nav>
          </Container>
        </header>
        <Container>{children}</Container>

        {/* Google Analytics (opsional, aktif bila GA ID tersedia) */}
        {ga ? (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${ga}`}
              strategy="afterInteractive"
            />
            <Script id="ga-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${ga}');
              `}
            </Script>
            <Analytics />
          </>
        ) : null}
      </body>
    </html>
  );
}
