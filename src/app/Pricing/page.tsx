'use client'

import React from 'react';
import { useRouter } from 'next/navigation';
import Background from '@/components/styles/Background';
import Button from '@/components/styles/Button';
import Sidebar from '@/components/sidebar/page';

const Pricing: React.FC = () => {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push('/dashboard');
  };

  const plans = [
    {
    name: 'Starter',
      price: '$29',
      billing: 'per month',
      description: 'Perfect for small businesses just getting started',
      credits: '1,000 API calls',
      features: [
        '1,000 API calls included',
        'Basic voice recognition',
        'Email support',
        'Basic analytics',
        'Up to 2 team members',
      ],
      highlighted: false
    },
    {
      name: 'Professional',
    price: '$99',
      billing: 'per month',
      description: 'Ideal for growing businesses',
      credits: '5,000 API calls',
      features: [
        '5,000 API calls included',
        'Advanced voice recognition',
        'Priority email & chat support',
        'Advanced analytics',
        'Up to 10 team members',
        'Custom voice models',
        'Webhooks integration'
      ],
      highlighted: true
    },
    {
      name: 'Enterprise',
    price: '$299',
      billing: 'per month',
      description: 'For large-scale operations',
      credits: '20,000 API calls',
      features: [
        '20,000 API calls included',
        'Enterprise voice recognition',
        '24/7 priority support',
        'Enterprise analytics',
        'Unlimited team members',
        'Custom voice models',
        'Webhooks integration',
        'SLA guarantee',
        'Dedicated account manager'
      ],
      highlighted: false
    }
  ];

  return (
    <Background variant="gradient">
      <Sidebar />
      <div className="min-h-screen text-white pt-12">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <header className="text-center mb-16">
            <h1 className="text-4xl font-orbitron mb-4 bg-gradient-to-r from-secondary-cyan to-accent-gold text-transparent bg-clip-text">
              Simple, Transparent Pricing
            </h1>
            <p className="text-xl text-gray-300 font-space max-w-2xl mx-auto">
              Choose the plan that best fits your needs. All plans include our core features with varying usage limits.
            </p>
          </header>

          {/* Pricing Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {/* Starter Plan */}
            <div className="border border-[#BAFFF5]/20 rounded-xl p-8 transition-all hover:border-[#BAFFF5]/40 hover:shadow-lg">
              <div className="mb-8">
                <h2 className="text-2xl font-poppins mb-2">Starter</h2>
                <p className="text-gray-400 font-space mb-4">Perfect for small businesses</p>
                <div className="flex items-end mb-4">
                  <span className="text-4xl font-orbitron">$29</span>
                  <span className="text-gray-400 font-space ml-2">/month</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8 font-space">
                <li className="flex items-center">
                  <span className="text-accent-green mr-2">✓</span>
                  1,000 API calls/month
                </li>
                {plans[0].features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <span className="text-accent-green mr-2">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>

              <Button 
                variant="secondary"
                size="lg"
                onClick={handleGetStarted}
                className="w-full"
              >
                Get Started
              </Button>
            </div>

            {/* Professional Plan */}
            <div className="border-2 border-accent-gold rounded-xl p-8 transition-all hover:shadow-lg hover:shadow-accent-gold/20 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-accent-gold text-dark px-4 py-1 rounded-full text-sm font-space">
                  Most Popular
                </span>
              </div>

              <div className="mb-8">
                <h2 className="text-2xl font-poppins mb-2">Professional</h2>
                <p className="text-gray-400 font-space mb-4">For growing teams</p>
                <div className="flex items-end mb-4">
                  <span className="text-4xl font-orbitron">$99</span>
                  <span className="text-gray-400 font-space ml-2">/month</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8 font-space">
                <li className="flex items-center">
                  <span className="text-accent-green mr-2">✓</span>
                  5,000 API calls/month
                </li>
                {plans[1].features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <span className="text-accent-green mr-2">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>

              <Button 
                variant="primary"
                size="lg"
                onClick={handleGetStarted}
                className="w-full"
              >
                Get Started
              </Button>
            </div>

            {/* Enterprise Plan */}
            <div className="border border-[#BAFFF5]/20 rounded-xl p-8 transition-all hover:border-[#BAFFF5]/40 hover:shadow-lg">
              <div className="mb-8">
                <h2 className="text-2xl font-poppins mb-2">Enterprise</h2>
                <p className="text-gray-400 font-space mb-4">For large organizations</p>
                <div className="flex items-end mb-4">
                  <span className="text-4xl font-orbitron">Custom</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8 font-space">
                <li className="flex items-center">
                  <span className="text-accent-green mr-2">✓</span>
                  Unlimited API calls
                </li>
                {plans[2].features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <span className="text-accent-green mr-2">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>

              <Button 
                variant="secondary"
                size="lg"
                onClick={handleGetStarted}
                className="w-full"
              >
                Contact Sales
              </Button>
            </div>
          </div>

          {/* Feature Comparison */}
          <div className="max-w-7xl mx-auto px-4 pb-24">
            <h2 className="text-3xl font-bold text-center mb-12">Compare Plans</h2>
            <div className="border border-[#BAFFF5]/20 rounded-2xl overflow-hidden hover:border-[#BAFFF5]/40 transition-all">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="py-4 px-6 text-left">Features</th>
                    <th className="py-4 px-6 text-center">Starter</th>
                    <th className="py-4 px-6 text-center">Professional</th>
                    <th className="py-4 px-6 text-center">Enterprise</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-700">
                    <td className="py-4 px-6">Monthly API Calls</td>
                    <td className="py-4 px-6 text-center">1,000</td>
                    <td className="py-4 px-6 text-center">5,000</td>
                    <td className="py-4 px-6 text-center">20,000</td>
                  </tr>
                  <tr className="border-b border-gray-700">
                    <td className="py-4 px-6">Voice Recognition Quality</td>
                    <td className="py-4 px-6 text-center">Basic</td>
                    <td className="py-4 px-6 text-center">Advanced</td>
                    <td className="py-4 px-6 text-center">Enterprise</td>
                  </tr>
                  <tr className="border-b border-gray-700">
                    <td className="py-4 px-6">Support Level</td>
                    <td className="py-4 px-6 text-center">Email</td>
                    <td className="py-4 px-6 text-center">Priority Email & Chat</td>
                    <td className="py-4 px-6 text-center">24/7 Priority</td>
                  </tr>
                  <tr className="border-b border-gray-700">
                    <td className="py-4 px-6">Team Members</td>
                    <td className="py-4 px-6 text-center">2</td>
                    <td className="py-4 px-6 text-center">10</td>
                    <td className="py-4 px-6 text-center">Unlimited</td>
                  </tr>
                  <tr className="border-b border-gray-700">
                    <td className="py-4 px-6">Custom Voice Models</td>
                    <td className="py-4 px-6 text-center">
                      <svg className="w-5 h-5 text-red-500 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
                      </svg>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <svg className="w-5 h-5 text-green-400 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                      </svg>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <svg className="w-5 h-5 text-green-400 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                      </svg>
                    </td>
                  </tr>
                  <tr className="border-b border-gray-700">
                    <td className="py-4 px-6">Analytics</td>
                    <td className="py-4 px-6 text-center">Basic</td>
                    <td className="py-4 px-6 text-center">Advanced</td>
                    <td className="py-4 px-6 text-center">Enterprise</td>
                  </tr>
                  <tr className="border-b border-gray-700">
                    <td className="py-4 px-6">SLA Guarantee</td>
                    <td className="py-4 px-6 text-center">
                      <svg className="w-5 h-5 text-red-500 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
                      </svg>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <svg className="w-5 h-5 text-red-500 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
                      </svg>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <svg className="w-5 h-5 text-green-400 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                      </svg>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* FAQ Section */}
          <section className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-orbitron text-center mb-8">Frequently Asked Questions</h2>
            <div className="space-y-6">
              <div className="border border-[#BAFFF5]/20 rounded-xl p-6 hover:border-[#BAFFF5]/40 transition-all">
                <h3 className="text-xl font-poppins mb-2">What&apos;s included in the API calls?</h3>
                <p className="text-gray-300 font-space">
                  Each API call includes both speech-to-text and text-to-speech conversion, along with AI processing.
                </p>
              </div>
              <div className="border border-[#BAFFF5]/20 rounded-xl p-6 hover:border-[#BAFFF5]/40 transition-all">
                <h3 className="text-xl font-semibold mb-2">What happens when I exceed my API call limit?</h3>
                <p className="text-gray-300">Additional API calls are billed at $0.01 per call. You can also upgrade your plan at any time to get more included calls.</p>
              </div>
              <div className="border border-[#BAFFF5]/20 rounded-xl p-6 hover:border-[#BAFFF5]/40 transition-all">
                <h3 className="text-xl font-semibold mb-2">Can I switch plans later?</h3>
                <p className="text-gray-300">Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.</p>
              </div>
              <div className="border border-[#BAFFF5]/20 rounded-xl p-6 hover:border-[#BAFFF5]/40 transition-all">
                <h3 className="text-xl font-semibold mb-2">Do unused API calls roll over?</h3>
                <p className="text-gray-300">No, API calls reset at the beginning of each billing cycle. We recommend choosing a plan that matches your expected usage.</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </Background>
  );
};

export default Pricing;
