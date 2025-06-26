import Footer from '@/components/Footer';
import Header from '@/components/Header';
import React from 'react';

const RefundPolicy = () => (
    <>
  <div className="min-h-screen bg-gray-50">
        <Header />
    <div className="bg-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Refund Policy</h1>
          <p className="text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Refund Eligibility</h2>
            <p className="text-gray-700 mb-4">
              AutoGrant offers refunds under the following conditions, in accordance with Nigerian consumer protection laws:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Technical issues that prevent access to the service for more than 48 hours</li>
              <li>Significant service disruptions not resolved within 72 hours</li>
              <li>Billing errors or unauthorized charges</li>
              <li>Service not delivered as described in our terms</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Refund Timeframe</h2>
            <div className="text-gray-700 space-y-4">
              <p><strong>Request Period:</strong> Refund requests must be submitted within 14 days of the billing date.</p>
              <p><strong>Processing Time:</strong> Approved refunds will be processed within 7-14 business days.</p>
              <p><strong>Payment Method:</strong> Refunds will be issued to the original payment method used for the purchase.</p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Non-Refundable Services</h2>
            <p className="text-gray-700 mb-4">The following services are generally non-refundable:</p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Services that have been fully utilized or consumed</li>
              <li>Custom grant writing services that have been completed and delivered</li>
              <li>Premium features that have been actively used for more than 7 days</li>
              <li>Subscription services after the first billing cycle (unless service failure occurs)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Refund Process</h2>
            <div className="text-gray-700 space-y-4">
              <p>To request a refund:</p>
              <ol className="list-decimal pl-6 space-y-2">
                <li>Contact our support team at info@autogrant.ng</li>
                <li>Provide your account details and reason for the refund request</li>
                <li>Include relevant documentation (screenshots, error messages, etc.)</li>
                <li>Our team will review your request within 3 business days</li>
                <li>You will receive confirmation and timeline for processing</li>
              </ol>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Partial Refunds</h2>
            <p className="text-gray-700 mb-4">
              In some cases, partial refunds may be offered based on the extent of service usage and the specific circumstances 
              of your request. This will be determined on a case-by-case basis.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Dispute Resolution</h2>
            <p className="text-gray-700 mb-4">
              If you disagree with our refund decision, you may escalate the matter through Nigerian consumer protection mechanisms 
              or seek resolution through appropriate legal channels under Nigerian law.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Contact Information</h2>
            <p className="text-gray-700">
              For refund requests or questions about this policy, contact us at: 
              <a href="mailto:info@autogrant.ng" className="text-emerald-600 hover:text-emerald-700 ml-1">
                info@autogrant.ng
              </a>
            </p>
            <p className="text-gray-700 mt-2">
              Please allow up to 24 hours for initial response to your refund inquiry.
            </p>
          </section>
        </div>
      </div>
    </div>


  </div>
  <Footer/>
  </>
);

export default RefundPolicy;