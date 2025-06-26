"use client";
import { useState, useEffect } from "react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const openAuthModal = () => {
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const handleAuthAction = () => {
    // Redirect to onboarding page
    window.location.href = "/onboarding";
  };

  return (
    <div className="bg-white">
      {/* Navbar */}
      <nav className={`w-full md:py-4 md:px-6 relative z-10 transition-all duration-1000 ${isLoaded ? 'translate-y-0 opacity-100' : '-translate-y-20 opacity-0'}`}>
        <div className="md:max-w-7xl mx-auto bg-white md:rounded-full shadow-sm md:shadow-lg p-4 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <a href="/" className="flex items-center group">
                <div className="rounded-full mr-2 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                  <img
                    src="/logo.png"
                    alt="AutoGrant Logo"
                    className="w-8 h-8"
                  />
                </div>
                <span className="text-xl font-semibold text-gray-800 group-hover:text-emerald-600 transition-colors duration-300">
                  AutoGrant.ng
                </span>
              </a>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-8">
              {["Home", "Features", "About", "FAQs"].map((item, index) => (
                <a 
                  key={item}
                  href={`#${item.toLowerCase()}`} 
                  className={`text-gray-700 font-bold hover:text-emerald-600 transition-all duration-300 hover:scale-105 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                  style={{ transitionDelay: `${300 + index * 100}ms` }}
                >
                  {item}
                </a>
              ))}
            </div>

            {/* Desktop Login/Signup */}
            <div className={`hidden md:flex items-center space-x-4 transition-all duration-1000 ${isLoaded ? 'translate-x-0 opacity-100' : 'translate-x-20 opacity-0'}`} style={{ transitionDelay: '500ms' }}>
              <button onClick={openAuthModal} className="text-gray-700 font-bold hover:text-emerald-600 transition-all duration-300 hover:scale-105">
                Log in
              </button>
              <button
                onClick={openAuthModal}
                className="bg-emerald-600 text-white px-4 py-2 rounded-full hover:bg-emerald-700 transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                Sign Up Free
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={toggleMenu}
                className="text-gray-700 focus:outline-none transition-transform duration-300 hover:scale-110"
                aria-label="Toggle menu"
              >
                <div className={`transition-transform duration-300 ${isMenuOpen ? 'rotate-180' : ''}`}>
                  {isMenuOpen ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="3" y1="12" x2="21" y2="12"></line>
                      <line x1="3" y1="6" x2="21" y2="6"></line>
                      <line x1="3" y1="18" x2="21" y2="18"></line>
                    </svg>
                  )}
                </div>
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          <div className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out ${isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="px-2 mt-4 pt-4 border-t border-gray-200">
              <div className="flex flex-col space-y-4 pb-3">
                {["Home", "Features", "About", "FAQs"].map((item, index) => (
                  <a 
                    key={item}
                    href={`#${item.toLowerCase()}`}
                    className={`text-gray-700 hover:text-emerald-600 transition-all duration-300 hover:translate-x-2 ${isMenuOpen ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}
                    style={{ transitionDelay: `${index * 100}ms` }}
                  >
                    {item}
                  </a>
                ))}
              </div>
              <div className="flex items-center space-x-4 pt-4 border-t border-gray-200">
                <button
                  onClick={openAuthModal}
                  className="text-gray-700 hover:text-emerald-600 transition-all duration-300"
                >
                  Log in
                </button>
                <button
                  onClick={openAuthModal}
                  className="bg-emerald-600 text-white px-4 py-2 rounded-full hover:bg-emerald-700 transition-all duration-300 hover:scale-105"
                >
                  Sign Up Free
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Auth Modal */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 bg-black/80 bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-lg max-w-md w-full p-6 relative animate-slideUp">
            {/* Close Button */}
            <button
              onClick={closeAuthModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-all duration-300 hover:scale-110 hover:rotate-90"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

            {/* Modal Content */}
            <div className="text-center mb-6">
              <div className="rounded-full mr-2 flex items-center justify-center mb-4">
                <img
                  src="/logo.png"
                  alt="AutoGrant Logo"
                  className="w-8 h-8 animate-bounce"
                />
              </div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                Welcome to AutoGrant
              </h2>
              <p className="text-gray-600">
                One tap, one click access to all grants
              </p>
            </div>

            {/* Email Input */}
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                placeholder="hello@autogrant.ng"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 hover:border-emerald-300"
              />
            </div>

            {/* Login Button */}
            <button
              onClick={handleAuthAction}
              className="w-full cursor-pointer bg-emerald-600 text-white py-3 rounded-lg font-medium hover:bg-emerald-700 transition-all duration-300 mb-4 hover:scale-105 hover:shadow-lg"
            >
              Login
            </button>

            {/* Divider */}
            <div className="flex items-center mb-4">
              <div className="flex-1 border-t border-gray-300"></div>
              <span className="px-4 text-gray-500 text-sm">or</span>
              <div className="flex-1 border-t border-gray-300"></div>
            </div>

            {/* Google Login Button */}
            <button
              onClick={handleAuthAction}
              className="w-full border cursor-pointer border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-all duration-300 flex items-center justify-center hover:scale-105 hover:shadow-md"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                className="mr-2"
              >
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </button>

            {/* Terms */}
            <p className="text-xs text-gray-500 text-center mt-4">
              By continuing you agree to AutoGrant{" "}
              <a href="/terms" className="text-emerald-600 hover:underline transition-all duration-300">
                terms
              </a>{" "}
              and{" "}
              <a href="/privacy-policy" className="text-emerald-600 hover:underline transition-all duration-300">
                privacy policy
              </a>
              .
            </p>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from { 
            opacity: 0; 
          }
          to { 
            opacity: 1; 
          }
        }
        
        @keyframes slideUp {
          from { 
            transform: translateY(50px); 
            opacity: 0; 
          }
          to { 
            transform: translateY(0); 
            opacity: 1; 
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        
        .animate-slideUp {
          animation: slideUp 0.4s ease-out;
        }
      `}</style>
    </div>
  );
}