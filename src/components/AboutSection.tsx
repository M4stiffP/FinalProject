import React from 'react'
import { useIntersectionObserver } from '../hooks/useScrollEffects'

const AboutSection: React.FC = () => {
  const { targetRef, hasIntersected } = useIntersectionObserver()

  return (
    <section 
      id="about" 
      ref={targetRef}
      className="py-20 relative"
      style={{
        backgroundImage: 'url(/images/background01.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Dark Overlay for Better Text Readability */}
      <div className="absolute inset-0 bg-black/70"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Section Title */}
          <div className={`text-center mb-16 transition-all duration-1000 ${
            hasIntersected ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-graffiti text-anime-orange mb-4">
              ABOUT URBAN KICKS
            </h2>
            <div className="w-24 h-1 bg-anime-gold mx-auto"></div>
          </div>

          {/* Content Grid */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <div className={`space-y-6 transition-all duration-1000 delay-300 ${
              hasIntersected ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
            }`}>
              <p className="text-base sm:text-lg text-gray-300 leading-relaxed">
                Step into the world of urban fashion with Urban Kicks - your premier destination for 
                the latest and greatest in sneaker culture. From classic retro designs to cutting-edge 
                modern styles, we bring you the most sought-after footwear from around the globe.
              </p>
              <p className="text-base sm:text-lg text-gray-300 leading-relaxed">
                Founded by sneaker enthusiasts for sneaker enthusiasts, Urban Kicks is more than just 
                a store - it's a community. We curate exclusive collections from top brands like Nike, 
                Adidas, Jordan, and many more, ensuring you stay ahead of the style game.
              </p>
              <p className="text-base sm:text-lg text-gray-300 leading-relaxed">
                Whether you're hunting for limited edition releases, classic everyday wear, or 
                performance athletic shoes, Urban Kicks has everything you need to express your 
                unique style and step up your sneaker game.
              </p>
              
              {/* Stats */}
              <div className="grid grid-cols-2 gap-6 mt-8">
                <div className="text-center p-4 bg-black/50 rounded-lg border border-anime-orange/30 transform hover:scale-105 transition-transform duration-300">
                  <div className="text-2xl sm:text-3xl font-bold text-anime-orange">500+</div>
                  <div className="text-xs sm:text-sm text-gray-400">Shoe Models</div>
                </div>
                <div className="text-center p-4 bg-black/50 rounded-lg border border-anime-gold/30 transform hover:scale-105 transition-transform duration-300">
                  <div className="text-2xl sm:text-3xl font-bold text-anime-gold">50+</div>
                  <div className="text-xs sm:text-sm text-gray-400">Premium Brands</div>
                </div>
              </div>
            </div>

            {/* Image */}
            <div className={`relative transition-all duration-1000 delay-500 ${
              hasIntersected ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
            }`}>
              <img 
                src="/images/card.png" 
                alt="Urban Kicks Collection" 
                className="w-full h-auto rounded-lg shadow-2xl border-2 border-anime-orange/30 transform hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-lg"></div>
            </div>
          </div>

          {/* Additional Info */}
          <div className={`mt-16 text-center transition-all duration-1000 delay-700 ${
            hasIntersected ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <div className="bg-gradient-to-r from-anime-orange/10 to-anime-gold/10 p-6 sm:p-8 rounded-lg border border-anime-orange/30">
              <h3 className="text-xl sm:text-2xl font-bold text-anime-gold mb-4">Premium Sneaker Experience</h3>
              <p className="text-sm sm:text-base text-gray-300 max-w-3xl mx-auto">
                At Urban Kicks, we believe every step tells a story. Our carefully curated collection 
                features the most exclusive drops, vintage classics, and everyday essentials. 
                Experience the perfect blend of style, comfort, and authenticity.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AboutSection