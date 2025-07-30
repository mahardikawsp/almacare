import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "@/components/providers/SessionProvider";
import { SWRProvider } from "@/components/providers/SWRProvider";
import { ToastContainer } from "@/components/notifications/ToastContainer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "BayiCare - Pantau Tumbuh Kembang Anak",
  description: "Aplikasi pemantauan tumbuh kembang anak berdasarkan standar WHO dan Kemenkes RI",
  keywords: ["bayi", "anak", "pertumbuhan", "imunisasi", "MPASI", "WHO", "kesehatan"],
  authors: [{ name: "BayiCare Team" }],
  creator: "BayiCare Team",
  publisher: "BayiCare",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "BayiCare",
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
};

export const viewport: Viewport = {
  themeColor: "#0ea5e9",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={inter.variable}>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="BayiCare" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <meta name="msapplication-TileColor" content="#0ea5e9" />
        <meta name="msapplication-tap-highlight" content="no" />
      </head>
      <body className={`${inter.className} antialiased`} style={{ backgroundColor: '#fee2e2', color: '#111827', fontFamily: 'Inter, system-ui, sans-serif' }}>
        <SessionProvider>
          <SWRProvider>
            {children}
            <ToastContainer />
          </SWRProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
