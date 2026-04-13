export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import PolicyFooter from "@/components/PolicyFooter";
import Providers from "./providers";
import DesktopFooter from "@/components/DesktopFooter";
import OfflineBanner from "@/components/OfflineBanner";
import AppLayoutWrapper from "@/components/AppLayoutWrapper";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import TopLoader from "@/components/TopLoader";
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/scrollbar';
import 'swiper/css/zoom';
import { Playfair_Display } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-playfair",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Arunodaya Collections",
  description:
    "Arunodaya Collections Women, Men, Kids.",
  icons: {
    icon: "/images/arunodaya.png",
  },
  openGraph: {
    title: "Arunodaya Collections",
    description: "Arunodaya Collections",
    url: "https://www.arunodayacollections.com",
    siteName: "Arunodaya Collections",
    images: [
      {
        url: "/images/arunodayalogo.png",
        width: 800,
        height: 800,
        alt: "arunodaya Logo",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
     
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white`}
      >
        {/* ✅ ALL CLIENT CONTEXTS GO INSIDE Providers */}
      
        <Providers>
          <Script
            src="https://checkout.razorpay.com/v1/checkout.js"
            strategy="afterInteractive"
          />

          <main className="min-h-screen">
            <AppLayoutWrapper>
              <TopLoader/>
            {children}
            </AppLayoutWrapper>
          
          </main>
        </Providers>
      
      </body>
    </html>

  );
}
