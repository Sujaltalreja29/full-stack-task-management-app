import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Menu from './pages/Menu';

function App() {

  return (
    <Router>
      <AuthProvider>
        
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
            {/* Add other routes here */}
          </Routes>
        
      </AuthProvider>
      </Router>
    );
}

export default App
