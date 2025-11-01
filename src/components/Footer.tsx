import React from 'react'

const Footer: React.FC = () => {
  return (
    <footer className="bg-black border-t border-anime-orange/30 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Main Footer Content */}
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* Logo Section */}
            <div className="col-span-1">
              <h3 className="text-2xl font-graffiti text-anime-orange mb-4">
                URBAN KICKS
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Step into style with premium sneakers from top brands. Your destination for the latest kicks and streetwear fashion.
              </p>
            </div>

            {/* Navigation Links */}
            <div className="col-span-1">
              <h4 className="text-lg font-semibold text-white mb-4">Navigation</h4>
              <ul className="space-y-2">
                {['Home', 'Shop', 'About', 'Collections', 'Contact'].map((item) => (
                  <li key={item}>
                    <a 
                      href={`#${item.toLowerCase()}`}
                      className="text-gray-400 hover:text-anime-orange transition-colors duration-300"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Store Links */}
            <div className="col-span-1">
              <h4 className="text-lg font-semibold text-white mb-4">Shop</h4>
              <ul className="space-y-2">
                <li>
                  <a 
                    href="#" 
                    className="text-gray-400 hover:text-anime-orange transition-colors duration-300"
                  >
                    Nike Collection
                  </a>
                </li>
                <li>
                  <a 
                    href="#" 
                    className="text-gray-400 hover:text-anime-orange transition-colors duration-300"
                  >
                    Adidas Store
                  </a>
                </li>
                <li>
                  <a 
                    href="#" 
                    className="text-gray-400 hover:text-anime-orange transition-colors duration-300"
                  >
                    New Balance
                  </a>
                </li>
                <li>
                  <a 
                    href="#" 
                    className="text-gray-400 hover:text-anime-orange transition-colors duration-300"
                  >
                    Limited Edition
                  </a>
                </li>
                <li>
                  <a 
                    href="#" 
                    className="text-gray-400 hover:text-anime-orange transition-colors duration-300"
                  >
                    Sale Items
                  </a>
                </li>
              </ul>
            </div>

            {/* Social Media */}
            <div className="col-span-1">
              <h4 className="text-lg font-semibold text-white mb-4">Follow Us</h4>
              <div className="flex space-x-4">
                <a 
                  href="#" 
                  className="w-10 h-10 bg-anime-orange/20 hover:bg-anime-orange rounded-full flex items-center justify-center transition-colors duration-300 group"
                >
                  <span className="text-anime-orange group-hover:text-black font-bold">X</span>
                </a>
                <a 
                  href="#" 
                  className="w-10 h-10 bg-anime-orange/20 hover:bg-anime-orange rounded-full flex items-center justify-center transition-colors duration-300 group"
                >
                  <span className="text-anime-orange group-hover:text-black font-bold">IG</span>
                </a>
                <a 
                  href="#" 
                  className="w-10 h-10 bg-anime-orange/20 hover:bg-anime-orange rounded-full flex items-center justify-center transition-colors duration-300 group"
                >
                  <span className="text-anime-orange group-hover:text-black font-bold">YT</span>
                </a>
                <a 
                  href="#" 
                  className="w-10 h-10 bg-anime-orange/20 hover:bg-anime-orange rounded-full flex items-center justify-center transition-colors duration-300 group"
                >
                  <span className="text-anime-orange group-hover:text-black font-bold">TT</span>
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm mb-4 md:mb-0">
                © 2025 URBAN KICKS. All rights reserved. Premium sneakers & streetwear collection.
              </p>
              <div className="flex space-x-6 text-sm">
                <a href="#" className="text-gray-400 hover:text-anime-orange transition-colors">
                  Shipping Info
                </a>
                <a href="#" className="text-gray-400 hover:text-anime-orange transition-colors">
                  Return Policy
                </a>
                <a href="#" className="text-gray-400 hover:text-anime-orange transition-colors">
                  Size Guide
                </a>
                <a href="#" className="text-gray-400 hover:text-anime-orange transition-colors">
                  Contact Us
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer