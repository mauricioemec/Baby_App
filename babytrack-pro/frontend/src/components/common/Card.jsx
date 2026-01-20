const Card = ({
  children,
  title,
  subtitle,
  headerAction,
  footer,
  padding = 'normal',
  hover = false,
  className = ''
}) => {
  const paddings = {
    none: '',
    small: 'p-3',
    normal: 'p-4',
    large: 'p-6'
  };

  const hoverClass = hover ? 'hover:shadow-card-hover transition-shadow duration-200' : '';

  return (
    <div
      className={`bg-white rounded-xl shadow-card ${hoverClass} ${className}`}
    >
      {(title || headerAction) && (
        <div className={`flex items-center justify-between border-b border-gray-100 ${paddings[padding]}`}>
          <div>
            {title && (
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            )}
            {subtitle && (
              <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
            )}
          </div>
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}

      <div className={!title && !headerAction ? paddings[padding] : paddings[padding]}>
        {children}
      </div>

      {footer && (
        <div className={`border-t border-gray-100 ${paddings[padding]}`}>
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;
