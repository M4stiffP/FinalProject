import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { type RootState } from '../store/store'
import { toggleMobileMenu, closeMobileMenu } from '../store/slices/uiSlice'

const Header: React.FC = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { isMobileMenuOpen } = useSelector((state: RootState) => state.ui)

  const handleMenuToggle = () => {
    dispatch(toggleMobileMenu())
  }

  const navItems = [
    { id: 'home', label: 'HOME', path: '/' },
    { id: 'shop', label: 'SHOP', path: '/shop' },
    { id: 'about', label: 'ABOUT', section: 'about' },
    { id: 'story', label: 'COLLECTIONS', section: 'story' },
    { id: 'admin', label: 'ADMIN', path: '/admin/accounts' },
    { id: 'contact', label: 'CONTACT', section: 'contact' }
  ]

  const handleNavClick = (item: typeof navItems[0]) => {
    if (item.path) {
      navigate(item.path)
    } else if (item.section) {
      document.getElementById(item.section)?.scrollIntoView({ behavior: 'smooth' })
    }
    dispatch(closeMobileMenu())
  }

  return (
    <>
      {/* Fixed Menu Icon - Very large icon without background circle */}
      <div className="fixed top-6 right-6 z-50">
        <button 
          onClick={handleMenuToggle}
          className="transition-all duration-300 hover:scale-90 transform p-4"
        >
          <img 
            src={isMobileMenuOpen ? "/images/closeIcon.png" : "/images/menuIcon.png"}
            alt="Menu" 
            className="w-40 h-40 animate-slow-spin drop-shadow-xl filter"
          />
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 overflow-y-auto">
          {/* Background */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: 'url(/images/background02.png)'
            }}
          >
            <div className="absolute inset-0 bg-black bg-opacity-70"></div>
          </div>
          
          {/* Menu Content */}
          <div className="relative z-50 flex items-center justify-center min-h-screen p-4">
            <nav className="text-center">
              <ul className="space-y-8">
                {navItems.map((item, index) => (
                  <li key={item.id}>
                    <button
                      onClick={() => handleNavClick(item)}
                      className="text-4xl sm:text-5xl md:text-6xl font-black text-white hover:text-red-400 transition-all duration-300 transform hover:scale-110 block w-full text-center"
                      style={{
                        animationDelay: `${index * 0.1}s`,
                      }}
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      )}
    </>
  )
}

export default Header