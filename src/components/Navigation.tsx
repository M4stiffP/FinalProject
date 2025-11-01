import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import type { RootState, AppDispatch } from '../store/store';

const Navigation: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, token } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();

  const handleLogout = () => {
    dispatch(logout());
    setIsMenuOpen(false);
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/10 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-white">
            Urban Kicks
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {/* Navigation Links */}
            <button
              onClick={() => scrollToSection('home')}
              className="text-white hover:text-red-500 transition-colors duration-300 font-medium"
            >
              หน้าแรก
            </button>
            <button
              onClick={() => scrollToSection('about')}
              className="text-white hover:text-red-500 transition-colors duration-300 font-medium"
            >
              เกี่ยวกับเรา
            </button>
            <button
              onClick={() => scrollToSection('story')}
              className="text-white hover:text-red-500 transition-colors duration-300 font-medium"
            >
              เรื่องราว
            </button>

            {/* Auth Section */}
            {token && user ? (
              <div className="flex items-center space-x-4">
                <Link
                  to="/shop"
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-300 font-medium"
                >
                  เข้าร้านค้า
                </Link>
                <span className="text-white">สวัสดี, {user.name}</span>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors duration-300"
                >
                  ออกจากระบบ
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-white hover:text-red-500 transition-colors duration-300 font-medium"
                >
                  เข้าสู่ระบบ
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-300"
                >
                  สมัครสมาชิก
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-white hover:text-red-500 transition-colors duration-300"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-black/90 backdrop-blur-lg border-t border-white/10">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <button
                onClick={() => scrollToSection('home')}
                className="block w-full text-left px-3 py-2 text-white hover:text-red-500 transition-colors duration-300"
              >
                หน้าแรก
              </button>
              <button
                onClick={() => scrollToSection('about')}
                className="block w-full text-left px-3 py-2 text-white hover:text-red-500 transition-colors duration-300"
              >
                เกี่ยวกับเรา
              </button>
              <button
                onClick={() => scrollToSection('story')}
                className="block w-full text-left px-3 py-2 text-white hover:text-red-500 transition-colors duration-300"
              >
                เรื่องราว
              </button>

              {token && user ? (
                <div className="pt-2 border-t border-white/10">
                  <div className="px-3 py-2 text-gray-300">สวัสดี, {user.name}</div>
                  <Link
                    to="/shop"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-3 py-2 text-white hover:text-red-500 transition-colors duration-300"
                  >
                    เข้าร้านค้า
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-3 py-2 text-white hover:text-red-500 transition-colors duration-300"
                  >
                    ออกจากระบบ
                  </button>
                </div>
              ) : (
                <div className="pt-2 border-t border-white/10">
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-3 py-2 text-white hover:text-red-500 transition-colors duration-300"
                  >
                    เข้าสู่ระบบ
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-3 py-2 text-white hover:text-red-500 transition-colors duration-300"
                  >
                    สมัครสมาชิก
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;