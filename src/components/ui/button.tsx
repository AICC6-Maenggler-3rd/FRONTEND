import { forwardRef } from 'react';
import type { ButtonHTMLAttributes } from 'react';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'default' | 'outline';
  size?: 'sm' | 'md' | 'lg';
};

export const Button = forwardRef<HTMLButtonElement, Props>(function Button(
  { className = '', variant = 'default', size = 'md', ...props },
  ref,
) {
  const base =
    'inline-flex items-center justify-center rounded-xl font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--ring)]';
  const variants: Record<string, string> = {
    default:
      'bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--primary-hover)] active:bg-[var(--primary-pressed)] disabled:bg-[var(--disabled-bg)] disabled:text-[var(--disabled-text)]',
    outline:
      'border-2 border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)] hover:border-[var(--accent)] bg-transparent',
  };
  const sizes: Record<string, string> = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-5 py-3 text-base',
    lg: 'px-8 py-6 text-lg',
  };

  return (
    <button
      ref={ref}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    />
  );
});
