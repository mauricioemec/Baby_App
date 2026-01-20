import { Loader2 } from 'lucide-react';

const Button = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  icon: Icon,
  iconPosition = 'left',
  className = '',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500 active:bg-primary-800',
    secondary: 'bg-secondary-600 text-white hover:bg-secondary-700 focus:ring-secondary-500 active:bg-secondary-800',
    danger: 'bg-danger-600 text-white hover:bg-danger-700 focus:ring-danger-500 active:bg-danger-800',
    outline: 'border-2 border-primary-600 text-primary-600 hover:bg-primary-50 focus:ring-primary-500',
    ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-gray-500',
    link: 'text-primary-600 hover:text-primary-700 underline-offset-4 hover:underline'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm min-h-[36px]',
    md: 'px-4 py-2 text-base min-h-touch',
    lg: 'px-6 py-3 text-lg min-h-[56px]'
  };

  const widthClass = fullWidth ? 'w-full' : '';

  const buttonClasses = `${baseStyles} ${variants[variant]} ${sizes[size]} ${widthClass} ${className}`;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={buttonClasses}
      {...props}
    >
      {loading && (
        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
      )}

      {!loading && Icon && iconPosition === 'left' && (
        <Icon className="w-5 h-5 mr-2" />
      )}

      {children}

      {!loading && Icon && iconPosition === 'right' && (
        <Icon className="w-5 h-5 ml-2" />
      )}
    </button>
  );
};

export default Button;
