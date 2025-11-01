import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { type RootState, type AppDispatch } from '../store/store'
import { setLoading } from '../store/slices/uiSlice'
import { getCurrentUser } from '../store/slices/authSlice'
import MainApp from './MainApp'
import ShopPage from '../pages/ShopPage'
import ProductDetailPage from '../pages/ProductDetailPage'
import LoginPage from '../pages/LoginPage'
import RegisterPage from '../pages/RegisterPage'
import AccountManagement from '../pages/AccountManagement'
import ProtectedRoute from './ProtectedRoute'
import AuthGuard from './AuthGuard'
import LoadingScreen from './LoadingScreen'

const RoutingApp: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { token } = useSelector((state: RootState) => state.auth)

  useEffect(() => {
    // Simulate loading
    dispatch(setLoading(true))
    const timer = setTimeout(() => {
      dispatch(setLoading(false))
    }, 2000)

    return () => clearTimeout(timer)
  }, [dispatch])

  useEffect(() => {
    // Check if user is authenticated and get current user info
    if (token) {
      dispatch(getCurrentUser())
    }
  }, [token, dispatch])

  return (
    <div className="min-h-screen bg-anime-dark">
      <LoadingScreen />
      <Router>
        <Routes>
          <Route path="/" element={<MainApp />} />
          <Route 
            path="/shop" 
            element={
              <ProtectedRoute>
                <ShopPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/product/:id" 
            element={
              <ProtectedRoute>
                <ProductDetailPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/accounts" 
            element={
              <ProtectedRoute>
                <AccountManagement />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/login" 
            element={
              <AuthGuard>
                <LoginPage />
              </AuthGuard>
            } 
          />
          <Route 
            path="/register" 
            element={
              <AuthGuard>
                <RegisterPage />
              </AuthGuard>
            } 
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </div>
  )
}

export default RoutingApp