import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import React, { ReactNode } from 'react';

export interface FormFieldProps {
  label: string;
  htmlFor?: string;
  required?: boolean;
  error?: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

export function FormField({
  label,
  htmlFor,
  required = false,
  error,
  description,
  children,
  className,
}: FormFieldProps) {
  const fieldId =
    htmlFor || `field-${label.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div className={cn('space-y-2', className)}>
      <Label
        htmlFor={fieldId}
        className={cn(
          required && "after:content-['*'] after:ml-1 after:text-destructive"
        )}
      >
        {label}
      </Label>
      {description && (
        <p
          className="text-sm text-daikin-gray-500"
          id={`${fieldId}-description`}
        >
          {description}
        </p>
      )}
      <div>
        {React.isValidElement(children)
          ? React.cloneElement(children as React.ReactElement<any>, {
              id: fieldId,
              'aria-describedby': error
                ? `${fieldId}-error${
                    description ? ` ${fieldId}-description` : ''
                  }`
                : description
                ? `${fieldId}-description`
                : undefined,
              'aria-invalid': error ? 'true' : undefined,
            })
          : children}
      </div>
      {error && (
        <p
          className="text-sm text-destructive"
          role="alert"
          id={`${fieldId}-error`}
        >
          {error}
        </p>
      )}
    </div>
  );
}
