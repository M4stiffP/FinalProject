import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { type RootState } from '../store/store'

const LoadingScreen: React.FC = () => {
  const { isLoading } = useSelector((state: RootState) => state.ui)
  const [showText, setShowText] = useState(false)

  useEffect(() => {
    if (isLoading) {
      // Show text after TV static effect starts
      const timer = setTimeout(() => setShowText(true), 800)
      return () => clearTimeout(timer)
    }
  }, [isLoading])

  if (!isLoading) return null

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center overflow-hidden">
      {/* TV Static Background */}
      <div className="absolute inset-0 tv-static"></div>
      
      {/* Static Overlay */}
      <div className="absolute inset-0 opacity-20">
        <div className="w-full h-full bg-repeat static-noise animate-static"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center">
        {/* Welcome Text with TV Effect */}
        <div className={`transition-all duration-1000 ${showText ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
          <h1 className="text-4xl md:text-6xl lg:text-8xl font-black text-white mb-4 tv-flicker tracking-wider">
            WELCOME TO
          </h1>
          <h2 className="text-5xl md:text-7xl lg:text-9xl font-black text-red-500 tv-flicker-red tracking-wider">
            URBAN KICKS
          </h2>
        </div>

        {/* Loading Bar with Static Effect */}
        <div className={`mt-12 transition-all duration-1000 delay-500 ${showText ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="w-80 h-3 bg-gray-900 rounded-full overflow-hidden border-2 border-white/30 mx-auto">
            <div className="h-full bg-gradient-to-r from-red-500 via-white to-red-500 animate-loading-bar static-loading"></div>
          </div>
          <p className="text-white/80 text-sm mt-4 tracking-widest font-mono">
            LOADING...
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoadingScreen