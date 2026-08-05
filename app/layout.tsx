import type { CSSProperties } from "react";
import type { Metadata, Viewport } from "next";
import { DM_Sans, Fraunces } from "next/font/google";
import { PwaInstallPrompt } from "@/components/pwa-install-prompt";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Soko — Le marché de confiance",
    template: "%s · Soko",
  },
  description:
    "Annonces vraies. Personnes vraies. Prix vrais. Marché classifié vérifié en RDC.",
  applicationName: "Soko",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Soko",
  },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/icon.svg", type: "image/svg+xml" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#0F3D2E",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fr"
      className={`${dmSans.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body
        className="min-h-full flex flex-col font-ui"
        style={
          {
            "--soko-font-ui": "var(--font-dm-sans), 'Segoe UI', sans-serif",
            "--soko-font-display":
              "var(--font-fraunces), 'Libre Baskerville', Georgia, serif",
          } as CSSProperties
        }
      >
        {children}
        <PwaInstallPrompt />
      </body>
    </html>
  );
}
