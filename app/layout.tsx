import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import localFont from "next/font/local";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";

import DocumentLocaleSync from "@/components/DocumentLocaleSync";
import SupportOverlay from "@/components/mdx/SupportOverlay";
import { buildSiteJsonLd, toJsonLdScript } from "@/lib/seoJsonLd";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const digital = localFont({
  src: "./fonts/DS-DIGIB.woff2",
  weight: "600",
  style: "normal",
  variable: "--font-digital",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://maenababneh.dev"),
  title: {
    default: "Maen Ababneh | معن عبابنة | Interactive 3D Portfolio",
    template: "%s | Maen Ababneh | معن عبابنة",
  },
  description:
    "Interactive 3D portfolio for Maen Ababneh, a full-stack developer crafting high-performance web products with Next.js, React, GSAP, and 3D experiences. | بورتفوليو ثلاثي الأبعاد تفاعلي لمعن عبابنة، مطور ويب متكامل يصمم منتجات ويب عالية الأداء باستخدام Next.js وReact وGSAP وتجارب 3D.",
  authors: [{ name: "Maen Ababneh" }, { name: "معن عبابنة" }],
  creator: "Maen Ababneh | معن عبابنة",
  keywords: [
    "Maen Ababneh",
    "معن عبابنة",
    "full-stack developer",
    "مطور ويب متكامل",
    "Next.js portfolio",
    "بورتفوليو",
    "React",
    "GSAP",
    "3D web",
    "ويب ثلاثي الأبعاد",
  ],
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "Maen Ababneh | معن عبابنة | Interactive 3D Portfolio",
    description:
      "Explore projects, articles, and interactive web experiments by Maen Ababneh, built with Next.js, React, and GSAP. | استكشف مشاريع ومقالات وتجارب ويب تفاعلية من معن عبابنة مبنية باستخدام Next.js وReact وGSAP.",
    url: "/",
    siteName: "Maen Ababneh Portfolio",
    locale: "en_US",
    alternateLocale: ["ar_AR"],
    type: "website",
    images: [
      {
        url: "https://res.cloudinary.com/djy5oyivn/image/upload/q_auto/f_auto/v1775844757/room-banner_mdfips.png",
        width: 1200,
        height: 630,
        alt: "Maen Ababneh | معن عبابنة | Interactive 3D Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Maen Ababneh | معن عبابنة | Interactive 3D Portfolio",
    description:
      "Explore projects, articles, and interactive web experiments by Maen Ababneh, built with Next.js, React, and GSAP. | استكشف مشاريع ومقالات وتجارب ويب تفاعلية من معن عبابنة مبنية باستخدام Next.js وReact وGSAP.",
    images: [
      "https://res.cloudinary.com/djy5oyivn/image/upload/q_auto/f_auto/v1775844757/room-banner_mdfips.png",
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${digital.variable} antialiased`}
      >
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: toJsonLdScript(buildSiteJsonLd()),
          }}
        />
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <DocumentLocaleSync />
          <noscript>
            <div className="p-4 text-sm bg-base-cream text-base-brwan dark:bg-base-blue-light dark:text-base-blue-dark">
              JavaScript is disabled. You can still browse key content and
              articles using the direct links.
            </div>
          </noscript>
          <SupportOverlay />
          {children}
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
