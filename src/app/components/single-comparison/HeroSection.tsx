export default function CarComparison() {
  return (
    <div className="bg-background">
      {/* Hero Section with Gradient */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-200/20 via-purple-200/10 to-blue-300/30 dark:from-blue-400/20 dark:via-purple-400/10 dark:to-blue-500/30"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-purple-200/10 to-blue-200/20 dark:via-purple-400/10 dark:to-blue-400/20 animate-pulse"></div>
        <div className="relative container mx-auto max-w-6xl text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-balance mb-6">
            Single <span className="text-[#5e45cd]">Comparison</span>
          </h1>
          <p className="text-xl text-muted-foreground text-pretty max-w-2xl mx-auto mb-8">
            Compare two cars side by side with detailed specifications and
            performance metrics
          </p>
        </div>
      </section>
    </div>
  );
}
