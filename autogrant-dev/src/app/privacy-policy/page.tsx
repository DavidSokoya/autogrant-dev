import Footer from '@/components/Footer';
import Header from '@/components/Header';
import React from 'react';

const PrivacyPolicy = () => (
  <div className="min-h-screen bg-gray-50">
        <Header />
    <div className="bg-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
          <p className="text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Information We Collect</h2>
            <div className="text-gray-700 space-y-4">
              <h3 className="text-xl font-medium">Personal Information</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Name, email address, and contact information</li>
                <li>Professional background and organization details</li>
                <li>Payment information (processed securely through third-party providers)</li>
              </ul>
              
              <h3 className="text-xl font-medium">Usage Information</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Grant application data and content you create</li>
                <li>Service usage patterns and preferences</li>
                <li>Technical information about your device and browser</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. How We Use Your Information</h2>
            <div className="text-gray-700">
              <ul className="list-disc pl-6 space-y-2">
                <li>To provide and improve our AI-powered grant writing services</li>
                <li>To process payments and manage your account</li>
                <li>To communicate with you about your account and our services</li>
                <li>To comply with legal obligations under Nigerian data protection laws</li>
                <li>To enhance our AI models and service quality (with anonymized data)</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Data Protection and Security</h2>
            <p className="text-gray-700 mb-4">
              We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, 
              alteration, disclosure, or destruction. Your data is stored securely and encrypted both in transit and at rest.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Data Sharing and Disclosure</h2>
            <p className="text-gray-700 mb-4">
              We do not sell, trade, or rent your personal information to third parties. We may share your information only in the 
              following circumstances:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>With your explicit consent</li>
              <li>To comply with legal obligations or court orders</li>
              <li>With service providers who assist in our operations (under strict confidentiality agreements)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Your Rights</h2>
            <p className="text-gray-700 mb-4">Under Nigerian data protection laws, you have the right to:</p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Access your personal data</li>
              <li>Correct inaccurate or incomplete data</li>
              <li>Request deletion of your data</li>
              <li>Object to processing of your data</li>
              <li>Data portability</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Contact Us</h2>
            <p className="text-gray-700">
              For privacy-related questions or to exercise your rights, contact us at: 
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

export default PrivacyPolicy;