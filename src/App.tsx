import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setLoading } from './store/slices/uiSlice'
import HeroSection from './components/HeroSection'
import PromotionalBanner from './components/PromotionalBanner'
import VideoDisplay from './components/VideoDisplay'
import AboutSection from './components/AboutSection'
import StorySection from './components/StorySection'
import CharactersSection from './components/CharactersSection'
import Footer from './components/Footer'
import LoadingScreen from './components/LoadingScreen'
import BackToTop from './components/BackToTop'

function App() {
  const dispatch = useDispatch()

  useEffect(() => {
    // Simulate loading
    dispatch(setLoading(true))
    const timer = setTimeout(() => {
      dispatch(setLoading(false))
    }, 2000)

    return () => clearTimeout(timer)
  }, [dispatch])

  return (
    <div className="min-h-screen bg-anime-dark">
      <LoadingScreen />
      <main>
        <HeroSection />
        <PromotionalBanner />
        <VideoDisplay />
        <AboutSection />
        <StorySection />
        <CharactersSection />
      </main>
      <Footer />
      <BackToTop />
    </div>
  )
}

export default App
