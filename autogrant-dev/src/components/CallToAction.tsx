import React from 'react';
import Image from 'next/image';

const CallToAction = () => {
  return (
    <div className="lg:w-full  md:max-w-7xl h-[380px] md:h-[530px] mx-2 md:mx-auto rounded-4xl md:rounded-[60px] overflow-hidden shadow-xl text-white relative">
      {/* Background container */}
      <div className="absolute inset-0 w-full h-full">
        <Image 
          src="/background.jpg" 
          alt="Gradient background" 
          layout="fill" 
          objectFit="cover" 
          priority 
        />
      </div>
      
      {/* Content container */}
      <div className="relative z-10 flex flex-col items-center justify-center pt-14 md:pt-20 px-3 md:px-6 text-center">
        <h2 className="text-4xl md:text-5xl max-w-3xl font-semibold mb-2 md:mb-4">
          Complete grant program in minutes
        </h2>
        
        <p className="text-base md:text-xl mb-4 md:mb-8">
          AutoGrant powers your grant application journey.
        </p>
        
        <button className="bg-white font-medium text-emerald-600  py-2 md:py-3 px-4 md:px-8 rounded-full text-base md:text-lg hover:bg-gray-100 transition-colors duration-300">
          Sign Up Free
        </button>
      </div>
      
    </div>
  );
};

export default CallToAction;