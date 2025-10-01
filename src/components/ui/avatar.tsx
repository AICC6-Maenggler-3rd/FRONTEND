import { forwardRef } from 'react';
import type { HTMLAttributes } from 'react';

type AvatarProps = HTMLAttributes<HTMLDivElement> & {
  asChild?: boolean;
};

function cn(...classes: Array<string | undefined | null | false>) {
  return classes.filter(Boolean).join(' ');
}

export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(function Avatar(
  { className, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cn(
        'relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full',
        className,
      )}
      {...props}
    />
  );
});

export const AvatarImage = forwardRef<
  HTMLImageElement,
  HTMLAttributes<HTMLImageElement>
>(function AvatarImage({ className, ...props }, ref) {
  return (
    <img
      ref={ref}
      className={cn('aspect-square h-full w-full', className)}
      {...props}
    />
  );
});

export const AvatarFallback = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(function AvatarFallback({ className, ...props }, ref) {
  return (
    <div
      ref={ref}
      className={cn(
        'flex h-full w-full items-center justify-center rounded-full bg-muted',
        className,
      )}
      {...props}
    />
  );
});
