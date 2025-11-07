import { Input, InputProps } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export interface NumberInputProps extends Omit<InputProps, 'type'> {
  min?: number;
  max?: number;
  step?: number;
}

export function NumberInput({
  className,
  min,
  max,
  step,
  value,
  ...props
}: NumberInputProps) {
  // Convert empty number to empty string for proper input display
  const displayValue =
    value === '' || value === null || value === undefined ? '' : value;

  return (
    <Input
      type="number"
      className={cn('w-full', className)}
      min={min}
      max={max}
      step={step}
      value={displayValue}
      {...props}
    />
  );
}
