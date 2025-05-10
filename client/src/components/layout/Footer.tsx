import { Facebook, Twitter, Instagram, Linkedin, Youtube } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-black text-white border-t border-gray-800">
      <div className="container mx-auto py-12 px-4">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-1">
            <a href="/" className="inline-block mb-4">
              <img
                src="https://cdn.prod.website-files.com/6398ef8be4937997427ec569/639b5d75d12f2ba12961e1df_Logo%201.webp"
                alt="Musiversal Logo"
                className="h-auto w-[150px]"
              />
            </a>
            <p className="text-gray-400 text-sm mb-6">
              Unlimited music production with world-class musicians. Retain 100%
              of your rights.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-400 hover:text-amber-500 transition-colors"
              >
                <Facebook size={18} />
                <span className="sr-only">Facebook</span>
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-amber-500 transition-colors"
              >
                <Twitter size={18} />
                <span className="sr-only">Twitter</span>
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-amber-500 transition-colors"
              >
                <Instagram size={18} />
                <span className="sr-only">Instagram</span>
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-amber-500 transition-colors"
              >
                <Linkedin size={18} />
                <span className="sr-only">LinkedIn</span>
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-amber-500 transition-colors"
              >
                <Youtube size={18} />
                <span className="sr-only">YouTube</span>
              </a>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="col-span-1">
            <h3 className="text-sm font-bold uppercase tracking-wider mb-4">
              Company
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Careers
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Blog
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Press
                </a>
              </li>
            </ul>
          </div>

          <div className="col-span-1">
            <h3 className="text-sm font-bold uppercase tracking-wider mb-4">
              Services
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Unlimited
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Roster
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Orchestras
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Enterprise
                </a>
              </li>
            </ul>
          </div>

          <div className="col-span-1">
            <h3 className="text-sm font-bold uppercase tracking-wider mb-4">
              Legal
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Cookie Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  GDPR
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8">
          <p className="text-gray-500 text-sm text-center">
            © {new Date().getFullYear()} Musiversal. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
