const Footer = () => {
  return (
    <footer className="mt-16 border-t border-black/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-bold text-[#5e45cd] mb-4">CarStat</h3>
            <p className="text-black mb-4 max-w-sm mx-auto md:mx-0">
              The ultimate destination for car comparisons. Make informed
              decisions with detailed stats and performance insights.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-black hover:text-[#5e45cd] transition-colors"
                >
                  Compare Cars
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-black hover:text-[#5e45cd] transition-colors"
                >
                  Car Reviews
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-black hover:text-[#5e45cd] transition-colors"
                >
                  Brand Directory
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-black hover:text-[#5e45cd] transition-colors"
                >
                  Help Center
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-black hover:text-[#5e45cd] transition-colors"
                >
                  Contact Us
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-black hover:text-[#5e45cd] transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-black/20 mt-10 pt-6 text-center text-sm text-black">
          &copy; {new Date().getFullYear()} Nihad Ibrahimli. All rights
          reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
