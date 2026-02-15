import React from "react";

export const SectionTitle: React.FC<{ label: string }> = ({ label }) => (
  <h2 className="section-title text-neutral-900">{label}</h2>
);

export const GlassCard: React.FC<React.PropsWithChildren<{ className?: string }>> = ({
  children,
  className = "",
}) => <div className={`glass-card ${className}`}>{children}</div>;

export const Badge: React.FC<React.PropsWithChildren> = ({ children }) => (
  <span className="badge-pill">{children}</span>
);

export const CTAButton: React.FC<{
  label: string;
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}> = ({ label, href, onClick, type = "button", disabled = false }) => {
  const handleClick = (
    event: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement, MouseEvent>,
  ) => {
    if (onClick) {
      event.preventDefault();
      onClick();
    }
  };

  if (href) {
    return (
      <a className="button-primary" href={href} onClick={handleClick}>
        {label}
      </a>
    );
  }

  return (
    <button type={type} className="button-primary disabled:cursor-not-allowed disabled:opacity-70" onClick={onClick} disabled={disabled}>
      {label}
    </button>
  );
};

export const SectionWave: React.FC<React.PropsWithChildren<{ className?: string }>> = ({
  children,
  className = "",
}) => <section className={`section-wave ${className} pb-16 pt-12 md:pt-16`}>{children}</section>;
