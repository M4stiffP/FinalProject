import React from 'react'

const BrandStickers: React.FC = () => {
  const brandStickers = [
    { name: 'Nike', image: '/images/nike.png', rotation: 'rotate-12', position: 'top-20 left-10' },
    { name: 'Adidas', image: '/images/adidas.png', rotation: '-rotate-6', position: 'top-32 right-16' },
    { name: 'Fila', image: '/images/fila.png', rotation: 'rotate-45', position: 'top-60 left-1/4' },
    { name: 'NewBalance', image: '/images/newbalance.png', rotation: '-rotate-12', position: 'bottom-40 right-20' },
    { name: 'Puma', image: '/images/puma.png', rotation: 'rotate-6', position: 'bottom-20 left-20' },
    { name: 'Hoka', image: '/images/hoka.png', rotation: '-rotate-45', position: 'top-40 right-1/3' },
    { name: 'Reebok', image: '/images/reebok.png', rotation: 'rotate-12', position: 'bottom-60 left-1/3' }
  ]

  return (
    <>
      {/* Fixed position stickers scattered around the page */}
      {brandStickers.map((sticker, index) => (
        <div
          key={sticker.name}
          className={`fixed ${sticker.position} z-10 transform ${sticker.rotation} transition-all duration-500 hover:scale-110 hover:rotate-0 opacity-80 hover:opacity-100`}
          style={{
            animationDelay: `${index * 0.2}s`
          }}
        >
          <img
            src={sticker.image}
            alt={sticker.name}
            className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 object-contain drop-shadow-lg"
            style={{
              filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))'
            }}
          />
        </div>
      ))}

      {/* Floating stickers animation */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-5 overflow-hidden">
        {/* Animated floating Nike */}
        <div className="absolute animate-bounce" style={{ 
          top: '10%', 
          left: '5%',
          animationDuration: '3s',
          animationDelay: '0s'
        }}>
          <img src="/images/nike.png" alt="Nike Float" className="w-12 h-12 opacity-60 rotate-12" />
        </div>

        {/* Animated floating Adidas */}
        <div className="absolute animate-pulse" style={{ 
          top: '70%', 
          right: '10%',
          animationDuration: '2s',
          animationDelay: '1s'
        }}>
          <img src="/images/adidas.png" alt="Adidas Float" className="w-10 h-10 opacity-50 -rotate-6" />
        </div>

        {/* Animated floating Puma */}
        <div className="absolute animate-ping" style={{ 
          top: '40%', 
          left: '80%',
          animationDuration: '4s',
          animationDelay: '2s'
        }}>
          <img src="/images/puma.png" alt="Puma Float" className="w-8 h-8 opacity-40 rotate-45" />
        </div>
      </div>
    </>
  )
}

export default BrandStickers