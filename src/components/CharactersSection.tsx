import React from 'react'

const CharactersSection: React.FC = () => {
  const bestsellers = [
    {
      name: 'Nike Air Jordan 1 Retro High',
      price: '฿5,990',
      originalPrice: '฿6,990',
      description: 'รองเท้าสนีกเกอร์คลาสสิกที่ไม่มีวันตกเทรนด์ ดีไザน์ไอคอนิคจาก Michael Jordan พร้อมคุณภาพหนังแท้และความสบายระดับพรีเมียม',
      image: '/images/photobanner01.png',
      badge: 'BESTSELLER'
    },
    {
      name: 'Adidas Ultraboost 22',
      price: '฿6,500',
      originalPrice: '฿7,500',
      description: 'เทคโนโลยี Boost ที่ให้การรองรับและการคืนพลังงานที่เป็นเลิศ เหมาะสำหรับการวิ่งและใส่ประจำวัน พร้อมดีไซน์ที่ทันสมัย',
      image: '/images/photobanner02.png',
      badge: 'LIMITED'
    },
    {
      name: 'New Balance 550 White Grey',
      price: '฿4,290',
      originalPrice: '฿4,990',
      description: 'รองเท้าบาสเก็ตบอลคลาสสิกจากยุค 80s กลับมาในรูปแบบใหม่ ด้วยวัสดุหนังแท้และดีไซน์มินิมอลที่เข้ากับทุกสไตล์',
      image: '/images/photobanner03.png',
      badge: 'HOT'
    }
  ]

  return (
    <section id="bestseller" className="py-20 bg-section-pattern bg-cover bg-center bg-fixed relative">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/80"></div>
      
      <div className="relative z-10 container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section Title */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-graffiti text-anime-orange mb-4">
              BESTSELLER
            </h2>
            <div className="w-24 h-1 bg-anime-gold mx-auto"></div>
            <p className="text-gray-300 mt-6 text-lg">
              รองเท้าขายดีอันดับ 1 ของเรา
            </p>
          </div>

          {/* Product Cards Grid */}
          <div className="grid md:grid-cols-3 gap-8">
            {bestsellers.map((product) => (
              <div 
                key={product.name}
                className="group relative h-96"
              >
                {/* Front Side - Always Visible */}
                <div className="absolute inset-0 bg-black/60 rounded-lg overflow-hidden border border-anime-orange/30 transition-all duration-500 group-hover:opacity-0 group-hover:scale-95">
                  {/* Product Badge */}
                  <div className="absolute top-4 left-4 z-10">
                    <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                      product.badge === 'BESTSELLER' ? 'bg-red-500 text-white' :
                      product.badge === 'LIMITED' ? 'bg-purple-500 text-white' :
                      'bg-yellow-500 text-black'
                    }`}>
                      {product.badge}
                    </span>
                  </div>

                  {/* Product Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                  </div>

                  {/* Product Info */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-anime-gold mb-2">
                      {product.name}
                    </h3>
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-2xl font-bold text-anime-orange">{product.price}</span>
                      <span className="text-sm text-gray-400 line-through">{product.originalPrice}</span>
                    </div>
                    <div className="text-xs text-gray-300">
                      hover เพื่อดูรายละเอียด
                    </div>
                  </div>
                </div>

                {/* Back Side - Show on Hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-anime-orange/90 to-anime-gold/90 rounded-lg p-6 flex flex-col justify-between border border-anime-orange opacity-0 scale-105 transition-all duration-500 group-hover:opacity-100 group-hover:scale-100">
                  <div>
                    <h3 className="text-xl font-bold text-black mb-4">
                      {product.name}
                    </h3>
                    <p className="text-black/80 text-sm leading-relaxed mb-4">
                      {product.description}
                    </p>
                    <div className="flex items-center space-x-2 mb-4">
                      <span className="text-2xl font-bold text-black">{product.price}</span>
                      <span className="text-sm text-black/60 line-through">{product.originalPrice}</span>
                    </div>
                  </div>
                  
                  <button className="w-full bg-black hover:bg-gray-800 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105">
                    รายละเอียด
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Call to Action */}
          <div className="text-center mt-16">
            <button className="bg-gradient-to-r from-anime-orange to-anime-red hover:from-orange-600 hover:to-red-700 text-white font-bold py-4 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg">
              VIEW ALL CHARACTERS
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CharactersSection