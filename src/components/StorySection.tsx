import React from 'react'

const StorySection: React.FC = () => {
  return (
    <section 
      id="story" 
      className="py-20 relative overflow-hidden"
      style={{
        backgroundImage: 'url(/images/background02.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Dark Overlay for Better Text Readability */}
      <div className="absolute inset-0 bg-black/70"></div>
      {/* Background Effects - Reduced opacity since we have image background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-32 h-32 bg-anime-orange rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-48 h-48 bg-anime-gold rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section Title */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-graffiti text-anime-orange mb-4">
              OUR COLLECTIONS
            </h2>
            <div className="w-24 h-1 bg-anime-gold mx-auto"></div>
            <p className="text-gray-300 mt-6 text-lg">
              Discover the finest sneaker collections curated for you
            </p>
          </div>

          {/* Collections Timeline */}
          <div className="space-y-16">
            {/* Collection 1 */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1">
                <div className="bg-gradient-to-r from-anime-orange/10 to-transparent p-8 rounded-lg border-l-4 border-anime-orange">
                  <h3 className="text-3xl font-graffiti text-anime-gold mb-4">STREET CLASSICS</h3>
                  <p className="text-gray-300 leading-relaxed mb-6">
                    Our foundation collection featuring timeless designs that never go out of style. 
                    From classic Chuck Taylor All-Stars to iconic Air Force 1s, these are the shoes 
                    that built sneaker culture and continue to define street fashion today.
                  </p>
                  <div className="flex items-center text-anime-orange font-semibold">
                    <span className="w-8 h-px bg-anime-orange mr-4"></span>
                    Classic • Timeless • Essential
                  </div>
                </div>
              </div>
              <div className="order-1 md:order-2">
                <img 
                  src="/images/photobanner01.png" 
                  alt="Street Classics Collection" 
                  className="w-full h-64 object-cover rounded-lg shadow-2xl border border-anime-orange/30"
                />
              </div>
            </div>

            {/* Collection 2 */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <img 
                  src="/images/photobanner02.png" 
                  alt="Limited Drops Collection" 
                  className="w-full h-64 object-cover rounded-lg shadow-2xl border border-anime-gold/30"
                />
              </div>
              <div>
                <div className="bg-gradient-to-l from-anime-gold/10 to-transparent p-8 rounded-lg border-r-4 border-anime-gold">
                  <h3 className="text-3xl font-graffiti text-anime-orange mb-4">LIMITED DROPS</h3>
                  <p className="text-gray-300 leading-relaxed mb-6">
                    Exclusive releases and limited edition collaborations that drop without warning. 
                    These rare gems are for the true collectors who understand that some shoes are 
                    more than footwear - they're pieces of art and culture history.
                  </p>
                  <div className="flex items-center text-anime-gold font-semibold">
                    <span className="w-8 h-px bg-anime-gold mr-4"></span>
                    Exclusive • Rare • Collectible
                  </div>
                </div>
              </div>
            </div>

            {/* Collection 3 */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1">
                <div className="bg-gradient-to-r from-anime-red/10 to-transparent p-8 rounded-lg border-l-4 border-anime-red">
                  <h3 className="text-3xl font-graffiti text-anime-gold mb-4">PERFORMANCE ELITE</h3>
                  <p className="text-gray-300 leading-relaxed mb-6">
                    High-performance athletic footwear designed for champions. Whether you're hitting 
                    the court, track, or gym, our elite performance collection features cutting-edge 
                    technology and materials to elevate your game to the next level.
                  </p>
                  <div className="flex items-center text-anime-red font-semibold">
                    <span className="w-8 h-px bg-anime-red mr-4"></span>
                    Athletic • Innovation • Performance
                  </div>
                </div>
              </div>
              <div className="order-1 md:order-2">
                <img 
                  src="/images/photobanner03.png" 
                  alt="Performance Elite Collection" 
                  className="w-full h-64 object-cover rounded-lg shadow-2xl border border-anime-red/30"
                />
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

export default StorySection