import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import React, { ReactNode, useId } from 'react';

export interface FormFieldProps {
  label: ReactNode;
  htmlFor?: string;
  required?: boolean;
  error?: string;
  description?: string;
  children: ReactNode;
  className?: string;
  helperText?: string;
  helperTone?: 'muted' | 'informational';
  describedByIds?: string[];
  labelClassName?: string;
}

export function FormField({
  label,
  htmlFor,
  required = false,
  error,
  description,
  children,
  className,
  helperText,
  helperTone = 'muted',
  describedByIds = [],
  labelClassName,
}: FormFieldProps) {
  const generatedId = useId();
  const isStringLabel = typeof label === 'string';
  const fieldId =
    htmlFor ||
    (isStringLabel
      ? `field-${label.toLowerCase().replace(/\s+/g, '-')}`
      : `field-${generatedId}`);

  const descriptionId = description ? `${fieldId}-description` : null;
  const helperId = helperText ? `${fieldId}-helper` : null;
  const errorId = error ? `${fieldId}-error` : null;

  const ariaDescribedBy =
    [descriptionId, helperId, errorId, ...describedByIds]
      .filter(Boolean)
      .join(' ') || undefined;

  return (
    <div className={cn('space-y-2', className)}>
      <Label
        htmlFor={fieldId}
        className={cn(
          required && "after:content-['*'] after:ml-1 after:text-destructive",
          labelClassName
        )}
      >
        {label}
      </Label>
      {description && (
        <p
          className="text-sm text-daikin-gray-500"
          id={descriptionId || undefined}
        >
          {description}
        </p>
      )}
      <div>
        {React.isValidElement(children)
          ? React.cloneElement(children as React.ReactElement<any>, {
              id: fieldId,
              'aria-describedby': ariaDescribedBy,
              'aria-invalid': error ? 'true' : undefined,
            })
          : children}
      </div>
      {helperText && (
        <p
          className={cn(
            'text-sm',
            helperTone === 'informational'
              ? 'text-daikin-gray-500'
              : 'text-daikin-gray-400'
          )}
          id={helperId || undefined}
          aria-live="polite"
        >
          {helperText}
        </p>
      )}
      {error && (
        <p
          className="text-sm text-destructive"
          role="alert"
          id={errorId || undefined}
          aria-live="assertive"
        >
          {error}
        </p>
      )}
    </div>
  );
}
