import { cn } from '@/lib/utils';

export interface ChipProps {
  label: string;
  value: string | number;
  selected?: boolean;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

export function Chip({
  label,
  value,
  selected = false,
  onClick,
  className,
  disabled = false,
}: ChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-pill border-2 transition-all',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta focus-visible:ring-offset-2',
        selected
          ? 'bg-primary border-primary text-white'
          : 'bg-white border-daikin-gray-200 text-daikin-gray-600 hover:border-primary hover:text-primary',
        disabled &&
          'opacity-50 cursor-not-allowed hover:border-daikin-gray-200 hover:text-daikin-gray-600',
        className
      )}
      aria-pressed={selected}
      aria-label={`Select ${label}`}
    >
      {label}
    </button>
  );
}

export interface ChipGroupProps {
  chips: Array<{ label: string; value: string | number }>;
  selectedValue?: string | number;
  onChange?: (value: string | number) => void;
  className?: string;
  disabled?: boolean;
}

export function ChipGroup({
  chips,
  selectedValue,
  onChange,
  className,
  disabled = false,
}: ChipGroupProps) {
  return (
    <div
      className={cn('flex flex-wrap gap-2', className)}
      role="group"
      aria-label="Quick select options"
    >
      {chips.map((chip) => (
        <Chip
          key={chip.value}
          label={chip.label}
          value={chip.value}
          selected={selectedValue === chip.value}
          onClick={() => onChange?.(chip.value)}
          disabled={disabled}
        />
      ))}
    </div>
  );
}
