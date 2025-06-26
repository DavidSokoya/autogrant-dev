"use client"
import React, { useState, useEffect, useRef } from 'react';

interface VisibleCards {
  card1?: boolean;
  card2?: boolean;
  card3?: boolean;
  card4?: boolean;
}

const FeatureSection: React.FC = () => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [visibleCards, setVisibleCards] = useState<VisibleCards>({});
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Stagger card animations
          setTimeout(() => setVisibleCards(prev => ({ ...prev, card1: true })), 200);
          setTimeout(() => setVisibleCards(prev => ({ ...prev, card2: true })), 400);
          setTimeout(() => setVisibleCards(prev => ({ ...prev, card3: true })), 600);
          setTimeout(() => setVisibleCards(prev => ({ ...prev, card4: true })), 800);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section id='features' ref={sectionRef} className="py-20 px-4 bg-white relative overflow-hidden">


      <div className={`w-full md:max-w-xl mx-auto text-center mb-12 transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
        <div className="flex justify-center mb-4">
          <button className="bg-gradient-to-r from-[#1E9478] to-[#00A67F] text-white text-sm px-4 py-2 rounded-full flex items-center hover:scale-105 transition-all duration-300 hover:shadow-lg group">
            <img 
              src="/magic.png" 
              alt="Magic icon" 
              className="h-5 w-5 mr-2 group-hover:rotate-12 transition-transform duration-300"
            />
            <span className="group-hover:animate-pulse">AI Grant Assistant</span>
          </button>
        </div>
        <h2 className={`text-4xl font-bold text-black mb-4 transition-all duration-1200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`} style={{ transitionDelay: '200ms' }}>
          Manage your grant application - <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">All in one place</span>
        </h2>
        <p className={`text-lg text-gray-600 transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`} style={{ transitionDelay: '400ms' }}>
          Fill your grant information once and let the AI assistant aid you fill many more with review to help you win effortlessly
        </p>
      </div>

      {/* Feature Grid */}
      <div className="max-w-[1200px] mx-auto mt-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Access to grants - Left top card */}
          <div className={`col-span-12 md:col-span-7 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-700 group cursor-pointer ${visibleCards.card1 ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-20 opacity-0 scale-95'}`}
               style={{
                 background: 'linear-gradient(90deg, #00B78B 0%, #000000 57%, #00cb9a 100%)'
               }}>
            <div className="px-6 pt-6 text-white transform transition-transform duration-500 group-hover:-translate-y-1">
              <h3 className="text-xl font-semibold mb-2 group-hover:text-emerald-200 transition-colors duration-300">Access to grants</h3>
              <p className="text-white text-opacity-90 mb-4 group-hover:text-opacity-100 transition-all duration-300">
                Gain access to a repo of grant programs across Nigeria
              </p>
              <div className="bg-white bg-opacity-10 rounded-t-3xl overflow-hidden shadow-md transition-all duration-500 group-hover:bg-opacity-20">
                <div className="relative h-72 overflow-hidden">
                  <img 
                    src="/images/grants.png" 
                    alt="Grant programs list interface"
                    className="w-full h-full object-cover rounded-t-3xl transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Autofill with AI - Right top card */}
          <div className={`col-span-12 md:col-span-5 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-700 group cursor-pointer ${visibleCards.card2 ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-20 opacity-0 scale-95'}`}>
            <div className="px-6 pt-6 text-white transform transition-transform duration-500 group-hover:-translate-y-1">
              <h3 className="text-xl font-semibold mb-2 group-hover:text-emerald-200 transition-colors duration-300">Autofill with AI</h3>
              <p className="text-white text-opacity-90 mb-4 group-hover:text-opacity-100 transition-all duration-300">
                AI autofill for you based on your profile information
              </p>
              <div className="bg-white bg-opacity-10 rounded-t-3xl overflow-hidden shadow-md transition-all duration-500 group-hover:bg-opacity-20">
                <div className="relative h-72 overflow-hidden">
                  <img 
                    src="/images/autofill.png" 
                    alt="AI autofill interface"
                    className="w-full h-full object-cover rounded-t-3xl transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* AI reviews - Left bottom card */}
          <div className={`col-span-12 md:col-span-5 bg-gradient-to-br from-emerald-500 via-teal-500 to-teal-600 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-700 group cursor-pointer ${visibleCards.card3 ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-20 opacity-0 scale-95'}`}>
            <div className="px-6 pt-6 text-white transform transition-transform duration-500 group-hover:-translate-y-1">
              <h3 className="text-xl font-semibold mb-2 group-hover:text-emerald-200 transition-colors duration-300">AI reviews</h3>
              <p className="text-white text-opacity-90 mb-4 group-hover:text-opacity-100 transition-all duration-300">
                AI reviews your application to grants for better chance to win
              </p>
              <div className="bg-white bg-opacity-10 rounded-t-3xl overflow-hidden shadow-md transition-all duration-500 group-hover:bg-opacity-20">
                <div className="relative h-72 overflow-hidden">
                  <img 
                    src="/images/ai_reviews.png" 
                    alt="AI review interface"
                    className="w-full h-full object-cover rounded-t-3xl transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Unified details - Right bottom card (wider) */}
          <div className={`col-span-12 md:col-span-7 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-700 group cursor-pointer ${visibleCards.card4 ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-20 opacity-0 scale-95'}`}
               style={{
                 background: 'linear-gradient(90deg, #00B78B 0%, #000000 57%, #00cb9a 100%)'
               }}>
            <div className="px-6 pt-6 text-white transform transition-transform duration-500 group-hover:-translate-y-1">
              <h3 className="text-xl font-semibold mb-2 group-hover:text-emerald-200 transition-colors duration-300">Unified details</h3>
              <p className="text-white text-opacity-90 mb-4 group-hover:text-opacity-100 transition-all duration-300">
                All information ever needed for a grant platform unified in one
              </p>
              <div className="bg-white bg-opacity-10 rounded-t-3xl overflow-hidden shadow-md transition-all duration-500 group-hover:bg-opacity-20">
                <div className="relative h-72 overflow-hidden">
                  <img 
                    src="/images/unified.png" 
                    alt="Unified details interface"
                    className="w-full h-full object-cover rounded-t-3xl transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  {/* Data Flow Animation */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-white rounded-full animate-ping"></div>
                    <div className="absolute top-1/2 right-1/3 w-1 h-1 bg-white rounded-full animate-ping" style={{ animationDelay: '0.3s' }}></div>
                    <div className="absolute bottom-1/3 left-1/2 w-1 h-1 bg-white rounded-full animate-ping" style={{ animationDelay: '0.6s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { 
            transform: translateY(0px); 
          }
          50% { 
            transform: translateY(-20px); 
          }
        }
        
        @keyframes float-delayed {
          0%, 100% { 
            transform: translateY(0px); 
          }
          50% { 
            transform: translateY(-15px); 
          }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite;
          animation-delay: 2s;
        }
      `}</style>
    </section>
  );
};

export default FeatureSection;