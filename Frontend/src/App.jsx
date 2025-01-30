import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Menu from './pages/Menu';
import OrderPage from './pages/Order';

function App() {

  return (
    <Router>
      <AuthProvider>
      <CartProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
            path="/menu"
            element={
              <ProtectedRoute>
                <Menu />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/menu" />} />
          <Route
            path="/order"
            element={
              <ProtectedRoute>
                < OrderPage/>
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/order"/>} />
            {/* Add other routes here */}
          </Routes>
          </CartProvider>
      </AuthProvider>
      </Router>
    );
}

export default App
