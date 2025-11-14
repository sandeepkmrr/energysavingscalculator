import { cn } from '@/lib/utils';
import { useEffect, useId, useRef, useState } from 'react';

export interface InfoTooltipProps {
  content: string;
  className?: string;
  tooltipClassName?: string;
  id?: string;
  'aria-label'?: string;
}

export function InfoTooltip({
  content,
  className,
  tooltipClassName,
  id,
  'aria-label': ariaLabel = 'More information',
}: InfoTooltipProps) {
  const [open, setOpen] = useState(false);
  const generatedId = useId();
  const tooltipId = id ?? generatedId;
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setOpen(false);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  useEffect(
    () => () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    },
    []
  );

  const scheduleClose = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
    closeTimeoutRef.current = setTimeout(() => setOpen(false), 100);
  };

  return (
    <span className={cn('relative inline-flex items-center', className)}>
      <button
        type="button"
        ref={triggerRef}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={scheduleClose}
        onFocus={() => setOpen(true)}
        onBlur={scheduleClose}
        onClick={() => setOpen((previous) => !previous)}
        aria-label={ariaLabel}
        aria-describedby={tooltipId}
        aria-expanded={open}
        aria-haspopup="true"
        className="ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full border border-daikin-gray-100 bg-white text-[0.75rem] text-daikin-gray-500 transition-colors hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta focus-visible:ring-offset-2"
      >
        <span aria-hidden="true">ℹ️</span>
      </button>
      <span id={tooltipId} className="sr-only">
        {content}
      </span>
      <span
        role="tooltip"
        data-state={open ? 'open' : 'closed'}
        aria-hidden={!open}
        className={cn(
          'pointer-events-none absolute left-1/2 top-full z-20 mt-2 w-72 max-w-xs -translate-x-1/2 rounded-md border border-daikin-gray-100 bg-white px-4 py-3 text-xs leading-relaxed text-daikin-gray-500 opacity-0 shadow-card transition-opacity duration-150',
          open && 'pointer-events-auto opacity-100',
          tooltipClassName
        )}
      >
        {content}
      </span>
    </span>
  );
}
