import React from 'react'
import PromotionalBanner from './PromotionalBanner'

const GallerySection: React.FC = () => {
  const galleryImages = [
    { src: '/images/photobanner01.png', title: 'Rudo in Action' },
    { src: '/images/photobanner02.png', title: 'The Slums' },
    { src: '/images/photobanner03.png', title: 'Cleaners Unite' },
    { src: '/images/card.png', title: 'Character Art' },
    { src: '/images/background01.png', title: 'The Abyss' },
    { src: '/images/background02.png', title: 'Trash Beasts' }
  ]

  return (
    <section id="gallery" className="bg-anime-dark">
      {/* Promotional Banner - Full Screen */}
      <PromotionalBanner />
      
      {/* Traditional Gallery Section */}
      <div className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Section Title */}
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-6xl font-graffiti text-anime-orange mb-4">
                GALLERY
              </h2>
              <div className="w-24 h-1 bg-anime-gold mx-auto"></div>
              <p className="text-gray-300 mt-6 text-lg">
                Explore more artwork from Gachiakuta
              </p>
            </div>

            {/* Gallery Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {galleryImages.map((image, index) => (
                <div 
                  key={index}
                  className="group relative overflow-hidden rounded-lg bg-gray-800 aspect-square hover:transform hover:scale-105 transition-all duration-300"
                >
                  <img 
                    src={image.src}
                    alt={image.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-4 left-4">
                      <h3 className="text-white font-bold text-lg">{image.title}</h3>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default GallerySection