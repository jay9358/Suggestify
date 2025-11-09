import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { authStore } from './store/authStore.js';
import TopBar from './components/TopBar.jsx';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import SuggestionNew from './pages/SuggestionNew.jsx';
import SuggestionDetail from './pages/SuggestionDetail.jsx';
import Profile from './pages/Profile.jsx';
import AdminPanel from './pages/AdminPanel.jsx';
import ManagerDashboard from './pages/ManagerDashboard.jsx';

function PrivateRoute({ children, requiredRole }) {
  const { isAuthenticated, user, isLoading } = authStore();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user?.role !== requiredRole && user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
}

function App() {
  const { checkAuth, isAuthenticated } = authStore();

  useEffect(() => {
    if (isAuthenticated) {
      checkAuth();
    }
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <TopBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/suggestions/new"
            element={
              <PrivateRoute>
                <SuggestionNew />
              </PrivateRoute>
            }
          />
          <Route path="/suggestions/:id" element={<SuggestionDetail />} />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <PrivateRoute requiredRole="admin">
                <AdminPanel />
              </PrivateRoute>
            }
          />
          <Route
            path="/manager"
            element={
              <PrivateRoute requiredRole="manager">
                <ManagerDashboard />
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

