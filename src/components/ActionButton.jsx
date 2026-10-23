import React from 'react';
import { ArrowUpRight, ChevronRight } from 'lucide-react';

export function ActionButton({
  id,
  label,
  subtitle,
  icon: Icon,
  variant = 'primary', // 'primary' | 'secondary' | 'accent'
  onClick,
  href,
  download,
  isExternal = false,
  ariaLabel
}) {
  const content = (
    <>
      <span className="btn-icon-wrapper">
        {Icon && <Icon className="btn-icon" size={20} />}
      </span>
      <span className="btn-text-group">
        <span className="btn-label">{label}</span>
        {subtitle && <span className="btn-subtitle">{subtitle}</span>}
      </span>
      <span className="btn-arrow-wrapper">
        {isExternal ? (
          <ArrowUpRight className="btn-arrow" size={18} />
        ) : (
          <ChevronRight className="btn-arrow" size={18} />
        )}
      </span>
    </>
  );

  const baseClassName = `action-btn action-btn-${variant}`;

  if (href) {
    return (
      <a
        id={id}
        href={href}
        download={download}
        target={isExternal ? '_blank' : '_self'}
        rel={isExternal ? 'noopener noreferrer' : undefined}
        className={baseClassName}
        aria-label={ariaLabel || label}
        onClick={onClick}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      id={id}
      type="button"
      onClick={onClick}
      className={baseClassName}
      aria-label={ariaLabel || label}
    >
      {content}
    </button>
  );
}

export default ActionButton;
