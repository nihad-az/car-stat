export function CtaSection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-4xl text-center">
        {/* CTA container with gradient background */}
        <div
          className="rounded-2xl p-12 border border-white/20 shadow-[0_0_25px_rgba(94,69,205,0.4)] 
                        bg-gradient-to-br from-blue-200/20 via-purple-200/10 to-blue-300/30 
                        relative overflow-hidden"
        >
          {/* subtle overlay pulse effect */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-purple-200/10 to-blue-200/20 animate-pulse rounded-2xl"></div>

          {/* content */}
          <div className="relative">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Ready to Find Your Perfect Car?
            </h2>
            <p className="text-xl text-black mb-8 max-w-2xl mx-auto">
              Join thousands of smart car buyers who use CarStat to make
              informed decisions. Start comparing cars today and find the
              perfect match for your needs.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="h-12 px-8 font-semibold bg-[#5e45cd] text-white rounded-lg hover:bg-[#4b38a8] transition flex items-center justify-center">
                Single Comparsion
              </button>

              <button className="h-12 px-8 font-semibold bg-[#5e45cd] text-white rounded-lg hover:bg-[#4b38a8] transition flex items-center justify-center">
                Bulk Comparsion
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
