"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout, loading } = useAuth();

  if (loading) {
    return null;
  }

  return (
    <header className="bg-[#121212] text-white border-b border-[#222222]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Navigation */}
          <div className="flex items-center space-x-8">
            {/* Logo */}
            <a href="/" className="flex items-center">
              <img
                src="https://cdn.prod.website-files.com/6398ef8be4937997427ec569/639b5d75d12f2ba12961e1df_Logo%201.webp"
                alt="Musiversal"
                className="h-8"
              />
            </a>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              <a
                href="/unlimited"
                className="text-[#FFCC00] hover:text-[#FFD700] px-3 py-2 text-sm font-medium transition-colors duration-200"
              >
                Unlimited
              </a>
              <a
                href="https://musiversal.com/hire-session-musicians"
                className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors duration-200"
              >
                Roster
              </a>
              <a
                href="https://musiversal.com/orchestras"
                className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors duration-200"
              >
                Orchestras
              </a>
              <a
                href="https://musiversal.com/blog"
                className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors duration-200"
              >
                Blog
              </a>
            </nav>
          </div>

          {/* Right side buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-gray-300">Hello, {user.email}</span>
                <button
                  onClick={() => logout()}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md text-sm transition-colors duration-200"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <a
                  href="/login"
                  className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors duration-200"
                >
                  Login
                </a>
                <a
                  href="https://musiversal.com/"
                  className="bg-[#FFCC00] hover:bg-[#FFD700] text-black font-medium px-4 py-2 rounded-md text-sm transition-colors duration-200"
                >
                  JOIN WAITLIST
                </a>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              aria-controls="mobile-menu"
              aria-expanded={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {!isMobileMenuOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      {isMobileMenuOpen && (
        <div className="md:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-[#1A1A1A]">
            <a
              href="/unlimited"
              className="text-[#FFCC00] hover:text-[#FFD700] block px-3 py-2 text-base font-medium"
            >
              Unlimited
            </a>
            <a
              href="https://musiversal.com/hire-session-musicians"
              className="text-gray-300 hover:text-white block px-3 py-2 text-base font-medium"
            >
              Roster
            </a>
            <a
              href="https://musiversal.com/orchestras"
              className="text-gray-300 hover:text-white block px-3 py-2 text-base font-medium"
            >
              Orchestras
            </a>
            <a
              href="https://musiversal.com/blog"
              className="text-gray-300 hover:text-white block px-3 py-2 text-base font-medium"
            >
              Blog
            </a>

            {user ? (
              <>
                <span className="block px-3 py-2 text-base text-gray-300">
                  Hello, {user.email}
                </span>
                <button
                  onClick={() => {
                    logout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full text-left bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <a
                  href="/login"
                  className="text-gray-300 hover:text-white block px-3 py-2 text-base font-medium"
                >
                  Login
                </a>
                <a
                  href="https://musiversal.com/"
                  className="bg-[#FFCC00] hover:bg-[#FFD700] text-black font-medium block px-3 py-2 rounded-md text-base mt-4 mx-2"
                >
                  JOIN WAITLIST
                </a>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
