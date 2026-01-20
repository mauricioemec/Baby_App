import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Baby } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useNotifications } from '../hooks/useNotifications';
import LoginForm from '../components/auth/LoginForm';
import SignupForm from '../components/auth/SignupForm';
import ConsentModal from '../components/auth/ConsentModal';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, register, acceptConsent, user, isAuthenticated } = useAuth();
  const { showError } = useNotifications();
  const [mode, setMode] = useState('login'); // 'login' or 'signup'
  const [loading, setLoading] = useState(false);
  const [showConsent, setShowConsent] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user) {
      if (!user.hasAcceptedConsent) {
        setShowConsent(true);
      } else {
        navigate('/dashboard');
      }
    }
  }, [isAuthenticated, user, navigate]);

  const handleLogin = async (credentials) => {
    try {
      setLoading(true);
      await login(credentials);
    } catch (error) {
      showError(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (userData) => {
    try {
      setLoading(true);
      await register(userData);
    } catch (error) {
      showError(error.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptConsent = async () => {
    try {
      setLoading(true);
      await acceptConsent();
      navigate('/dashboard');
    } catch (error) {
      showError(error.message || 'Failed to accept consent');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-4">
              <Baby className="w-10 h-10 text-primary-600" />
            </div>
            <h1 className="text-3xl font-bold text-white">BabyTrack Pro</h1>
            <p className="mt-2 text-primary-100">
              Professional Neonatal Tracking System
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            {mode === 'login' ? (
              <LoginForm
                onSubmit={handleLogin}
                onSwitchToSignup={() => setMode('signup')}
                loading={loading}
              />
            ) : (
              <SignupForm
                onSubmit={handleSignup}
                onSwitchToLogin={() => setMode('login')}
                loading={loading}
              />
            )}
          </div>

          {/* Footer */}
          <p className="mt-6 text-center text-sm text-primary-100">
            &copy; 2024 BabyTrack Pro. All rights reserved.
          </p>
        </div>
      </div>

      <ConsentModal
        isOpen={showConsent}
        onAccept={handleAcceptConsent}
        loading={loading}
      />
    </>
  );
};

export default LoginPage;
