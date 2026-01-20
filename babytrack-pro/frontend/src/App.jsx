import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { BabyProvider } from './contexts/BabyContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { useAuth } from './hooks/useAuth';
import ToastContainer from './components/common/Toast';
import Loader from './components/common/Loader';

// Pages
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ChartsPage from './pages/ChartsPage';
import HealthPage from './pages/HealthPage';
import SettingsPage from './pages/SettingsPage';

// Private Route Component
const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <Loader fullScreen />;
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// App Routes
const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <DashboardPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/charts"
        element={
          <PrivateRoute>
            <ChartsPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/health"
        element={
          <PrivateRoute>
            <HealthPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/settings"
        element={
          <PrivateRoute>
            <SettingsPage />
          </PrivateRoute>
        }
      />

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <NotificationProvider>
          <BabyProvider>
            <AppRoutes />
            <ToastContainer />
          </BabyProvider>
        </NotificationProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
