import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Background from "@/components/layout/Background";
import CustomCursor from "@/components/layout/CustomCursor";
import SmoothScroll from "@/components/layout/SmoothScroll";
import PortfolioModal from "@/components/shared/PortfolioModal";
import { UIProvider } from "@/context/UIContext";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-heading",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Frame 2 Remember | Premium Photography in New Zealand",
  description: "Timeless photography by Rohit Basak. Specializing in weddings, portraits, and events since 2018 in New Zealand.",
  openGraph: {
    title: "Frame 2 Remember | Premium Photography in New Zealand",
    description: "Timeless photography by Rohit Basak. Weddings, portraits & events since 2018.",
    images: ["/Logo-1.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="antialiased">
        <UIProvider>
          <SmoothScroll>
            <Background />
            <CustomCursor />
            <Navbar />
            <PortfolioModal />
            <main id="smooth-wrapper">
              <div id="smooth-content">
                {children}
              </div>
            </main>
            <Analytics />
          </SmoothScroll>
        </UIProvider>
      </body>
    </html>
  );
}
