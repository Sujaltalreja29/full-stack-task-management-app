import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Menu from './pages/Menu';
import OrderPage from './pages/Order';
import OrderHistory from './pages/History';
import Navbar from './components/Navbar';
import Home from './pages/Home';

function HomeRedirect() {
  const { user } = useAuth();  // Fetch user authentication status
  return user ? <Navigate to="/menu" /> : <Home />;
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <Navbar />
          <Routes>
            {/* Redirect logged-in users from Home to Menu */}
            <Route path="/" element={<HomeRedirect />} />

            {/* Login and Register remain accessible */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes (Require Authentication) */}
            <Route 
              path="/menu" 
              element={
                <ProtectedRoute>
                  <Menu />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/order" 
              element={
                <ProtectedRoute>
                  <OrderPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/history" 
              element={
                <ProtectedRoute>
                  <OrderHistory />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
