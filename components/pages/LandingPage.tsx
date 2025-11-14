'use client';

import { useRef } from 'react';
import { Header, HeroIntro } from '@/components/shared';
import { SustainabilityBanner, CorporateFooter } from '@/components/shared';
import { Zap, TrendingUp, Leaf } from 'lucide-react';

export default function LandingPage() {
  const infoRef = useRef<HTMLDivElement>(null);

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
        <HeroIntro onLearnMore={scrollToInfo} />

        {/* Benefits Section */}
        <section
          ref={infoRef}
          className="py-20 md:py-28 bg-white"
          aria-label="Benefits section"
        >
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-16">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon;
                return (
                  <div
                    key={benefit.title}
                    className="text-center space-y-5"
                    role="article"
                    aria-labelledby={`benefit-${index}-title`}
                  >
                    <div className="flex justify-center">
                      <div className="p-5 rounded-full bg-gradient-to-br from-daikin-gray-50 to-white border-2 border-daikin-gray-100 text-primary shadow-sm">
                        <Icon
                          className="w-10 h-10"
                          aria-hidden="true"
                          strokeWidth={2}
                        />
                      </div>
                    </div>
                    <h2
                      id={`benefit-${index}-title`}
                      className="text-subheading text-primary font-semibold"
                    >
                      {benefit.title}
                    </h2>
                    <p className="text-body text-daikin-gray-500 max-w-sm mx-auto leading-relaxed">
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
