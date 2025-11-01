import React, { useState, useEffect } from 'react';

const ImageCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // รายการภาพทั้งหมดจาก images folder
  const images = [
    { src: '/images/background01.png', alt: 'Background 1' },
    { src: '/images/background02.png', alt: 'Background 2' },
    { src: '/images/card.png', alt: 'Character Card' },
    { src: '/images/photobanner01.png', alt: 'Photo Banner 1' },
    { src: '/images/photobanner02.png', alt: 'Photo Banner 2' },
    { src: '/images/photobanner03.png', alt: 'Photo Banner 3' },
  ];

  // Auto slide function
  useEffect(() => {
    if (isAutoPlaying) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => 
          prevIndex === images.length - 1 ? 0 : prevIndex + 1
        );
      }, 3000); // เปลี่ยนภาพทุก 3 วินาที

      return () => clearInterval(interval);
    }
  }, [isAutoPlaying, images.length]);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const toggleAutoPlay = () => {
    setIsAutoPlaying(!isAutoPlaying);
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4">
      {/* Main Container */}
      <div className="relative w-full h-96 overflow-hidden bg-black/30 backdrop-blur-sm rounded-xl border border-red-500/30 shadow-2xl">
        {/* Full Image Display */}
        <div className="relative h-full">
          {images.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-transform duration-500 ease-in-out ${
                index === currentIndex ? 'translate-x-0' : 
                index < currentIndex ? '-translate-x-full' : 'translate-x-full'
              }`}
            >
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-90 cursor-pointer"
                onClick={nextSlide}
              />
            </div>
          ))}
          
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20"></div>
        </div>

        {/* Navigation Controls */}
        <div className="absolute top-1/2 transform -translate-y-1/2 left-6">
          <button
            onClick={prevSlide}
            className="w-12 h-12 bg-red-600/80 hover:bg-red-700 rounded-full flex items-center justify-center text-white font-bold transition-all duration-300 hover:scale-110 text-xl"
          >
            ←
          </button>
        </div>

        <div className="absolute top-1/2 transform -translate-y-1/2 right-6">
          <button
            onClick={nextSlide}
            className="w-12 h-12 bg-red-600/80 hover:bg-red-700 rounded-full flex items-center justify-center text-white font-bold transition-all duration-300 hover:scale-110 text-xl"
          >
            →
          </button>
        </div>

        {/* Auto-play Toggle */}
        <div className="absolute top-4 right-4">
          <button
            onClick={toggleAutoPlay}
            className="w-10 h-10 bg-black/60 hover:bg-black/80 rounded-full flex items-center justify-center text-white font-bold transition-all duration-300 hover:scale-110"
          >
            {isAutoPlaying ? '⏸' : '▶'}
          </button>
        </div>

        {/* X Indicators (instead of dots) */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-3">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-6 h-6 flex items-center justify-center font-bold text-lg transition-all duration-300 ${
                index === currentIndex 
                  ? 'text-red-500 scale-125 rotate-45' 
                  : 'text-white/70 hover:text-white hover:scale-110'
              }`}
            >
              ✕
            </button>
          ))}
        </div>

        {/* Image Counter */}
        <div className="absolute bottom-4 left-4 text-white text-sm bg-black/50 px-3 py-1 rounded-full">
          {currentIndex + 1} / {images.length}
        </div>

        {/* Image Title */}
        <div className="absolute top-4 left-4 text-white text-lg font-bold bg-black/50 px-4 py-2 rounded-lg">
          {images[currentIndex].alt}
        </div>
      </div>
    </div>
  );
};

export default ImageCarousel;