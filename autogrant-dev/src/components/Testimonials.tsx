"use client";
import React from 'react';

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      quote: '"AutoGrant is an amazing product, I literally finished 12 grant applications within 10 minutes, this is what it takes me to finish one manually. This product have saved me hundreds of hours for me."',
      author: 'Sarah Mitchell',
      handle: '@sarahm'
    },
    {
      id: 2,
      quote: '"Holy shit! AutoGrant is an great product, I literally finished 12 grant applications within 10 minutes, this is what it takes me to finish one manually. This product have saved me hundreds of hours for me."',
      author: 'Marcus Rodriguez',
      handle: '@marcusr'
    },
    {
      id: 3,
      quote: '"Holy shit! AutoGrant is an great product, I literally finished 12 grant applications within 10 minutes, this is what it takes me to finish one manually. This product have saved me hundreds of hours for me."',
      author: 'Emily Chen',
      handle: '@emilyc'
    }
  ];

  return (
    <div className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-16 text-black opacity-0 animate-[fadeInUp_0.8s_ease-out_0.2s_forwards]">
          What our customers say about us
        </h2>
                
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div 
              key={testimonial.id} 
              className="border border-gray-100 rounded-lg p-8 shadow-sm opacity-0 transform translate-y-8 animate-[fadeInUp_0.8s_ease-out_forwards] hover:shadow-lg hover:scale-105 transition-all duration-300"
              style={{
                animationDelay: `${0.4 + index * 0.2}s`
              }}
            >
              <div className="text-emerald-600 mb-6">
                <img
                  src="/quotes.png"
                  alt="Quotes icon"
                  width={24}
                  height={24}
                  className="text-emerald-600"
                />
              </div>
                            
              <p className="text-gray-800 text-lg mb-10">
                {testimonial.quote}
              </p>
                            
              <div className="flex items-center">
                <div className="mr-3">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-emerald-100 to-emerald-200 p-0.5">
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">
                        {testimonial.author.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <p className="font-medium text-black">{testimonial.author}</p>
                  <p className="text-sm text-gray-500">{testimonial.handle}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default Testimonials;