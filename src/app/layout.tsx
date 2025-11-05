import type { Metadata } from "next";
import Footer from "./components/layout/Footer";
import Header from "./components/layout/Header";
import ScrollToTop from "./components/UI/ScrollToTop";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "CarStat.net — Compare Car Specs, Performance & Stats",
    template: "%s | CarStat.net",
  },
  description:
    "CarStat.net lets you compare cars by performance, specs, and design. Explore stats from 2000–2025 for the most popular German car brands and models.",
  keywords: [
    "CarStat",
    "car comparison",
    "car specs",
    "vehicle stats",
    "car database",
    "BMW",
    "Audi",
    "Mercedes",
    "Volkswagen",
    "Porsche",
    "car performance comparison",
  ],
  authors: [{ name: "Nihad Ibrahimli", url: "https://github.com/nihad-az" }],
  openGraph: {
    title: "CarStat.net — Compare Car Specs, Performance & Stats",
    description:
      "Compare detailed car stats, horsepower, torque, acceleration, and more. Discover how your car stacks up against others from 2000–2025.",
    url: "https://carstat.net",
    siteName: "CarStat.net",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "CarStat.net - Compare Car Specs, Performance & Stats",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CarStat.net — Compare Car Specs, Performance & Stats",
    description:
      "Easily compare cars, analyze specs, and explore detailed performance stats for top German brands from 2000–2025.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen antialiased bg-[#0a0a0a] text-gray-100">
        <Header />
        <main id="main-content" className="flex-grow">
          {children}
        </main>
        <Footer />
        <ScrollToTop />
      </body>
    </html>
  );
}
