import { AlertCircle, CheckCircle, Info, AlertTriangle, X } from 'lucide-react';

const Alert = ({
  type = 'info',
  title,
  message,
  dismissible = false,
  onDismiss,
  className = ''
}) => {
  const icons = {
    success: <CheckCircle className="w-5 h-5" />,
    error: <AlertCircle className="w-5 h-5" />,
    warning: <AlertTriangle className="w-5 h-5" />,
    info: <Info className="w-5 h-5" />
  };

  const colors = {
    success: 'bg-secondary-50 border-secondary-200 text-secondary-800',
    error: 'bg-danger-50 border-danger-200 text-danger-800',
    warning: 'bg-warning-50 border-warning-200 text-warning-800',
    info: 'bg-primary-50 border-primary-200 text-primary-800'
  };

  const iconColors = {
    success: 'text-secondary-600',
    error: 'text-danger-600',
    warning: 'text-warning-600',
    info: 'text-primary-600'
  };

  return (
    <div
      className={`flex items-start p-4 border rounded-lg ${colors[type]} ${className}`}
      role="alert"
    >
      <div className={`flex-shrink-0 ${iconColors[type]}`}>
        {icons[type]}
      </div>

      <div className="flex-1 ml-3">
        {title && (
          <h3 className="text-sm font-medium">{title}</h3>
        )}
        {message && (
          <p className={`text-sm ${title ? 'mt-1' : ''} opacity-90`}>
            {message}
          </p>
        )}
      </div>

      {dismissible && (
        <button
          onClick={onDismiss}
          className="flex-shrink-0 ml-4 text-current opacity-70 hover:opacity-100"
          aria-label="Dismiss alert"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default Alert;
