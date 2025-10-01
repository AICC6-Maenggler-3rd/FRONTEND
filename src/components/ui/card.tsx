import { forwardRef } from 'react';
import type { HTMLAttributes } from 'react';

type CardProps = HTMLAttributes<HTMLDivElement> & {
  asChild?: boolean;
};

function cn(...classes: Array<string | undefined | null | false>) {
  return classes.filter(Boolean).join(' ');
}

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { className, ...props },
  ref,
) {
  const base =
    'rounded-2xl border border-border bg-background text-foreground shadow-sm';
  return <div ref={ref} className={cn(base, className)} {...props} />;
});

export const CardHeader = forwardRef<HTMLDivElement, CardProps>(
  function CardHeader({ className, ...props }, ref) {
    return (
      <div
        ref={ref}
        className={cn('flex flex-col space-y-1.5 p-6', className)}
        {...props}
      />
    );
  },
);

export const CardTitle = forwardRef<HTMLParagraphElement, CardProps>(
  function CardTitle({ className, ...props }, ref) {
    return (
      <h3
        ref={ref}
        className={cn(
          'text-2xl font-semibold leading-none tracking-tight',
          className,
        )}
        {...props}
      />
    );
  },
);

export const CardDescription = forwardRef<HTMLParagraphElement, CardProps>(
  function CardDescription({ className, ...props }, ref) {
    return (
      <p
        ref={ref}
        className={cn('text-sm text-muted-foreground', className)}
        {...props}
      />
    );
  },
);

export const CardContent = forwardRef<HTMLDivElement, CardProps>(
  function CardContent({ className, ...props }, ref) {
    return <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />;
  },
);
