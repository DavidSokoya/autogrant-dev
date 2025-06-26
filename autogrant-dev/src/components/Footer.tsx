import React from "react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-white py-10 pt-36">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        <div className="lg:grid lg:grid-cols-5 lg:col-span-5">
        <div className="mb-8 lg:mb-12">
          <Link href="/" className="flex items-center">
            <div className="rounded-full mr-2 flex items-center justify-center">
              <img src="/logo.png" alt="AutoGrant Logo" className="w-8 h-8" />
            </div>
            <span className="text-2xl font-bold text-gray-900">
              AutoGrant.ng
            </span>
          </Link>
          <p className="mt-2 text-gray-600">
            One tap; one click access to
            <br />
            all grants
          </p>
        </div>
                  {/* Navigation Links - 2 cols on mobile, 4 cols on desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-4 lg:col-span-4 gap-6 lg:gap-8">
          {/* Features */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Features
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="#features"
                  className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
                >
                  Grant Analyzer
                </Link>
              </li>
              <li>
                <Link
                  href="#features"
                  className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
                >
                  Autofill
                </Link>
              </li>
              <li>
                <Link
                  href="#features"
                  className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
                >
                  Grant repo
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Company
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="#"
                  className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
                >
                  About us
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  href="#faqs"
                  className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
                >
                  FAQs
                </Link>
              </li>
            </ul>
          </div>

          {/* Legals */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Legals
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/terms"
                  className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
                >
                  Terms
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy-policy"
                  className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
                >
                  Privacy policy
                </Link>
              </li>
              <li>
                <Link
                  href="/refund-policy"
                  className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
                >
                  Refund policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Socials */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Socials
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
                >
                  X (Twitter)
                </a>
              </li>
              <li>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
                >
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>
        </div>

        </div>



        {/* Copyright */}
        <div className="mt-12 pt-6 border-t border-gray-200 text-center text-sm text-gray-600">
          <p>Copyright © 2025 AutoGrant.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;