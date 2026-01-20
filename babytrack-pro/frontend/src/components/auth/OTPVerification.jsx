import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../common/Button';
import { validateOTP } from '../../utils/validators';

const OTPVerification = ({ phone, onVerify, onResend, loading = false }) => {
  const { t } = useTranslation();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(60);
  const inputRefs = useRef([]);

  // Countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleChange = (index, value) => {
    // Only allow numbers
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError('');

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all filled
    if (index === 5 && value) {
      const otpCode = newOtp.join('');
      handleVerify(otpCode);
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);

    if (/^\d{6}$/.test(pastedData)) {
      const newOtp = pastedData.split('');
      setOtp(newOtp);
      setError('');

      // Focus last input
      inputRefs.current[5]?.focus();

      // Auto-submit
      handleVerify(pastedData);
    }
  };

  const handleVerify = (otpCode = otp.join('')) => {
    const validation = validateOTP(otpCode);

    if (!validation.isValid) {
      setError(validation.error);
      return;
    }

    onVerify(otpCode);
  };

  const handleResend = () => {
    setOtp(['', '', '', '', '', '']);
    setError('');
    setCountdown(60);
    onResend();
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900">
          {t('auth.verifyOTP') || 'Verify Your Phone'}
        </h3>
        <p className="mt-2 text-sm text-gray-600">
          {t('auth.otpSentTo') || 'We sent a code to'}{' '}
          <span className="font-medium text-gray-900">{phone}</span>
        </p>
      </div>

      <div>
        <div className="flex justify-center gap-2">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              className={`w-12 h-12 text-center text-2xl font-semibold border-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                error
                  ? 'border-danger-300 focus:border-danger-500'
                  : 'border-gray-300 focus:border-primary-500'
              }`}
              aria-label={`Digit ${index + 1}`}
            />
          ))}
        </div>

        {error && (
          <p className="mt-2 text-sm text-center text-danger-600">{error}</p>
        )}
      </div>

      <Button
        variant="primary"
        fullWidth
        onClick={() => handleVerify()}
        loading={loading}
        disabled={otp.some(d => !d)}
      >
        {t('auth.verify') || 'Verify'}
      </Button>

      <div className="text-center">
        {countdown > 0 ? (
          <p className="text-sm text-gray-600">
            {t('auth.resendIn') || 'Resend code in'}{' '}
            <span className="font-medium text-primary-600">{countdown}s</span>
          </p>
        ) : (
          <button
            type="button"
            onClick={handleResend}
            className="text-sm font-medium text-primary-600 hover:text-primary-700"
          >
            {t('auth.resendCode') || 'Resend Code'}
          </button>
        )}
      </div>
    </div>
  );
};

export default OTPVerification;
