"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from 'next/navigation';
import { auth } from "@/lib/firebase";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword 
} from "firebase/auth";

export default function Hero() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLogin, setIsLogin] = useState(true);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter(); 

  const confirmPasswordRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const openAuthModal = (loginMode = true) => {
    setIsLogin(loginMode);
    setIsAuthModalOpen(true);
    // Reset form state when modal opens
    setError(null);
    setEmail('');
    setPassword('');
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const handleAuthAction = async () => { 
    setIsLoading(true);
    setError(null);

    // Sign Up 
    if (!isLogin) {
      const confirmPasswordValue = confirmPasswordRef.current?.value;

      if (password !== confirmPasswordValue) {
        setError("Passwords do not match.");
        setIsLoading(false);
        return;
      }
      try {
        await createUserWithEmailAndPassword(auth, email, password);
        router.push("/onboarding");
        closeAuthModal();
      } catch (err: any) {
        
        if (err.code === 'auth/email-already-in-use') {
          setError('An account already exists with this email address.');
        } else {
          setError('Failed to create an account. Please try again.');
        }
        console.error("Signup Error:", err); 
      }
    } 
    // Login 
    else {
      try {
        await signInWithEmailAndPassword(auth, email, password);
        router.push("/dashboard");
        closeAuthModal();
      } catch (err: any) {
        if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
            setError('Invalid email or password. Please try again.');
        } else {
            setError('Failed to log in. Please try again.');
        }
        console.error("Login Error:", err); 
      }
    }
    setIsLoading(false);
  };

  return (
    <div className="bg-emerald-600 md:min-h-screen overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-emerald-400/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-1/3 -right-20 w-60 h-60 bg-emerald-300/15 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-10 left-1/4 w-32 h-32 bg-emerald-500/20 rounded-full blur-lg animate-pulse delay-500"></div>
      </div>

      {/* Navbar */}
      <nav className={`w-full md:py-4 md:px-6 relative z-10 transition-all duration-1000 ${isLoaded ? 'translate-y-0 opacity-100' : '-translate-y-20 opacity-0'}`}>
        <div className="max-w-7xl bg-white md:rounded-full shadow-lg p-4 md:my-4 md:mx-4 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
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
               <button onClick={() => openAuthModal(true)} className="text-gray-700 font-bold hover:text-emerald-600 transition-all duration-300 hover:scale-105">
                Log in
              </button>
              <button
                onClick={() => openAuthModal(false)}
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
                  onClick={() => openAuthModal(true)}
                  className="text-gray-700 hover:text-emerald-600 transition-all duration-300"
                >
                  Log in
                </button>
                <button
                  onClick={() => openAuthModal(false)}
                  className="bg-emerald-600 text-white px-4 py-2 rounded-full hover:bg-emerald-700 transition-all duration-300 hover:scale-105"
                >
                  Sign Up Free
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="py-10 md:py-20 relative z-10">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className={`mb-2 text-white/80 flex justify-center items-center transition-all duration-1000 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`} style={{ transitionDelay: '600ms' }}>
            <span className="text-sm text-[#00FFC2] font-medium italic animate-pulse">
              AI-powered assistant
            </span>
          </div>

          <h1 className={`text-4xl md:text-5xl font-bold text-white relative leading-snug transition-all duration-1200 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`} style={{ transitionDelay: '800ms' }}>
            <span className="absolute left-0 md:left-45 -top-4 text-white text-xl md:text-4xl animate-spin-slow">
              ✦
            </span>
            Start, manage, and complete{" "}
            <span className="hidden md:inline">
              <br />{" "}
            </span>
            <span className="bg-gradient-to-r from-white to-emerald-200 bg-clip-text text-transparent animate-pulse">
              grants easily
            </span> with AutoGrant AI
            <span className="absolute bottom-0 md:-bottom-5 text-[#00FFC2] text-base md:text-2xl animate-bounce">
              ✦
            </span>
          </h1>

          <p className={`text-white/90 mb-8 text-lg transition-all duration-1000 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`} style={{ transitionDelay: '1000ms' }}>
            One tap, one click access to all grants
          </p>

          <div className={`max-w-2xl mx-auto transition-all duration-1200 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`} style={{ transitionDelay: '1200ms' }}>
            <div className="relative bg-white rounded-full hover:shadow-2xl transition-all duration-500 group">
              <input
                type="text"
                placeholder="Find the latest grant programs you can apply to..."
                className="w-full px-6 py-4 md:py-5 text-gray-800 rounded-full shadow-md focus:outline-none focus:ring-4 focus:ring-emerald-300/50 transition-all duration-300"
              />
              <button className="absolute right-2 top-2 bg-emerald-600 text-white p-2.5 md:p-4 rounded-full hover:bg-emerald-700 transition-all duration-300 hover:scale-110 hover:rotate-12 group-hover:animate-pulse">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Preview */}
      <div className="relative">
        <div className="max-w-6xl mx-auto px-6">
          <div className={`rounded-t-lg shadow-lg overflow-hidden transition-all duration-1500 hover:scale-105 hover:shadow-2xl ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-32 opacity-0'}`} style={{ transitionDelay: '1400ms' }}>
            <img
              src="/dashboard.png"
              alt="AutoGrant Dashboard Preview"
              className="w-full h-auto"
            />
          </div>
        </div>
      </div>

    
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
          {isLogin ? "Welcome Back" : "Create Your Account"}
        </h2>
        <p className="text-gray-600">
          {isLogin
            ? "One tap, one click access to all grants"
            : "Join AutoGrant and unlock smarter grant access"}
        </p>
      </div>
     <form onSubmit={(e) => { e.preventDefault(); handleAuthAction(); }}>
      {/* Email Input */}
      <div className="mb-4">
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
          Email
        </label>
        <input
          type="email"
          id="email"
          placeholder="hello@autogrant.ng"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="off"
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 hover:border-emerald-300"
        />
      </div>

      {/* Password */}
      <div className="mb-4">
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
          Password
        </label>
        <input
          type="password"
          id="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="off"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 hover:border-emerald-300"
        />
      </div>

      {/* Confirm Password (Signup only) */}
      {!isLogin && (
        <div className="mb-4">
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            placeholder="confirm password"
            ref={confirmPasswordRef}
            required
            autoComplete="off"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 hover:border-emerald-300"
          />
        </div>
      )}

       {/* Display Error Message */}
      {error && (<p className="text-red-500 text-sm text-center mb-4">{error}</p>)}

      {/* Auth Button */}
      <button
        type="submit"
        onClick={handleAuthAction}
        disabled={isLoading}
        className="w-full cursor-pointer bg-emerald-600 text-white py-3 rounded-lg font-medium hover:bg-emerald-700 transition-all duration-300 mb-4 hover:scale-105 hover:shadow-lg"
      >
         {isLoading ? 'Processing...' : (isLogin ? "Login" : "Sign Up")}
      </button>

      {/* Toggle Mode */}
      <p className="text-sm text-gray-600 text-center mt-2">
        {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="text-emerald-600 font-medium hover:underline"
        >
          {isLogin ? "Sign up" : "Log in"}
        </button>
      </p>
      </form>
      {/* Terms */}
      <p className="text-xs text-gray-500 text-center mt-4">
        By continuing you agree to AutoGrant{" "}
        <a href="#" className="text-emerald-600 hover:underline transition-all duration-300">
          terms
        </a>{" "}
        and{" "}
        <a href="#" className="text-emerald-600 hover:underline transition-all duration-300">
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
        
        @keyframes spin-slow {
          from { 
            transform: rotate(0deg); 
          }
          to { 
            transform: rotate(360deg); 
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        
        .animate-slideUp {
          animation: slideUp 0.4s ease-out;
        }
        
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
    </div>
  );
}