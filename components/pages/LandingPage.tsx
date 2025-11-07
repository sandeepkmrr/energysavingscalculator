'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/shared/Header';
import { SustainabilityBanner, CorporateFooter } from '@/components/shared';
import { PrimaryButton, SecondaryButton } from '@/components/shared';
import { Zap, TrendingUp, Leaf } from 'lucide-react';

export default function LandingPage() {
  const [isVisible, setIsVisible] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const scrollToInfo = () => {
    infoRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const benefits = [
    {
      icon: Zap,
      title: 'Energy Savings',
      description:
        'Calculate precise annual kWh reductions and cost savings with real-time analysis.',
    },
    {
      icon: TrendingUp,
      title: 'Lifecycle ROI',
      description:
        'Compare total cost of ownership including maintenance, rebates, and payback periods.',
    },
    {
      icon: Leaf,
      title: 'Sustainability',
      description:
        'Track CO₂ reduction and environmental impact of your HVAC system upgrades.',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section
          ref={heroRef}
          className="relative w-full py-16 md:py-24 lg:py-32 overflow-hidden"
          aria-label="Hero section"
        >
          <div
            className="absolute inset-0 bg-gradient-to-br from-[#00A0E4] via-[#44C8F5] to-[#0074B4]"
            aria-hidden="true"
          />
          <div className="container mx-auto px-4 relative z-10">
            <div
              className={`max-w-3xl mx-auto text-center transition-opacity duration-1000 ${
                isVisible ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <h1 className="text-headline-lg md:text-5xl lg:text-6xl font-bold text-white mb-6">
                Compare Energy & Lifecycle Costs with Daikin Inverter RTUs
              </h1>
              <p className="text-body md:text-lg text-white/90 mb-8 max-w-2xl mx-auto">
                Quantify energy savings, payback and total cost of
                ownership—instantly.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <PrimaryButton
                  size="lg"
                  className="w-full sm:w-auto min-w-[200px]"
                  asChild
                  aria-label="Start Your Analysis - Navigate to wizard"
                >
                  <Link href="/wizard">Start Your Analysis</Link>
                </PrimaryButton>
                <SecondaryButton
                  size="lg"
                  onClick={scrollToInfo}
                  className="w-full sm:w-auto min-w-[200px] bg-white/10 border-white/30 text-white hover:bg-white/20 hover:text-white"
                  aria-label="Learn More - Scroll to information section"
                >
                  Learn More
                </SecondaryButton>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section
          ref={infoRef}
          className="py-16 md:py-24 bg-white"
          aria-label="Benefits section"
        >
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon;
                return (
                  <div
                    key={benefit.title}
                    className="text-center space-y-4"
                    role="article"
                    aria-labelledby={`benefit-${index}-title`}
                  >
                    <div className="flex justify-center">
                      <div className="p-4 rounded-full bg-daikin-gray-50 text-primary">
                        <Icon
                          className="w-8 h-8"
                          aria-hidden="true"
                          strokeWidth={2}
                        />
                      </div>
                    </div>
                    <h2
                      id={`benefit-${index}-title`}
                      className="text-headline text-primary font-semibold"
                    >
                      {benefit.title}
                    </h2>
                    <p className="text-body text-daikin-gray-500 max-w-sm mx-auto">
                      {benefit.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>
      <SustainabilityBanner />
      <CorporateFooter />
    </div>
  );
}
