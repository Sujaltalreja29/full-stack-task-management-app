import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, History, LogOut, LogIn } from 'lucide-react';

const Navbar = () => {
  const [isAuth, setIsAuth] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuth(true);
    }

    // Check for JWT token on component mount and token changes
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      setIsAuth(!!token);
    };

    checkAuth();
    // Listen for storage changes (in case token is modified in another tab)
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('shopping-cart');
    setIsAuth(false);
    setIsMobileMenuOpen(false);
    navigate('/login');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-xl font-bold text-gray-800">
              Your Brand
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/menu"
              className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md"
            >
              Menu
            </Link>
            {isAuth ? (
              <>
                <Link
                  to="/history"
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md flex items-center"
                >
                  <History className="w-4 h-4 mr-1" />
                  History
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 flex items-center"
                >
                  <LogOut className="w-4 h-4 mr-1" />
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 flex items-center"
              >
                <LogIn className="w-4 h-4 mr-1" />
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="text-gray-600 hover:text-gray-900"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/menu"
              className="text-gray-600 hover:text-gray-900 block px-3 py-2 rounded-md"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Menu
            </Link>

            {isAuth ? (
              <>
                <Link
                  to="/history"
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md flex items-center"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <History className="w-4 h-4 mr-1" />
                  History
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left text-red-500 hover:text-red-600 px-3 py-2 rounded-md flex items-center"
                >
                  <LogOut className="w-4 h-4 mr-1" />
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="text-blue-500 hover:text-blue-600 px-3 py-2 rounded-md flex items-center"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <LogIn className="w-4 h-4 mr-1" />
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
