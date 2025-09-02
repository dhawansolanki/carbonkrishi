import Link from 'next/link'

export default function Hero() {
    return (
    <section className="text-gray-600 body-font bg-gradient-to-br from-green-50 to-blue-50">
  <div className="container mx-auto flex px-5 py-24 md:flex-row flex-col items-center">
    <div className="lg:flex-grow md:w-1/2 lg:pr-24 md:pr-16 flex flex-col md:items-start md:text-left mb-16 md:mb-0 items-center text-center">
      <h1 className="title-font sm:text-5xl text-4xl mb-4 font-bold text-gray-900 leading-tight">
        किसानों के लिए 
        <br className="hidden lg:inline-block" />
        <span className="text-green-600">Carbon Credits</span> से 
        <br className="hidden lg:inline-block" />
        अतिरिक्त आमदनी
      </h1>
      <p className="mb-6 leading-relaxed text-lg text-gray-700">
        अपनी sustainable farming practices को carbon credits में बदलें और extra income कमाएं। 
        हमारा platform आपकी eco-friendly खेती को verify करके companies को बेचता है।
      </p>
      <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
          <span>कम रसायन, ज्यादा कमाई</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
          <span>Blockchain verified</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
          <span>Direct UPI payments</span>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-4">
        <Link href="/signup">
          <button className="inline-flex text-white bg-green-600 border-0 py-3 px-8 focus:outline-none hover:bg-green-700 rounded-lg text-lg font-semibold transition-colors shadow-lg">
            किसान Registration
          </button>
        </Link>
        <Link href="/marketplace">
          <button className="inline-flex text-green-700 bg-white border-2 border-green-600 py-3 px-8 focus:outline-none hover:bg-green-50 rounded-lg text-lg font-semibold transition-colors">
            Marketplace देखें
          </button>
        </Link>
      </div>
    </div>
    <div className="lg:max-w-lg lg:w-full md:w-1/2 w-5/6">
      <div className="relative">
        <img 
          className="object-cover object-center rounded-lg shadow-2xl" 
          alt="Indian farmer with sustainable farming" 
          src="https://images.unsplash.com/photo-1574943320219-553eb213f72d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
        />
        <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-lg shadow-lg">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">₹15,000</div>
            <div className="text-sm text-gray-600">Average monthly earnings</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
    )
}