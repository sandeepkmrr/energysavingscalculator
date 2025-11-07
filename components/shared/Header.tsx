import Link from 'next/link';

export function Header() {
  return (
    <header className="border-b bg-white" role="banner">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link
              href="/"
              className="text-headline text-primary font-bold"
              aria-label="Daikin North America Home"
            >
              Daikin
            </Link>
          </div>
          <nav className="flex items-center" aria-label="Main navigation">
            <Link
              href="/contact"
              className="text-body text-daikin-gray-500 hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-md px-3 py-2"
            >
              Contact
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
