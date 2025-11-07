'use client';

import Link from 'next/link';

export function CorporateFooter() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="bg-daikin-gray-50 border-t border-daikin-gray-100 py-4"
      role="contentinfo"
    >
      <div className="container mx-auto px-4 flex flex-col items-center gap-3 text-center text-sm text-daikin-gray-500 md:flex-row md:justify-between md:text-left">
        <p>© {year} Daikin North America. All rights reserved.</p>
        <nav
          className="flex flex-wrap justify-center gap-4"
          aria-label="Corporate footer"
        >
          <Link
            href="/privacy"
            className="hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-md px-2 py-1"
          >
            Privacy
          </Link>
          <Link
            href="/terms"
            className="hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-md px-2 py-1"
          >
            Terms
          </Link>
          <Link
            href="/contact"
            className="hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-md px-2 py-1"
          >
            Contact
          </Link>
        </nav>
      </div>
    </footer>
  );
}

export default CorporateFooter;
