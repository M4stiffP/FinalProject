import React from 'react'
import Header from './Header'
import HeroSection from './HeroSection'
import PromotionalBanner from './PromotionalBanner'
import VideoDisplay from './VideoDisplay'
import AboutSection from './AboutSection'
import StorySection from './StorySection'
import Footer from './Footer'
import BackToTop from './BackToTop'

const MainApp: React.FC = () => {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <PromotionalBanner />
        <VideoDisplay />
        <AboutSection />
        <StorySection />
      </main>
      <Footer />
      <BackToTop />
    </>
  )
}

export default MainApp