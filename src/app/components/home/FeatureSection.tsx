export function FeaturesSection() {
  const features = [
    {
      icon: "📊",
      title: "Advanced Analytics",
      description:
        "Deep dive into performance metrics, fuel efficiency, and technical specifications with interactive charts and graphs.",
    },
    {
      icon: "⚡",
      title: "Lightning Fast",
      description:
        "Get instant comparisons with our optimized database of thousands of car models and their detailed specifications.",
    },
    {
      icon: "🛡️",
      title: "Reliable Data",
      description:
        "All data is sourced from official manufacturers and verified by automotive experts to ensure accuracy.",
    },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-6xl">
        {/* heading */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Why Choose <span className="text-[#5e45cd]">CarStat</span>?
          </h2>
          <p className="text-xl text-black max-w-2xl mx-auto">
            We provide the most comprehensive car comparison platform with
            cutting-edge features.
          </p>
        </div>

        {/* features flexbox */}
        <div className="flex flex-wrap gap-6 justify-center">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex-1 min-w-[250px] max-w-sm rounded-xl p-6 text-center 
                         bg-white/10 backdrop-blur-md 
                         shadow-[0_0_20px_rgba(0,0,0,0.15)] 
                         hover:shadow-[0_0_30px_rgba(94,69,205,0.4)]
                         transition-all duration-300"
            >
              <div className="mx-auto w-12 h-12 bg-[#5e45cd]/20 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">{feature.icon}</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-black text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
