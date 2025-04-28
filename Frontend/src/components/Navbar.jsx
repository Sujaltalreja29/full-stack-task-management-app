import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, History, LogOut, LogIn, ShoppingCart, Coffee, User, ChefHat } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isAuth, setIsAuth] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');
      
      if (token && userStr) {
        const userData = JSON.parse(userStr);
        setUser(userData);
        setIsAuth(true);
        setIsAdmin(userData.isAdmin);
      } else {
        setIsAuth(false);
        setIsAdmin(false);
        setUser(null);
      }
    };

    checkAuth();
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    setIsAuth(false);
    setIsMobileMenuOpen(false);
    navigate('/login');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="bg-white shadow-md sticky top-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="flex items-center justify-center p-2 bg-gradient-to-br from-orange-400 to-red-500 text-white rounded-lg">
              <ChefHat className="h-6 w-6" />
            </span>
            <span className="text-xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
              Flavor Fusion
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-1">
            {isAuth && (
              <Link 
                to="/menu" 
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center ${
                  isActive('/menu') 
                    ? 'bg-orange-50 text-orange-700' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Coffee className="w-4 h-4 mr-1.5" />
                Menu
              </Link>
            )}

            {/* {isAuth && !isAdmin && (
              <Link 
                to="/cart" 
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center ${
                  isActive('/cart') 
                    ? 'bg-orange-50 text-orange-700' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <ShoppingCart className="w-4 h-4 mr-1.5" />
                Cart
              </Link>
            )} */}
            
            {isAuth && (
              <Link 
                to="/history" 
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center ${
                  isActive('/history') 
                    ? 'bg-orange-50 text-orange-700' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <History className="w-4 h-4 mr-1.5" />
                History
              </Link>
            )}
            
            {isAuth ? (
              <div className="flex items-center pl-3">
                <div className="border-l border-gray-200 h-6 mr-3"></div>
                <div className="flex items-center">
                  <div className="mr-3 text-right hidden sm:block">
                    <p className="text-sm font-medium text-gray-700">{user?.username || 'User'}</p>
                    <p className="text-xs text-gray-500">{isAdmin ? 'Admin' : 'Customer'}</p>
                  </div>
                  <div className="bg-orange-100 text-orange-800 p-2 rounded-full">
                    <User className="h-5 w-5" />
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="ml-4 inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all duration-200"
                >
                  <LogOut className="w-4 h-4 mr-1.5" />
                  Logout
                </button>
              </div>
            ) : (
              <Link 
                to="/login"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all duration-200"
              >
                <LogIn className="w-4 h-4 mr-1.5" />
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            {isAuth && (
              <Link 
                to="/cart" 
                className={`p-2 mr-2 rounded-lg transition-all duration-200 ${
                  isActive('/cart') 
                    ? 'bg-orange-50 text-orange-700' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <ShoppingCart className="h-5 w-5" />
              </Link>
            )}
            
            <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-gray-900 focus:outline-none"
              aria-expanded={isMobileMenuOpen}
            >
              <span className="sr-only">{isMobileMenuOpen ? 'Close menu' : 'Open menu'}</span>
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden border-t border-gray-100 bg-white"
          >
            <div className="px-3 pt-3 pb-4 space-y-1 sm:px-4">
              {isAuth && (
                <>
                  <div className="px-4 py-4 mb-2 flex items-center bg-orange-50 rounded-lg">
                    <div className="bg-orange-100 text-orange-800 p-2 rounded-full mr-3">
                      <User className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">{user?.username || 'User'}</p>
                      <p className="text-xs text-gray-500">{isAdmin ? 'Admin' : 'Customer'}</p>
                    </div>
                  </div>
                  
                  <Link
                    to="/menu"
                    className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive('/menu') 
                        ? 'bg-orange-50 text-orange-700' 
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Coffee className="w-5 h-5 mr-3" />
                    Menu
                  </Link>
                  
                  {!isAdmin && (
                    <Link
                      to="/cart"
                      className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                        isActive('/cart') 
                          ? 'bg-orange-50 text-orange-700' 
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <ShoppingCart className="w-5 h-5 mr-3" />
                      Cart
                    </Link>
                  )}
                  
                  <Link
                    to="/history"
                    className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive('/history') 
                        ? 'bg-orange-50 text-orange-700' 
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <History className="w-5 h-5 mr-3" />
                    Order History
                  </Link>
                  
                  <div className="pt-2 mt-2">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center justify-center px-4 py-3 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 transition-all duration-200"
                    >
                      <LogOut className="w-5 h-5 mr-2" />
                      Logout
                    </button>
                  </div>
                </>
              )} : (
                <Link
                  to="/login"
                  className="w-full flex items-center justify-center px-4 py-3 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 transition-all duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <LogIn className="w-5 h-5 mr-2" />
                  Login
                </Link>
              )
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;