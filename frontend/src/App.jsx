import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ProductProvider } from './context/ProductContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { InteractionProvider } from './context/InteractionContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { OrderProvider } from './context/OrderContext';
import { RecommendationProvider } from './context/RecommendationContext';

import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';

import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import AIDashboardPage from './pages/AIDashboardPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import OrderHistoryPage from './pages/OrderHistoryPage';
import WishlistPage from './pages/WishlistPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ArchitecturePage from './pages/ArchitecturePage';

// Protected Route Wrapper: Users MUST be logged in to view the store
function ProtectedLayout({ children }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}

// Public Route Wrapper: If already logged in, redirect to home
function PublicRoute({ children }) {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <InteractionProvider>
          <ProductProvider>
            <CartProvider>
              <WishlistProvider>
                <OrderProvider>
                  <RecommendationProvider>
                    <Routes>
                      {/* Public Authentication Routes */}
                      <Route
                        path="/login"
                        element={
                          <PublicRoute>
                            <LoginPage />
                          </PublicRoute>
                        }
                      />
                      <Route
                        path="/register"
                        element={
                          <PublicRoute>
                            <RegisterPage />
                          </PublicRoute>
                        }
                      />

                      {/* Protected E-Commerce Routes (Login Required) */}
                      <Route
                        path="/"
                        element={
                          <ProtectedLayout>
                            <HomePage />
                          </ProtectedLayout>
                        }
                      />
                      <Route
                        path="/shop"
                        element={
                          <ProtectedLayout>
                            <ShopPage />
                          </ProtectedLayout>
                        }
                      />
                      <Route
                        path="/product/:id"
                        element={
                          <ProtectedLayout>
                            <ProductDetailsPage />
                          </ProtectedLayout>
                        }
                      />
                      <Route
                        path="/ai-dashboard"
                        element={
                          <ProtectedLayout>
                            <AIDashboardPage />
                          </ProtectedLayout>
                        }
                      />
                      <Route
                        path="/cart"
                        element={
                          <ProtectedLayout>
                            <CartPage />
                          </ProtectedLayout>
                        }
                      />
                      <Route
                        path="/checkout"
                        element={
                          <ProtectedLayout>
                            <CheckoutPage />
                          </ProtectedLayout>
                        }
                      />
                      <Route
                        path="/order-confirmation/:orderId"
                        element={
                          <ProtectedLayout>
                            <OrderConfirmationPage />
                          </ProtectedLayout>
                        }
                      />
                      <Route
                        path="/orders"
                        element={
                          <ProtectedLayout>
                            <OrderHistoryPage />
                          </ProtectedLayout>
                        }
                      />
                      <Route
                        path="/wishlist"
                        element={
                          <ProtectedLayout>
                            <WishlistPage />
                          </ProtectedLayout>
                        }
                      />
                      <Route
                        path="/admin"
                        element={
                          <ProtectedLayout>
                            <AdminDashboardPage />
                          </ProtectedLayout>
                        }
                      />
                      <Route
                        path="/architecture"
                        element={
                          <ProtectedLayout>
                            <ArchitecturePage />
                          </ProtectedLayout>
                        }
                      />

                      {/* Catch-All */}
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                  </RecommendationProvider>
                </OrderProvider>
              </WishlistProvider>
            </CartProvider>
          </ProductProvider>
        </InteractionProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
