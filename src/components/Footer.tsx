import Link from 'next/link'
import { Leaf, Mail, Phone, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <>
      <footer className="text-gray-600 body-font bg-gray-50 border-t border-gray-200">
        <div className="container px-5 py-16 mx-auto">
          <div className="flex flex-wrap md:text-left text-center order-first">
            <div className="lg:w-1/4 md:w-1/2 w-full px-4">
              <div className="flex items-center justify-center md:justify-start mb-4">
                <Leaf className="h-8 w-8 text-green-600 mr-2" />
                <span className="text-xl font-bold text-green-700">CarbonKrishi</span>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                Empowering Indian farmers to earn extra income through sustainable farming practices 
                and verified carbon credits. Building a greener future together.
              </p>
            </div>
            
            <div className="lg:w-1/4 md:w-1/2 w-full px-4">
              <h2 className="title-font font-medium text-gray-900 tracking-widest text-sm mb-3">
                FOR FARMERS
              </h2>
              <nav className="list-none mb-10">
                <li><Link href="/dashboard" className="text-gray-600 hover:text-green-600">Dashboard</Link></li>
                <li><Link href="/signup" className="text-gray-600 hover:text-green-600">Register</Link></li>
                <li><Link href="#" className="text-gray-600 hover:text-green-600">Track Credits</Link></li>
                <li><Link href="#" className="text-gray-600 hover:text-green-600">Verification</Link></li>
              </nav>
            </div>
            
            <div className="lg:w-1/4 md:w-1/2 w-full px-4">
              <h2 className="title-font font-medium text-gray-900 tracking-widest text-sm mb-3">
                FOR COMPANIES
              </h2>
              <nav className="list-none mb-10">
                <li><Link href="/marketplace" className="text-gray-600 hover:text-green-600">Marketplace</Link></li>
                <li><Link href="/signup" className="text-gray-600 hover:text-green-600">Register</Link></li>
                <li><Link href="#" className="text-gray-600 hover:text-green-600">Buy Credits</Link></li>
                <li><Link href="#" className="text-gray-600 hover:text-green-600">ESG Reports</Link></li>
              </nav>
            </div>
            
            <div className="lg:w-1/4 md:w-1/2 w-full px-4">
              <h2 className="title-font font-medium text-gray-900 tracking-widest text-sm mb-3">
                CONTACT
              </h2>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center justify-center md:justify-start">
                  <Mail className="h-4 w-4 mr-2" />
                  <span>support@carbonkrishi.in</span>
                </div>
                <div className="flex items-center justify-center md:justify-start">
                  <Phone className="h-4 w-4 mr-2" />
                  <span>+91 98765 43210</span>
                </div>
                <div className="flex items-center justify-center md:justify-start">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span>New Delhi, India</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-100">
          <div className="container mx-auto py-4 px-5 flex flex-wrap flex-col sm:flex-row">
            <p className="text-gray-500 text-sm text-center sm:text-left">
              © 2024 CarbonKrishi — 
              <span className="text-gray-600 ml-1">
                Powered by sustainable agriculture and blockchain technology
              </span>
            </p>
            <span className="inline-flex sm:ml-auto sm:mt-0 mt-2 justify-center sm:justify-start">
              <Link href="#" className="text-gray-500 hover:text-green-600">
                <svg
                  fill="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                >
                  <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path>
                </svg>
              </Link>
              <Link href="#" className="ml-3 text-gray-500 hover:text-green-600">
                <svg
                  fill="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                >
                  <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path>
                </svg>
              </Link>
              <Link href="#" className="ml-3 text-gray-500 hover:text-green-600">
                <svg
                  fill="none"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                >
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01"></path>
                </svg>
              </Link>
              <Link href="#" className="ml-3 text-gray-500 hover:text-green-600">
                <svg
                  fill="currentColor"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="0"
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="none"
                    d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"
                  ></path>
                  <circle cx="4" cy="4" r="2" stroke="none"></circle>
                </svg>
              </Link>
            </span>
          </div>
        </div>
      </footer>
    </>
  );
}
