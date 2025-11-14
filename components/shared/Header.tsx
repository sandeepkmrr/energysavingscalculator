import Link from 'next/link';
import Image from 'next/image';
import { Search, Phone } from 'lucide-react';

interface HeaderProps {
  variant?: 'default' | 'thin';
  className?: string;
}

export function Header({ variant = 'default', className = '' }: HeaderProps) {
  const isFullHeader = variant === 'default';

  if (variant === 'thin') {
    // Simplified thin header for wizard pages
    return (
      <header
        className={`border-b border-daikin-gray-100 bg-white ${className}`}
        role="banner"
      >
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex h-[56px] items-center justify-between">
            <Link
              href="/"
              className="flex items-center hover:opacity-80 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta focus-visible:ring-offset-2 rounded-md px-2 py-1"
              aria-label="Daikin Energy Calculator Home"
            >
              <Image
                src="https://d1rpi6kt0akbt7.cloudfront.net/images/default-source/base-template/daikin-logo1cb9e8fc-13f4-4a8c-870e-43f101f25b1f.png?sfvrsn=e1e899a6_3"
                alt="Daikin"
                width={120}
                height={32}
                className="object-contain"
                priority
              />
            </Link>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className={`bg-white ${className}`} role="banner">
      {/* Top Utility Bar */}
      <div className="border-b border-daikin-gray-100 bg-daikin-gray-50/30">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex h-12 items-center justify-between text-sm">
            {/* Left side - Contact */}
            <div className="flex items-center gap-6">
              <a
                href="tel:1-866-588-6454"
                className="flex items-center gap-2 text-daikin-gray-600 hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta focus-visible:ring-offset-2 rounded-md px-2 py-1"
                aria-label="Call Daikin"
              >
                <Phone className="w-4 h-4" aria-hidden="true" />
                <span className="hidden sm:inline font-medium">
                  1-866-588-6454
                </span>
              </a>
            </div>

            {/* Right side - Actions */}
            <div className="flex items-center gap-4 md:gap-6">
              <Link
                href="https://www.daikincomfort.com/product-registration"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs md:text-sm font-medium text-daikin-gray-600 hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta focus-visible:ring-offset-2 rounded-md px-2 py-1 uppercase tracking-wide"
              >
                <span className="hidden md:inline">Product Registration</span>
                <span className="md:hidden">Register</span>
              </Link>
              <Link
                href="https://www.daikincomfort.com/warranty"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs md:text-sm font-medium text-daikin-gray-600 hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta focus-visible:ring-offset-2 rounded-md px-2 py-1 uppercase tracking-wide"
              >
                <span className="hidden md:inline">Warranty Lookup</span>
                <span className="md:hidden">Warranty</span>
              </Link>
              <button
                className="p-2 text-daikin-gray-600 hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta focus-visible:ring-offset-2 rounded-md"
                aria-label="Search"
              >
                <Search className="w-4 h-4" aria-hidden="true" />
              </button>
              <Link
                href="https://www.daikincomfort.com/find-a-contractor"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden lg:inline-flex px-5 py-2 bg-cta hover:bg-cta-hover text-white text-sm font-semibold rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta focus-visible:ring-offset-2 uppercase tracking-wide"
              >
                Find a Contractor
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="border-b border-daikin-gray-100">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center hover:opacity-80 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta focus-visible:ring-offset-2 rounded-md px-2 py-1"
              aria-label="Daikin Energy Calculator Home"
            >
              <Image
                src="https://d1rpi6kt0akbt7.cloudfront.net/images/default-source/base-template/daikin-logo1cb9e8fc-13f4-4a8c-870e-43f101f25b1f.png?sfvrsn=e1e899a6_3"
                alt="Daikin"
                width={160}
                height={42}
                className="object-contain"
                priority
              />
            </Link>

            {/* Main Navigation Links */}
            <nav
              className="hidden lg:flex items-center gap-8"
              aria-label="Main navigation"
            >
              <Link
                href="/guide"
                className="text-base font-semibold text-daikin-gray-700 hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta focus-visible:ring-offset-2 rounded-md px-3 py-2"
              >
                Buyer&apos;s Guide
              </Link>
              <Link
                href="/solutions"
                className="text-base font-semibold text-daikin-gray-700 hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta focus-visible:ring-offset-2 rounded-md px-3 py-2"
              >
                Home Solutions
              </Link>
              <Link
                href="/products"
                className="text-base font-semibold text-daikin-gray-700 hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta focus-visible:ring-offset-2 rounded-md px-3 py-2"
              >
                Products
              </Link>
              <Link
                href="/system"
                className="text-base font-semibold text-daikin-gray-700 hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta focus-visible:ring-offset-2 rounded-md px-3 py-2"
              >
                My Daikin System
              </Link>
              <Link
                href="/about"
                className="text-base font-semibold text-daikin-gray-700 hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta focus-visible:ring-offset-2 rounded-md px-3 py-2"
              >
                About Daikin
              </Link>
            </nav>

            {/* Right side - User Type Toggle */}
            <div className="hidden xl:flex items-center gap-3">
              <span className="text-xs font-semibold text-daikin-gray-500 uppercase tracking-wider">
                Professionals
              </span>
              <button
                className="relative inline-flex h-6 w-11 items-center rounded-full bg-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta focus-visible:ring-offset-2"
                role="switch"
                aria-checked="true"
                aria-label="Switch between Professionals and Homeowners view"
              >
                <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6" />
              </button>
              <span className="text-xs font-semibold text-daikin-gray-900 uppercase tracking-wider">
                Homeowners
              </span>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 text-daikin-gray-600 hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta focus-visible:ring-offset-2 rounded-md"
              aria-label="Open menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
