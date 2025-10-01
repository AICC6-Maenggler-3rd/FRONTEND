import { forwardRef } from 'react';
import type { HTMLAttributes } from 'react';

type SeparatorProps = HTMLAttributes<HTMLDivElement> & {
  orientation?: 'horizontal' | 'vertical';
  decorative?: boolean;
};

function cn(...classes: Array<string | undefined | null | false>) {
  return classes.filter(Boolean).join(' ');
}

export const Separator = forwardRef<HTMLDivElement, SeparatorProps>(
  function Separator(
    { className, orientation = 'horizontal', decorative = true, ...props },
    ref,
  ) {
    return (
      <div
        ref={ref}
        role={decorative ? 'none' : 'separator'}
        aria-orientation={orientation}
        className={cn(
          'shrink-0 bg-border',
          orientation === 'horizontal' ? 'h-[1px] w-full' : 'h-full w-[1px]',
          className,
        )}
        {...props}
      />
    );
  },
);
