import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { User, Mail, Lock, Phone } from 'lucide-react';
import Button from '../common/Button';
import Input from '../common/Input';
import {
  validateRequired,
  isValidEmail,
  validatePassword,
  isValidPhone,
  validateName
} from '../../utils/validators';

const SignupForm = ({ onSubmit, onSwitchToLogin, loading = false }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
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

    // Validate name
    const nameValidation = validateName(formData.name);
    if (!nameValidation.isValid) {
      newErrors.name = nameValidation.error;
    }

    // Validate email
    const emailValidation = validateRequired(formData.email, 'Email');
    if (!emailValidation.isValid) {
      newErrors.email = emailValidation.error;
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Invalid email address';
    }

    // Validate phone
    if (formData.phone && !isValidPhone(formData.phone)) {
      newErrors.phone = 'Invalid phone number';
    }

    // Validate password
    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.isValid) {
      newErrors.password = passwordValidation.error;
    }

    // Validate confirm password
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validate()) {
      const { confirmPassword, ...userData } = formData;
      onSubmit(userData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label={t('auth.name') || 'Full Name'}
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder={t('auth.namePlaceholder') || 'Enter your full name'}
        icon={User}
        error={errors.name}
        required
        autoComplete="name"
      />

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
        label={t('auth.phone') || 'Phone (Optional)'}
        type="tel"
        name="phone"
        value={formData.phone}
        onChange={handleChange}
        placeholder={t('auth.phonePlaceholder') || '(11) 98765-4321'}
        icon={Phone}
        error={errors.phone}
        autoComplete="tel"
      />

      <Input
        label={t('auth.password') || 'Password'}
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        placeholder={t('auth.passwordPlaceholder') || 'Create a password'}
        icon={Lock}
        error={errors.password}
        required
        autoComplete="new-password"
        helperText={t('auth.passwordHint') || 'At least 8 characters with letters and numbers'}
      />

      <Input
        label={t('auth.confirmPassword') || 'Confirm Password'}
        type="password"
        name="confirmPassword"
        value={formData.confirmPassword}
        onChange={handleChange}
        placeholder={t('auth.confirmPasswordPlaceholder') || 'Confirm your password'}
        icon={Lock}
        error={errors.confirmPassword}
        required
        autoComplete="new-password"
      />

      <Button
        type="submit"
        variant="primary"
        fullWidth
        loading={loading}
      >
        {t('auth.signUp') || 'Sign Up'}
      </Button>

      <div className="text-center">
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="text-sm text-gray-600 hover:text-gray-800"
        >
          {t('auth.haveAccount') || 'Already have an account?'}{' '}
          <span className="font-medium text-primary-600 hover:text-primary-700">
            {t('auth.login') || 'Login'}
          </span>
        </button>
      </div>
    </form>
  );
};

export default SignupForm;
