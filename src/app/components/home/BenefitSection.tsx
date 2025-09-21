export function BenefitsSection() {
  const benefits = [
    "Compare up to 4 cars side-by-side with detailed specifications",
    "Access real-time pricing data from multiple dealerships",
    "Get personalized recommendations based on your preferences",
    "Save and share your favorite comparisons with friends",
    "Track price changes and get alerts for your dream car",
    "Access expert reviews and user ratings for every model",
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/10 backdrop-blur-md">
      <div className="container mx-auto max-w-4xl">
        {/* heading */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Everything You Need to Make the{" "}
            <span className="text-[#5e45cd]">Right Choice</span>
          </h2>
          <p className="text-xl text-black">
            Our platform gives you all the tools and data you need for confident
            car buying decisions.
          </p>
        </div>

        {/* benefits list */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex items-start gap-3">
              {/* simple check icon as emoji */}
              <span className="text-[#5e45cd] text-xl mt-0.5">✔</span>
              <p className="text-black">{benefit}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
