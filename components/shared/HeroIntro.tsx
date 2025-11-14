'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { lookupZip } from '@/lib/mockData';
import { ChevronDown } from 'lucide-react';

interface HeroIntroProps {
  onLearnMore?: () => void;
  className?: string;
}

export function HeroIntro({ onLearnMore, className = '' }: HeroIntroProps) {
  const router = useRouter();
  const [zipCode, setZipCode] = useState('');
  const [zipError, setZipError] = useState('');

  const handleZipSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!zipCode.trim()) {
      setZipError('Please enter a ZIP code');
      return;
    }

    const result = lookupZip(zipCode);
    if (result) {
      // Navigate to wizard with ZIP pre-filled
      router.push(`/wizard/project?zip=${encodeURIComponent(zipCode)}`);
    } else {
      setZipError('ZIP code not found. Please enter a valid ZIP code.');
    }
  };

  return (
    <section
      className={`relative w-full py-16 md:py-20 lg:py-24 overflow-hidden ${className}`}
      aria-label="Hero section"
      style={{ backgroundColor: 'var(--hero)' }}
    >
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          {/* Heading */}
          <p className="text-lg md:text-xl lg:text-2xl font-semibold uppercase tracking-widest text-white/80 mb-3">
            Life Cycle Cost Estimator for Invertor products
          </p>
          <h1 className="text-base md:text-lg lg:text-xl font-bold text-white mb-4 leading-tight">
            Enter your Zip/Postal code to get started.
          </h1>

          {/* ZIP Input Form */}
          <form
            onSubmit={handleZipSubmit}
            className="max-w-xl mx-auto mb-6"
            role="search"
            aria-label="ZIP code search"
          >
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-center">
              <div className="w-full sm:w-64">
                <input
                  type="text"
                  value={zipCode}
                  onChange={(e) => {
                    setZipCode(e.target.value);
                    setZipError('');
                  }}
                  placeholder="ZIP Code"
                  className="w-full h-12 px-5 rounded-md text-base text-gray-900 placeholder:text-gray-400 bg-white border-2 border-transparent focus:border-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all shadow-sm"
                  aria-label="ZIP Code"
                  aria-describedby={zipError ? 'zip-error' : 'zip-hint'}
                  aria-invalid={zipError ? 'true' : 'false'}
                  maxLength={10}
                />
              </div>
              <button
                type="submit"
                className="w-full sm:w-auto h-12 px-8 text-base font-semibold bg-white text-hero hover:bg-white/95 transition-all rounded-md shadow-sm hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-hero"
                aria-label="Continue to calculator"
              >
                Continue
              </button>
            </div>

            {zipError ? (
              <div
                id="zip-error"
                className="mt-3 text-sm text-white/95 bg-white/15 backdrop-blur-sm rounded-lg px-4 py-3 max-w-xl mx-auto"
                role="alert"
              >
                <p className="font-medium mb-2">{zipError}</p>
                <p className="text-xs text-white/80">
                  Try these examples: <strong>10001</strong> (NYC),{' '}
                  <strong>90210</strong> (LA), <strong>60601</strong> (Chicago),{' '}
                  <strong>33101</strong> (Miami)
                </p>
              </div>
            ) : (
              <div className="mt-3 max-w-xl mx-auto">
                <p
                  id="zip-hint"
                  className="text-sm text-white/80 text-center mb-2"
                  role="status"
                >
                  We&apos;ll use your location to provide accurate climate data
                  for your energy calculations
                </p>
                <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-white/70">
                  <span>Try:</span>
                  <button
                    type="button"
                    onClick={() => {
                      setZipCode('10001');
                      setZipError('');
                    }}
                    className="px-2 py-1 bg-white/10 hover:bg-white/20 rounded transition-colors font-mono"
                  >
                    10001
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setZipCode('90210');
                      setZipError('');
                    }}
                    className="px-2 py-1 bg-white/10 hover:bg-white/20 rounded transition-colors font-mono"
                  >
                    90210
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setZipCode('60601');
                      setZipError('');
                    }}
                    className="px-2 py-1 bg-white/10 hover:bg-white/20 rounded transition-colors font-mono"
                  >
                    60601
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setZipCode('33101');
                      setZipError('');
                    }}
                    className="px-2 py-1 bg-white/10 hover:bg-white/20 rounded transition-colors font-mono"
                  >
                    33101
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setZipCode('75001');
                      setZipError('');
                    }}
                    className="px-2 py-1 bg-white/10 hover:bg-white/20 rounded transition-colors font-mono"
                  >
                    75001
                  </button>
                </div>
              </div>
            )}
          </form>

          {/* Learn More Link (Optional) */}
          {onLearnMore && (
            <div className="flex items-center justify-center gap-8 mt-8">
              <div className="flex items-center gap-2">
                <ChevronDown
                  className="w-4 h-4 text-white/60"
                  aria-hidden="true"
                />
              </div>
              <button
                onClick={onLearnMore}
                className="text-sm font-medium text-white/90 hover:text-white transition-colors underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-hero rounded-sm px-2 py-1"
                aria-label="Learn more about inverters"
              >
                Or learn a little more about inverters.
              </button>
              <div className="flex items-center gap-2">
                <ChevronDown
                  className="w-4 h-4 text-white/60"
                  aria-hidden="true"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
