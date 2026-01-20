const ProgressBar = ({
  value,
  max = 100,
  color = 'primary',
  size = 'md',
  showLabel = false,
  label,
  className = ''
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const colors = {
    primary: 'bg-primary-600',
    secondary: 'bg-secondary-600',
    danger: 'bg-danger-600',
    warning: 'bg-warning-600',
    success: 'bg-secondary-600'
  };

  const bgColors = {
    primary: 'bg-primary-100',
    secondary: 'bg-secondary-100',
    danger: 'bg-danger-100',
    warning: 'bg-warning-100',
    success: 'bg-secondary-100'
  };

  const sizes = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3'
  };

  return (
    <div className={className}>
      {(showLabel || label) && (
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">
            {label || `${percentage.toFixed(0)}%`}
          </span>
          {label && showLabel && (
            <span className="text-sm text-gray-500">
              {percentage.toFixed(0)}%
            </span>
          )}
        </div>
      )}

      <div className={`w-full ${bgColors[color]} rounded-full overflow-hidden ${sizes[size]}`}>
        <div
          className={`${colors[color]} ${sizes[size]} rounded-full transition-all duration-300 ease-out`}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
