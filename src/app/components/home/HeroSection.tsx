export function HeroSection() {
  return (
    <section className="relative py-15 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* background gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-200/20 via-purple-200/10 to-blue-300/30 dark:from-blue-400/20 dark:via-purple-400/10 dark:to-blue-500/30"></div>
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-purple-200/10 to-blue-200/20 dark:via-purple-400/10 dark:to-blue-400/20 animate-pulse"></div>

      {/* content */}
      <div className="relative container mx-auto max-w-4xl text-center">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
          Compare Cars Like a <span className="text-[#5e45cd]">Pro</span>
        </h1>
        <p className="text-xl text-black mb-12 max-w-2xl mx-auto">
          Get detailed statistics, performance metrics, and side-by-side
          comparisons to make the perfect car buying decision.
        </p>
      </div>
    </section>
  );
}
