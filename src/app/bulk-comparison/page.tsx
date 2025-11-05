import type { Metadata } from "next";
import BulkComparison from "../components/bulk-comparison/BulkComparison";

export const metadata: Metadata = {
  title: "Bulk Car Comparison | CarStat.net",
  description:
    "Compare multiple cars side by side — analyze performance, specs, and key stats for popular models from 2000–2025.",
  openGraph: {
    title: "Bulk Car Comparison | CarStat.net",
    description:
      "Compare multiple cars at once on CarStat.net. Explore detailed stats like horsepower, torque, weight, and acceleration.",
    url: "https://carstat.net/bulk-comparison",
    siteName: "CarStat.net",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Bulk Car Comparison | CarStat.net",
      },
    ],
  },
};

const BulkComparisonPage = () => {
  return (
    <main className="min-h-screen py-8">
      <h1 className="sr-only">Bulk Car Comparison</h1>
      <BulkComparison />
    </main>
  );
};

export default BulkComparisonPage;
