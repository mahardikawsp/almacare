import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SessionProvider } from "@/components/providers/SessionProvider";
import { SWRProvider } from "@/components/providers/SWRProvider";
import { ToastContainer } from "@/components/notifications/ToastContainer";
import { Toaster } from "@/components/ui/toaster";
import { OfflineIndicator } from "@/components/offline/OfflineIndicator";
import { InstallPrompt, IOSInstallPrompt } from "@/components/offline/InstallPrompt";

export const metadata: Metadata = {
  title: "AlmaCare - Pantau Tumbuh Kembang Anak",
  description: "Aplikasi pemantauan tumbuh kembang anak berdasarkan standar WHO dan Kemenkes RI",
  keywords: ["bayi", "anak", "pertumbuhan", "imunisasi", "MPASI", "WHO", "kesehatan"],
  authors: [{ name: "AlmaCare Team" }],
  creator: "AlmaCare Team",
  publisher: "AlmaCare",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "AlmaCare",
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
};

export const viewport: Viewport = {
  themeColor: "#f28e60",
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
    <html lang="id" className="font-sans">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="AlmaCare" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <meta name="msapplication-TileColor" content="#f28e60" />
        <meta name="msapplication-tap-highlight" content="no" />
      </head>
      <body className="font-sans antialiased bg-background-primary text-neutral-900">
        <SessionProvider>
          <SWRProvider>
            {children}
            <ToastContainer />
            <OfflineIndicator />
            <InstallPrompt />
            <IOSInstallPrompt />
          </SWRProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
