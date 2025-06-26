
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import React from 'react';

const TermsOfService = () => (
  <div className="min-h-screen bg-gray-50">
    <Header />
    <div className="bg-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
          <p className="text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-700 mb-4">
              By accessing and using AutoGrant ("Service"), you accept and agree to be bound by the terms and provision of this agreement. 
              AutoGrant is operated by AutoGrant Nigeria Limited, a company incorporated under the laws of the Federal Republic of Nigeria.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Description of Service</h2>
            <p className="text-gray-700 mb-4">
              AutoGrant is an AI-powered platform that assists users in creating and managing grant applications. The Service includes 
              automated grant writing tools, application tracking, and related features designed to streamline the grant application process.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. User Responsibilities</h2>
            <div className="text-gray-700 space-y-4">
              <p>You agree to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide accurate and complete information when using the Service</li>
                <li>Maintain the security of your account credentials</li>
                <li>Use the Service in compliance with all applicable Nigerian laws and regulations</li>
                <li>Not use the Service for any unlawful or prohibited activities</li>
                <li>Verify all generated content before submission to grant providers</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Intellectual Property</h2>
            <p className="text-gray-700 mb-4">
              The Service and its original content, features, and functionality are owned by AutoGrant Nigeria Limited and are protected 
              by Nigerian and international copyright, trademark, and other intellectual property laws.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Limitation of Liability</h2>
            <p className="text-gray-700 mb-4">
              AutoGrant provides AI-generated assistance and recommendations. Users are solely responsible for reviewing, verifying, 
              and ensuring the accuracy of all grant applications before submission. We shall not be liable for any direct, indirect, 
              incidental, or consequential damages arising from the use of our Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Governing Law</h2>
            <p className="text-gray-700 mb-4">
              These Terms shall be governed by and construed in accordance with the laws of the Federal Republic of Nigeria. 
              Any disputes arising under these terms shall be subject to the exclusive jurisdiction of Nigerian courts.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Contact Information</h2>
            <p className="text-gray-700">
              For questions about these Terms of Service, please contact us at: 
              <a href="mailto:info@autogrant.ng" className="text-emerald-600 hover:text-emerald-700 ml-1">
                info@autogrant.ng
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>

    {/* Footer */}
  <Footer/>

  </div>
);

export default TermsOfService;