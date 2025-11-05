import type { Metadata } from "next";
import CardSection from "../components/single-comparison/CardSection";

export const metadata: Metadata = {
  title: "Single Car Comparison | CarStat.net",
  description:
    "Compare detailed stats, specs, and performance of a specific car on CarStat.net. View horsepower, torque, 0–100 times, and more.",
  openGraph: {
    title: "Single Car Comparison | CarStat.net",
    description:
      "Dive into detailed car specs and performance data from 2000–2025. Find out how your car performs compared to others.",
    url: "https://carstat.net/single-comparison",
    siteName: "CarStat.net",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Single Car Comparison | CarStat.net",
      },
    ],
  },
};

const SingleComparisonPage = () => {
  return (
    <main className="min-h-screen py-8">
      <h1 className="sr-only">Single Car Comparison</h1>
      <CardSection />
    </main>
  );
};

export default SingleComparisonPage;
