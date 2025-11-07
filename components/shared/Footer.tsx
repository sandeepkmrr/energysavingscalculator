import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t bg-daikin-gray-50 mt-auto" role="contentinfo">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-daikin-gray-500">
            © {new Date().getFullYear()} Daikin North America. All rights
            reserved.
          </p>
          <nav className="flex flex-wrap gap-4" aria-label="Footer navigation">
            <Link
              href="/privacy"
              className="text-sm text-daikin-gray-500 hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-md px-2 py-1"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-sm text-daikin-gray-500 hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-md px-2 py-1"
            >
              Terms of Service
            </Link>
            <Link
              href="/legal"
              className="text-sm text-daikin-gray-500 hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-md px-2 py-1"
            >
              Legal
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
