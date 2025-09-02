import Link from 'next/link'

export default function Header() {
  return (
    <>
      <header className="text-gray-600 body-font border-b border-gray-200">
        <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
          <Link href="/" className="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              className="w-10 h-10 text-white p-2 bg-green-600 rounded-full"
              viewBox="0 0 24 24"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
            <span className="ml-3 text-xl font-bold text-green-700">CarbonKrishi</span>
          </Link>
          <nav className="md:ml-auto flex flex-wrap items-center text-base justify-center">
            <Link href="/" className="mr-5 hover:text-green-600 transition-colors">Home</Link>
            <Link href="/dashboard" className="mr-5 hover:text-green-600 transition-colors">Dashboard</Link>
            <Link href="/marketplace" className="mr-5 hover:text-green-600 transition-colors">Marketplace</Link>
            <Link href="/about" className="mr-5 hover:text-green-600 transition-colors">About</Link>
          </nav>
          <div className="flex items-center space-x-3">
            <Link href="/login">
              <button className="inline-flex items-center bg-gray-100 border-0 py-2 px-4 focus:outline-none hover:bg-gray-200 rounded text-base transition-colors">
                Login
              </button>
            </Link>
            <Link href="/signup">
              <button className="inline-flex items-center bg-green-600 text-white border-0 py-2 px-4 focus:outline-none hover:bg-green-700 rounded text-base transition-colors">
                Register
                <svg
                  fill="none"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  className="w-4 h-4 ml-1"
                  viewBox="0 0 24 24"
                >
                  <path d="M5 12h14M12 5l7 7-7 7"></path>
                </svg>
              </button>
            </Link>
          </div>
        </div>
      </header>
    </>
  );
}
