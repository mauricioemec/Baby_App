import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Mail, Lock } from 'lucide-react';
import Button from '../common/Button';
import Input from '../common/Input';
import { validateRequired, isValidEmail, validatePassword } from '../../utils/validators';

const LoginForm = ({ onSubmit, onSwitchToSignup, loading = false }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const validate = () => {
    const newErrors = {};

    // Validate email
    const emailValidation = validateRequired(formData.email, 'Email');
    if (!emailValidation.isValid) {
      newErrors.email = emailValidation.error;
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Invalid email address';
    }

    // Validate password
    const passwordValidation = validateRequired(formData.password, 'Password');
    if (!passwordValidation.isValid) {
      newErrors.password = passwordValidation.error;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label={t('auth.email') || 'Email'}
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder={t('auth.emailPlaceholder') || 'your.email@example.com'}
        icon={Mail}
        error={errors.email}
        required
        autoComplete="email"
      />

      <Input
        label={t('auth.password') || 'Password'}
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        placeholder={t('auth.passwordPlaceholder') || 'Enter your password'}
        icon={Lock}
        error={errors.password}
        required
        autoComplete="current-password"
      />

      <div className="flex items-center justify-between">
        <label className="flex items-center">
          <input
            type="checkbox"
            className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
          />
          <span className="ml-2 text-sm text-gray-600">
            {t('auth.rememberMe') || 'Remember me'}
          </span>
        </label>

        <button
          type="button"
          className="text-sm text-primary-600 hover:text-primary-700"
        >
          {t('auth.forgotPassword') || 'Forgot password?'}
        </button>
      </div>

      <Button
        type="submit"
        variant="primary"
        fullWidth
        loading={loading}
      >
        {t('auth.login') || 'Login'}
      </Button>

      <div className="text-center">
        <button
          type="button"
          onClick={onSwitchToSignup}
          className="text-sm text-gray-600 hover:text-gray-800"
        >
          {t('auth.noAccount') || "Don't have an account?"}{' '}
          <span className="font-medium text-primary-600 hover:text-primary-700">
            {t('auth.signUp') || 'Sign up'}
          </span>
        </button>
      </div>
    </form>
  );
};

export default LoginForm;
