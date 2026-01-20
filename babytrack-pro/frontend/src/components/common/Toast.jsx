import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { useNotifications } from '../../hooks/useNotifications';

const Toast = ({ toast }) => {
  const { removeToast } = useNotifications();

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
      className={`flex items-start p-4 mb-3 border rounded-lg shadow-lg ${colors[toast.type]} animate-slide-in-right`}
      role="alert"
    >
      <div className={`flex-shrink-0 ${iconColors[toast.type]}`}>
        {icons[toast.type]}
      </div>

      <div className="flex-1 ml-3">
        {toast.title && (
          <h3 className="text-sm font-medium">{toast.title}</h3>
        )}
        {toast.message && (
          <p className="mt-1 text-sm opacity-90">{toast.message}</p>
        )}

        {toast.action && (
          <button
            onClick={toast.action.onClick}
            className="mt-2 text-sm font-medium underline hover:no-underline"
          >
            {toast.action.label}
          </button>
        )}
      </div>

      <button
        onClick={() => removeToast(toast.id)}
        className="flex-shrink-0 ml-4 text-current opacity-70 hover:opacity-100"
        aria-label="Close notification"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

const ToastContainer = () => {
  const { toasts } = useNotifications();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 w-full max-w-sm pointer-events-none">
      <div className="pointer-events-auto">
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} />
        ))}
      </div>
    </div>
  );
};

export { Toast, ToastContainer };
export default ToastContainer;
