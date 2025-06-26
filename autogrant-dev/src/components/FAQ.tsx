"use client"
import React, { useState } from 'react';

type FaqItem = {
  id: number;
  question: string;
  answer: string;
};

const FAQ: React.FC = () => {
  const [openItem, setOpenItem] = useState<number | null>(null);
  
  const faqs: FaqItem[] = [
    {
      id: 1,
      question: "What is the AutoGrant, and how does it work?",
      answer: "AutoGrant is an AI-powered platform that helps you discover, apply for, and manage grant applications. It uses artificial intelligence to help you complete applications faster, provide recommendations, and improve your chances of success."
    },
    {
      id: 2,
      question: "How do I get started with AutoGrant?",
      answer: "Simply sign up for a free account, fill in your profile information, and AutoGrant will start matching you with relevant grant opportunities based on your profile and preferences."
    },
    {
      id: 3,
      question: "Can I track the progress of my grant application?",
      answer: "Yes, AutoGrant provides a comprehensive dashboard that allows you to track all your applications in one place, see their status, and receive notifications about deadlines and updates."
    },
    {
      id: 4,
      question: "How can I access grants on AutoGrant?",
      answer: "After creating an account, you'll have access to our database of grants. You can search, filter, and browse through available opportunities based on your eligibility and interests."
    },
    {
      id: 5,
      question: "Does AutoGrant AI help me apply better?",
      answer: "Absolutely! Our AI reviews your applications before submission, provides suggestions for improvement, helps you with completing forms, and even assists with writing compelling responses to increase your chances of success."
    }
  ];
  
  const toggleItem = (id: number) => {
    setOpenItem(openItem === id ? null : id);
  };
  
  return (
    <div id='faqs' className="py-16 px-4 bg-white">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-4xl font-bold text-black text-center mb-16">
          Frequently asked questions
        </h2>
        
        <div className="border border-gray-200 rounded-2xl overflow-hidden">
          {faqs.map((faq, index) => (
            <div 
              key={faq.id} 
              className={`border-b border-gray-200 ${index === faqs.length - 1 ? 'border-b-0' : ''}`}
            >
              <button
                className="flex justify-between items-center w-full text-left py-6 px-8 focus:outline-none"
                onClick={() => toggleItem(faq.id)}
              >
                <span className="text-lg font-medium text-gray-900">{faq.question}</span>
                <span className="ml-6 flex-shrink-0">
                  <svg 
                    className="h-6 w-6 text-gray-900" 
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor" 
                    strokeWidth={2}
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      d={openItem === faq.id ? "M19 9l-7 7-7-7" : "M12 6v6m0 0v6m0-6h6m-6 0H6"}
                    />
                  </svg>
                </span>
              </button>
              {openItem === faq.id && (
                <div className="px-8 pb-6">
                  <p className="text-gray-600">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQ;